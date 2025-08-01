#!/usr/bin/env python3
"""
Velocity.ai GitHub Security Analyzer Agent
Real-time security analysis and compliance monitoring for GitHub repositories

Features:
- Repository security configuration analysis
- Secrets scanning and vulnerability detection
- Branch protection and access control evaluation
- Dependency security assessment
- Actions workflow security review
- SAST/DAST integration analysis
- Compliance scoring against SOC2, ISO27001, GDPR
- Organization-wide security posture monitoring
"""

import asyncio
import json
import logging
import hashlib
import aiohttp
import base64
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import psycopg2
import psycopg2.extras
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('github-analyzer')

@dataclass
class GitHubEvidence:
    """Evidence item collected from GitHub"""
    evidence_id: str
    evidence_type: str
    resource_type: str
    resource_id: str
    organization: str
    repository: Optional[str]
    data: Dict[str, Any]
    compliance_status: str
    risk_level: str
    frameworks: List[str]
    collection_timestamp: str
    evidence_hash: str

@dataclass
class SecurityFinding:
    """Security finding from analysis"""
    finding_id: str
    severity: str
    category: str
    title: str
    description: str
    remediation: str
    affected_resource: str
    confidence: str

class GitHubAnalyzer:
    """
    Production GitHub Security Analyzer Agent
    
    Performs comprehensive security analysis across GitHub organizations
    and repositories with real-time compliance evaluation.
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.agent_id = config.get('agent_id', 'github-analyzer-001')
        self.github_token = config.get('github_token')
        self.github_org = config.get('github_org')
        self.github_api_url = config.get('github_api_url', 'https://api.github.com')
        
        # GitHub API session
        self.session = None
        
        # Database connection
        self.db_connection = None
        
        # Evidence storage
        self.evidence_buffer: List[GitHubEvidence] = []
        self.max_buffer_size = config.get('max_buffer_size', 100)
        
        # Security findings storage
        self.findings_buffer: List[SecurityFinding] = []
        
        # Performance metrics
        self.metrics = {
            'repositories_scanned': 0,
            'evidence_collected': 0,
            'security_findings': 0,
            'compliance_checks_run': 0,
            'api_calls_made': 0,
            'errors_encountered': 0,
            'last_scan_time': None
        }
        
        # Rate limiting
        self.rate_limit_remaining = 5000
        self.rate_limit_reset = datetime.utcnow()
        
        # Initialize components
        self._initialize_session()
        self._initialize_database()
        
        logger.info(f"🚀 GitHub Analyzer {self.agent_id} initialized for org {self.github_org}")
    
    def _initialize_session(self):
        """Initialize GitHub API session with authentication"""
        try:
            self.session = aiohttp.ClientSession(
                headers={
                    'Authorization': f'token {self.github_token}',
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': f'Velocity-GitHub-Analyzer/{self.agent_id}'
                },
                timeout=aiohttp.ClientTimeout(total=30)
            )
            
            logger.info("✅ GitHub API session initialized")
            
        except Exception as e:
            logger.error(f"❌ GitHub API session initialization failed: {e}")
            raise
    
    def _initialize_database(self):
        """Initialize database connection for evidence storage"""
        try:
            self.db_connection = psycopg2.connect(
                self.config.get('database_url', 'postgresql://localhost/velocity_agents'),
                cursor_factory=psycopg2.extras.RealDictCursor
            )
            self.db_connection.autocommit = True
            logger.info("✅ Database connection established")
            
        except Exception as e:
            logger.error(f"❌ Database connection failed: {e}")
            raise
    
    async def start_analysis(self):
        """Start the GitHub security analysis process"""
        logger.info("🔍 Starting GitHub security analysis")
        
        try:
            while True:
                analysis_start = datetime.utcnow()
                
                # Verify API rate limits
                await self._check_rate_limits()
                
                # Analyze organization security
                await self._analyze_organization()
                
                # Get and analyze all repositories
                repositories = await self._get_repositories()
                
                for repo in repositories:
                    try:
                        await self._analyze_repository(repo)
                        
                        # Respect rate limits
                        if self.rate_limit_remaining < 100:
                            wait_time = (self.rate_limit_reset - datetime.utcnow()).total_seconds()
                            if wait_time > 0:
                                logger.info(f"⏳ Rate limit protection: waiting {wait_time:.0f}s")
                                await asyncio.sleep(wait_time)
                                await self._check_rate_limits()
                        
                    except Exception as e:
                        logger.error(f"❌ Failed to analyze repository {repo.get('name', 'unknown')}: {e}")
                        self.metrics['errors_encountered'] += 1
                
                # Process collected evidence and findings
                await self._process_evidence_buffer()
                await self._process_findings_buffer()
                
                # Update metrics
                self.metrics['last_scan_time'] = analysis_start.isoformat()
                
                analysis_duration = (datetime.utcnow() - analysis_start).total_seconds()
                logger.info(f"✅ Analysis cycle completed in {analysis_duration:.2f}s")
                
                # Send heartbeat with metrics
                await self._send_heartbeat()
                
                # Wait for next analysis interval
                await asyncio.sleep(self.config.get('analysis_interval', 1800))  # 30 minutes default
                
        except Exception as e:
            logger.error(f"❌ GitHub analysis error: {e}")
            self.metrics['errors_encountered'] += 1
            await asyncio.sleep(300)  # Wait 5 minutes before retry
    
    async def _check_rate_limits(self):
        """Check and update GitHub API rate limits"""
        try:
            async with self.session.get(f"{self.github_api_url}/rate_limit") as response:
                if response.status == 200:
                    data = await response.json()
                    core_limits = data.get('resources', {}).get('core', {})
                    
                    self.rate_limit_remaining = core_limits.get('remaining', 0)
                    reset_timestamp = core_limits.get('reset', 0)
                    self.rate_limit_reset = datetime.fromtimestamp(reset_timestamp)
                    
                    logger.info(f"📊 Rate limit: {self.rate_limit_remaining} requests remaining")
                    self.metrics['api_calls_made'] += 1
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to check rate limits: {e}")
    
    async def _get_repositories(self) -> List[Dict]:
        """Get all repositories for the organization"""
        repositories = []
        page = 1
        per_page = 100
        
        try:
            while True:
                url = f"{self.github_api_url}/orgs/{self.github_org}/repos"
                params = {
                    'page': page,
                    'per_page': per_page,
                    'sort': 'updated',
                    'type': 'all'
                }
                
                async with self.session.get(url, params=params) as response:
                    self.metrics['api_calls_made'] += 1
                    self._update_rate_limits(response.headers)
                    
                    if response.status == 200:
                        repos = await response.json()
                        if not repos:
                            break
                            
                        repositories.extend(repos)
                        
                        if len(repos) < per_page:
                            break
                            
                        page += 1
                    else:
                        logger.error(f"❌ Failed to fetch repositories: {response.status}")
                        break
            
            logger.info(f"📊 Found {len(repositories)} repositories")
            return repositories
            
        except Exception as e:
            logger.error(f"❌ Failed to get repositories: {e}")
            return []
    
    async def _analyze_organization(self):
        """Analyze organization-level security settings"""
        try:
            logger.info("📊 Analyzing organization security")
            
            # Get organization details
            org_data = await self._get_organization_details()
            
            # Get organization security settings
            security_settings = await self._get_organization_security_settings()
            
            # Combine data
            org_evidence_data = {
                **org_data,
                'security_settings': security_settings,
                'members_count': await self._get_members_count(),
                'teams_count': await self._get_teams_count()
            }
            
            # Create evidence item
            evidence = await self._create_organization_evidence(org_evidence_data)
            
            # Run compliance checks
            await self._evaluate_compliance(evidence)
            
            # Add to buffer
            self.evidence_buffer.append(evidence)
            self.metrics['evidence_collected'] += 1
            
            logger.info("📊 Organization analysis completed")
            
        except Exception as e:
            logger.error(f"❌ Organization analysis failed: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _get_organization_details(self) -> Dict:
        """Get basic organization information"""
        try:
            url = f"{self.github_api_url}/orgs/{self.github_org}"
            
            async with self.session.get(url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    return await response.json()
                else:
                    logger.error(f"❌ Failed to get org details: {response.status}")
                    return {}
                    
        except Exception as e:
            logger.error(f"❌ Failed to get organization details: {e}")
            return {}
    
    async def _get_organization_security_settings(self) -> Dict:
        """Get organization security and policy settings"""
        security_settings = {}
        
        try:
            # Get organization security policies
            policies_url = f"{self.github_api_url}/orgs/{self.github_org}/security-and-analysis"
            
            async with self.session.get(policies_url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    security_settings['security_and_analysis'] = await response.json()
            
            # Get organization member privileges
            members_url = f"{self.github_api_url}/orgs/{self.github_org}"
            
            async with self.session.get(members_url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    org_data = await response.json()
                    security_settings.update({
                        'members_can_create_repositories': org_data.get('members_can_create_repositories'),
                        'members_can_create_public_repositories': org_data.get('members_can_create_public_repositories'),
                        'members_can_create_private_repositories': org_data.get('members_can_create_private_repositories'),
                        'members_can_fork_private_repositories': org_data.get('members_can_fork_private_repositories'),
                        'two_factor_requirement_enabled': org_data.get('two_factor_requirement_enabled'),
                        'default_repository_permission': org_data.get('default_repository_permission')
                    })
            
        except Exception as e:
            logger.warning(f"⚠️ Failed to get some security settings: {e}")
        
        return security_settings
    
    async def _get_members_count(self) -> int:
        """Get organization members count"""
        try:
            url = f"{self.github_api_url}/orgs/{self.github_org}/members"
            
            async with self.session.get(url, params={'per_page': 1}) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    # Get count from Link header pagination
                    link_header = response.headers.get('Link', '')
                    if 'rel="last"' in link_header:
                        # Extract page number from last page link
                        import re
                        match = re.search(r'page=(\d+).*rel="last"', link_header)
                        if match:
                            return int(match.group(1))
                    
                    # Fallback: get first page and count
                    members = await response.json()
                    return len(members)
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get members count: {e}")
        
        return 0
    
    async def _get_teams_count(self) -> int:
        """Get organization teams count"""
        try:
            url = f"{self.github_api_url}/orgs/{self.github_org}/teams"
            
            async with self.session.get(url, params={'per_page': 1}) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    teams = await response.json()
                    return len(teams)
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get teams count: {e}")
        
        return 0
    
    async def _analyze_repository(self, repo: Dict):
        """Analyze individual repository security"""
        repo_name = repo['name']
        
        try:
            logger.info(f"📊 Analyzing repository: {repo_name}")
            
            # Collect repository security data
            repo_security_data = {
                'basic_info': repo,
                'branch_protection': await self._get_branch_protection(repo_name),
                'security_alerts': await self._get_security_alerts(repo_name),
                'vulnerability_alerts': await self._get_vulnerability_alerts(repo_name),
                'secrets_scanning': await self._get_secrets_scanning_status(repo_name),
                'dependency_graph': await self._get_dependency_graph_status(repo_name),
                'code_scanning': await self._get_code_scanning_status(repo_name),
                'workflows': await self._analyze_github_actions(repo_name),
                'collaborators': await self._get_collaborators(repo_name),
                'deploy_keys': await self._get_deploy_keys(repo_name),
                'webhooks': await self._get_webhooks(repo_name)
            }
            
            # Create evidence item
            evidence = await self._create_repository_evidence(repo_security_data, repo_name)
            
            # Run compliance checks and security analysis
            await self._evaluate_compliance(evidence)
            findings = await self._analyze_security_issues(repo_security_data, repo_name)
            
            # Add to buffers
            self.evidence_buffer.append(evidence)
            self.findings_buffer.extend(findings)
            
            self.metrics['repositories_scanned'] += 1
            self.metrics['evidence_collected'] += 1
            self.metrics['security_findings'] += len(findings)
            
        except Exception as e:
            logger.error(f"❌ Failed to analyze repository {repo_name}: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _get_branch_protection(self, repo_name: str) -> Dict:
        """Get branch protection settings"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/branches"
            
            async with self.session.get(url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    branches = await response.json()
                    protection_info = {}
                    
                    for branch in branches:
                        if branch.get('protected'):
                            branch_name = branch['name']
                            protection_url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/branches/{branch_name}/protection"
                            
                            async with self.session.get(protection_url) as prot_response:
                                self.metrics['api_calls_made'] += 1
                                self._update_rate_limits(prot_response.headers)
                                
                                if prot_response.status == 200:
                                    protection_info[branch_name] = await prot_response.json()
                    
                    return protection_info
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get branch protection for {repo_name}: {e}")
        
        return {}
    
    async def _get_security_alerts(self, repo_name: str) -> List[Dict]:
        """Get repository security alerts"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/security-advisories"
            
            async with self.session.get(url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    return await response.json()
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get security alerts for {repo_name}: {e}")
        
        return []
    
    async def _get_vulnerability_alerts(self, repo_name: str) -> Dict:
        """Get vulnerability alerts status"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/vulnerability-alerts"
            
            async with self.session.get(url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                return {
                    'enabled': response.status == 204,
                    'status_code': response.status
                }
                
        except Exception as e:
            logger.warning(f"⚠️ Failed to get vulnerability alerts for {repo_name}: {e}")
        
        return {'enabled': False, 'error': str(e)}
    
    async def _get_secrets_scanning_status(self, repo_name: str) -> Dict:
        """Get secrets scanning status"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/secret-scanning/alerts"
            
            async with self.session.get(url, params={'per_page': 1}) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    alerts = await response.json()
                    return {
                        'enabled': True,
                        'alerts_count': len(alerts)
                    }
                elif response.status == 404:
                    return {'enabled': False, 'reason': 'Not available'}
                else:
                    return {'enabled': False, 'status_code': response.status}
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get secrets scanning status for {repo_name}: {e}")
        
        return {'enabled': False, 'error': str(e)}
    
    async def _get_dependency_graph_status(self, repo_name: str) -> Dict:
        """Get dependency graph status"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/dependency-graph/compare/HEAD"
            
            async with self.session.get(url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                return {
                    'enabled': response.status != 404,
                    'status_code': response.status
                }
                
        except Exception as e:
            logger.warning(f"⚠️ Failed to get dependency graph status for {repo_name}: {e}")
        
        return {'enabled': False, 'error': str(e)}
    
    async def _get_code_scanning_status(self, repo_name: str) -> Dict:
        """Get code scanning status and alerts"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/code-scanning/alerts"
            
            async with self.session.get(url, params={'per_page': 10}) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    alerts = await response.json()
                    return {
                        'enabled': True,
                        'alerts_count': len(alerts),
                        'recent_alerts': alerts[:5]  # Include first 5 alerts for analysis
                    }
                elif response.status == 404:
                    return {'enabled': False, 'reason': 'Code scanning not configured'}
                else:
                    return {'enabled': False, 'status_code': response.status}
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get code scanning status for {repo_name}: {e}")
        
        return {'enabled': False, 'error': str(e)}
    
    async def _analyze_github_actions(self, repo_name: str) -> Dict:
        """Analyze GitHub Actions workflows for security issues"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/actions/workflows"
            
            async with self.session.get(url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    workflows_data = await response.json()
                    workflows = workflows_data.get('workflows', [])
                    
                    workflow_analysis = {
                        'total_workflows': len(workflows),
                        'active_workflows': len([w for w in workflows if w.get('state') == 'active']),
                        'workflows': []
                    }
                    
                    # Analyze each workflow file
                    for workflow in workflows[:10]:  # Limit to 10 workflows to avoid rate limits
                        workflow_details = await self._analyze_workflow_file(repo_name, workflow)
                        workflow_analysis['workflows'].append(workflow_details)
                    
                    return workflow_analysis
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to analyze GitHub Actions for {repo_name}: {e}")
        
        return {'total_workflows': 0, 'error': str(e)}
    
    async def _analyze_workflow_file(self, repo_name: str, workflow: Dict) -> Dict:
        """Analyze individual workflow file for security issues"""
        workflow_info = {
            'name': workflow.get('name'),
            'path': workflow.get('path'),
            'state': workflow.get('state'),
            'security_issues': []
        }
        
        try:
            # Get workflow file content
            file_url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/contents/{workflow['path']}"
            
            async with self.session.get(file_url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    file_data = await response.json()
                    content = base64.b64decode(file_data['content']).decode('utf-8')
                    
                    # Basic security checks on workflow content
                    security_issues = []
                    
                    # Check for hardcoded secrets
                    if any(keyword in content.lower() for keyword in ['password', 'api_key', 'secret', 'token']):
                        if not '€{{' in content:  # No variable substitution
                            security_issues.append('Potential hardcoded secrets detected')
                    
                    # Check for unsafe actions
                    unsafe_actions = ['actions/checkout@v1', 'actions/setup-node@v1']
                    for unsafe_action in unsafe_actions:
                        if unsafe_action in content:
                            security_issues.append(f'Deprecated/unsafe action: {unsafe_action}')
                    
                    # Check for pull request triggers from forks
                    if 'pull_request_target' in content:
                        security_issues.append('pull_request_target trigger detected - review for safety')
                    
                    workflow_info['security_issues'] = security_issues
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to analyze workflow file {workflow['path']}: {e}")
            workflow_info['analysis_error'] = str(e)
        
        return workflow_info
    
    async def _get_collaborators(self, repo_name: str) -> List[Dict]:
        """Get repository collaborators"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/collaborators"
            
            async with self.session.get(url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    return await response.json()
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get collaborators for {repo_name}: {e}")
        
        return []
    
    async def _get_deploy_keys(self, repo_name: str) -> List[Dict]:
        """Get repository deploy keys"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/keys"
            
            async with self.session.get(url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    return await response.json()
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get deploy keys for {repo_name}: {e}")
        
        return []
    
    async def _get_webhooks(self, repo_name: str) -> List[Dict]:
        """Get repository webhooks"""
        try:
            url = f"{self.github_api_url}/repos/{self.github_org}/{repo_name}/hooks"
            
            async with self.session.get(url) as response:
                self.metrics['api_calls_made'] += 1
                self._update_rate_limits(response.headers)
                
                if response.status == 200:
                    return await response.json()
                    
        except Exception as e:
            logger.warning(f"⚠️ Failed to get webhooks for {repo_name}: {e}")
        
        return []
    
    async def _create_organization_evidence(self, org_data: Dict) -> GitHubEvidence:
        """Create evidence item from organization data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(org_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return GitHubEvidence(
            evidence_id=f"github_org_{self.github_org}_{datetime.utcnow().timestamp()}",
            evidence_type='github_organization_configuration',
            resource_type='github.com/Organization',
            resource_id=self.github_org,
            organization=self.github_org,
            repository=None,
            data=org_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _create_repository_evidence(self, repo_data: Dict, repo_name: str) -> GitHubEvidence:
        """Create evidence item from repository data"""
        
        # Calculate evidence hash
        evidence_hash = hashlib.sha256(
            json.dumps(repo_data, sort_keys=True, default=str).encode()
        ).hexdigest()
        
        return GitHubEvidence(
            evidence_id=f"github_repo_{repo_name}_{datetime.utcnow().timestamp()}",
            evidence_type='github_repository_configuration',
            resource_type='github.com/Repository',
            resource_id=repo_name,
            organization=self.github_org,
            repository=repo_name,
            data=repo_data,
            compliance_status='pending',
            risk_level='unknown',
            frameworks=['SOC2', 'ISO27001', 'GDPR'],
            collection_timestamp=datetime.utcnow().isoformat(),
            evidence_hash=evidence_hash
        )
    
    async def _analyze_security_issues(self, repo_data: Dict, repo_name: str) -> List[SecurityFinding]:
        """Analyze repository data for security issues"""
        findings = []
        
        # Check for missing branch protection
        if not repo_data.get('branch_protection'):
            findings.append(SecurityFinding(
                finding_id=f"github_{repo_name}_no_branch_protection_{datetime.utcnow().timestamp()}",
                severity='medium',
                category='access_control',
                title='Missing Branch Protection',
                description='Repository lacks branch protection rules on main/master branch',
                remediation='Enable branch protection with required status checks and reviews',
                affected_resource=f"{self.github_org}/{repo_name}",
                confidence='high'
            ))
        
        # Check for public repository with sensitive data
        basic_info = repo_data.get('basic_info', {})
        if basic_info.get('private') is False:
            findings.append(SecurityFinding(
                finding_id=f"github_{repo_name}_public_repo_{datetime.utcnow().timestamp()}",
                severity='low',
                category='data_exposure',
                title='Public Repository',
                description='Repository is publicly accessible',
                remediation='Review if repository should be private or if sensitive data is exposed',
                affected_resource=f"{self.github_org}/{repo_name}",
                confidence='high'
            ))
        
        # Check for missing security features
        if not repo_data.get('vulnerability_alerts', {}).get('enabled'):
            findings.append(SecurityFinding(
                finding_id=f"github_{repo_name}_no_vuln_alerts_{datetime.utcnow().timestamp()}",
                severity='medium',
                category='vulnerability_management',
                title='Vulnerability Alerts Disabled',
                description='Repository does not have vulnerability alerts enabled',
                remediation='Enable vulnerability alerts in repository security settings',
                affected_resource=f"{self.github_org}/{repo_name}",
                confidence='high'
            ))
        
        # Check for secrets scanning
        secrets_status = repo_data.get('secrets_scanning', {})
        if not secrets_status.get('enabled'):
            findings.append(SecurityFinding(
                finding_id=f"github_{repo_name}_no_secrets_scan_{datetime.utcnow().timestamp()}",
                severity='high',
                category='secrets_management',
                title='Secrets Scanning Disabled',
                description='Repository does not have secrets scanning enabled',
                remediation='Enable secrets scanning in repository security settings',
                affected_resource=f"{self.github_org}/{repo_name}",
                confidence='high'
            ))
        elif secrets_status.get('alerts_count', 0) > 0:
            findings.append(SecurityFinding(
                finding_id=f"github_{repo_name}_secrets_found_{datetime.utcnow().timestamp()}",
                severity='critical',
                category='secrets_management',
                title='Secrets Detected',
                description=f"Repository has {secrets_status['alerts_count']} secret scanning alerts",
                remediation='Review and remediate all secret scanning alerts immediately',
                affected_resource=f"{self.github_org}/{repo_name}",
                confidence='high'
            ))
        
        # Check for code scanning
        code_scanning = repo_data.get('code_scanning', {})
        if not code_scanning.get('enabled'):
            findings.append(SecurityFinding(
                finding_id=f"github_{repo_name}_no_code_scan_{datetime.utcnow().timestamp()}",
                severity='medium',
                category='static_analysis',
                title='Code Scanning Not Configured',
                description='Repository does not have code scanning configured',
                remediation='Configure GitHub code scanning or integrate SAST tools',
                affected_resource=f"{self.github_org}/{repo_name}",
                confidence='high'
            ))
        elif code_scanning.get('alerts_count', 0) > 0:
            findings.append(SecurityFinding(
                finding_id=f"github_{repo_name}_code_alerts_{datetime.utcnow().timestamp()}",
                severity='medium',
                category='static_analysis',
                title='Code Scanning Alerts',
                description=f"Repository has {code_scanning['alerts_count']} code scanning alerts",
                remediation='Review and remediate code scanning findings',
                affected_resource=f"{self.github_org}/{repo_name}",
                confidence='high'
            ))
        
        # Check GitHub Actions security
        workflows = repo_data.get('workflows', {})
        for workflow in workflows.get('workflows', []):
            if workflow.get('security_issues'):
                for issue in workflow['security_issues']:
                    findings.append(SecurityFinding(
                        finding_id=f"github_{repo_name}_workflow_issue_{datetime.utcnow().timestamp()}",
                        severity='medium',
                        category='ci_cd_security',
                        title='GitHub Actions Security Issue',
                        description=f"Workflow {workflow['name']}: {issue}",
                        remediation='Review and fix GitHub Actions workflow security issues',
                        affected_resource=f"{self.github_org}/{repo_name}:{workflow['path']}",
                        confidence='medium'
                    ))
        
        return findings
    
    async def _evaluate_compliance(self, evidence: GitHubEvidence):
        """Evaluate evidence against compliance frameworks"""
        try:
            # Simple compliance scoring based on security features
            score = 100
            
            if evidence.resource_type == 'github.com/Repository':
                repo_data = evidence.data
                
                # Branch protection check
                if not repo_data.get('branch_protection'):
                    score -= 20
                
                # Security features checks
                if not repo_data.get('vulnerability_alerts', {}).get('enabled'):
                    score -= 15
                
                if not repo_data.get('secrets_scanning', {}).get('enabled'):
                    score -= 25
                
                if not repo_data.get('code_scanning', {}).get('enabled'):
                    score -= 15
                
                # Public repository penalty
                if repo_data.get('basic_info', {}).get('private') is False:
                    score -= 10
            
            elif evidence.resource_type == 'github.com/Organization':
                org_data = evidence.data
                security_settings = org_data.get('security_settings', {})
                
                # Two-factor authentication check
                if not security_settings.get('two_factor_requirement_enabled'):
                    score -= 30
                
                # Member privileges check
                if security_settings.get('members_can_create_public_repositories'):
                    score -= 15
            
            # Set compliance status and risk level
            if score >= 85:
                evidence.compliance_status = 'compliant'
                evidence.risk_level = 'low'
            elif score >= 70:
                evidence.compliance_status = 'partial'
                evidence.risk_level = 'medium'
            else:
                evidence.compliance_status = 'non_compliant'
                evidence.risk_level = 'high'
            
            self.metrics['compliance_checks_run'] += 1
            
        except Exception as e:
            logger.error(f"❌ Compliance evaluation failed: {e}")
            evidence.compliance_status = 'error'
            evidence.risk_level = 'unknown'
    
    def _update_rate_limits(self, headers):
        """Update rate limit information from API response headers"""
        try:
            self.rate_limit_remaining = int(headers.get('X-RateLimit-Remaining', self.rate_limit_remaining))
            reset_timestamp = int(headers.get('X-RateLimit-Reset', 0))
            if reset_timestamp:
                self.rate_limit_reset = datetime.fromtimestamp(reset_timestamp)
        except (ValueError, TypeError):
            pass
    
    async def _process_evidence_buffer(self):
        """Process and store evidence buffer to database"""
        if not self.evidence_buffer:
            return
        
        try:
            with self.db_connection.cursor() as cursor:
                for evidence in self.evidence_buffer:
                    # Store evidence in database
                    cursor.execute("""
                        INSERT INTO evidence_collection 
                        (id, agent_id, evidence_type, source_system, collection_timestamp, 
                         evidence_hash, evidence_size, compliance_framework, 
                         verification_status, metadata)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (evidence_hash) DO UPDATE SET
                        collection_timestamp = EXCLUDED.collection_timestamp,
                        metadata = EXCLUDED.metadata
                    """, (
                        evidence.evidence_id,
                        self.agent_id,
                        evidence.evidence_type,
                        'github',
                        evidence.collection_timestamp,
                        evidence.evidence_hash,
                        len(json.dumps(evidence.data)),
                        ','.join(evidence.frameworks),
                        evidence.compliance_status,
                        json.dumps(asdict(evidence))
                    ))
            
            logger.info(f"📦 Stored {len(self.evidence_buffer)} evidence items to database")
            
            # Clear buffer
            self.evidence_buffer.clear()
            
        except Exception as e:
            logger.error(f"❌ Failed to store evidence: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _process_findings_buffer(self):
        """Process and store security findings to database"""
        if not self.findings_buffer:
            return
        
        try:
            with self.db_connection.cursor() as cursor:
                for finding in self.findings_buffer:
                    # Store finding in database (assuming we have a findings table)
                    cursor.execute("""
                        INSERT INTO security_findings 
                        (id, agent_id, severity, category, title, description, 
                         remediation, affected_resource, confidence, created_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO NOTHING
                    """, (
                        finding.finding_id,
                        self.agent_id,
                        finding.severity,
                        finding.category,
                        finding.title,
                        finding.description,
                        finding.remediation,
                        finding.affected_resource,
                        finding.confidence,
                        datetime.utcnow()
                    ))
            
            logger.info(f"📦 Stored {len(self.findings_buffer)} security findings to database")
            
            # Clear buffer
            self.findings_buffer.clear()
            
        except Exception as e:
            logger.error(f"❌ Failed to store findings: {e}")
            self.metrics['errors_encountered'] += 1
    
    async def _send_heartbeat(self):
        """Send heartbeat with metrics to orchestrator"""
        try:
            heartbeat_data = {
                'type': 'heartbeat',
                'agent_id': self.agent_id,
                'timestamp': datetime.utcnow().isoformat(),
                'metrics': {
                    'cpu_usage': 35.0,  # Would get actual CPU usage
                    'memory_usage_mb': 128,  # Would get actual memory usage
                    'response_time_ms': 200,  # Would calculate actual response time
                    'repositories_scanned': self.metrics['repositories_scanned'],
                    'evidence_collected': self.metrics['evidence_collected'],
                    'security_findings': self.metrics['security_findings'],
                    'compliance_checks_run': self.metrics['compliance_checks_run'],
                    'errors_encountered': self.metrics['errors_encountered'],
                    'rate_limit_remaining': self.rate_limit_remaining
                }
            }
            
            print(json.dumps(heartbeat_data))  # Send to orchestrator via stdout
            
        except Exception as e:
            logger.error(f"❌ Failed to send heartbeat: {e}")
    
    async def get_health_status(self) -> Dict[str, Any]:
        """Get agent health status for monitoring"""
        return {
            'agent_id': self.agent_id,
            'status': 'healthy',
            'github_org': self.github_org,
            'metrics': self.metrics,
            'buffer_sizes': {
                'evidence': len(self.evidence_buffer),
                'findings': len(self.findings_buffer)
            },
            'database_connected': self.db_connection is not None,
            'github_authenticated': self.github_token is not None,
            'rate_limit_remaining': self.rate_limit_remaining,
            'rate_limit_reset': self.rate_limit_reset.isoformat(),
            'last_heartbeat': datetime.utcnow().isoformat()
        }
    
    async def shutdown(self):
        """Graceful shutdown of the agent"""
        logger.info(f"🛑 Shutting down GitHub Analyzer {self.agent_id}")
        
        # Process remaining evidence and findings
        if self.evidence_buffer:
            await self._process_evidence_buffer()
        
        if self.findings_buffer:
            await self._process_findings_buffer()
        
        # Close HTTP session
        if self.session:
            await self.session.close()
        
        # Close database connection
        if self.db_connection:
            self.db_connection.close()
        
        logger.info("✅ GitHub Analyzer shutdown complete")

# Main execution for standalone testing
async def main():
    """Main function for testing the GitHub Analyzer"""
    
    # Test configuration
    config = {
        'agent_id': 'github-analyzer-test',
        'github_token': 'ghp_test_token',  # Would use real GitHub token
        'github_org': 'test-organization',  # Would use real organization
        'analysis_interval': 1800,
        'database_url': 'postgresql://localhost/velocity_agents'
    }
    
    try:
        # Create and start analyzer
        analyzer = GitHubAnalyzer(config)
        
        # Run health check
        health = await analyzer.get_health_status()
        print(f"Agent Health: {json.dumps(health, indent=2)}")
        
        # Start analysis (would run indefinitely in production)
        # await analyzer.start_analysis()
        
    except Exception as e:
        logger.error(f"❌ Agent startup failed: {e}")
    
    finally:
        if 'analyzer' in locals():
            await analyzer.shutdown()

if __name__ == "__main__":
    asyncio.run(main())