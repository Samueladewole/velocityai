"""
Integration service for connecting AI Agents with existing ERIP components.
Handles data synchronization with Trust Equity, Compass, and Atlas.
"""

import asyncio
import aiohttp
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
import structlog
import json
from .database import DatabaseManager
from .storage_service import storage_service
from .validation_service import validation_service

logger = structlog.get_logger()


@dataclass
class TrustPointRecord:
    evidence_id: str
    framework: str
    control_id: str
    evidence_type: str
    confidence_score: float
    ai_collected: bool
    timestamp: datetime
    customer_id: str
    
    
@dataclass
class CompassMapping:
    control_id: str
    framework: str
    compliance_requirement: str
    evidence_artifacts: List[str]
    automation_level: str
    risk_score: float


@dataclass
class AtlasRiskEvent:
    event_id: str
    risk_type: str
    severity: str
    description: str
    affected_controls: List[str]
    mitigation_status: str
    customer_id: str


class ERIPIntegrationService:
    """Service for integrating AI Agents with existing ERIP platform components"""
    
    def __init__(self):
        self.db = DatabaseManager()
        
        # ERIP component endpoints
        self.trust_equity_url = "http://localhost:8003/api/v1"
        self.compass_url = "http://localhost:8004/api/v1" 
        self.atlas_url = "http://localhost:8005/api/v1"
        
        # Integration settings
        self.sync_interval_minutes = 15
        self.batch_size = 100
        self.retry_attempts = 3
    
    async def sync_evidence_to_trust_equity(
        self, 
        evidence_records: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Sync collected evidence to Trust Equity for Trust Score calculation"""
        
        trust_points = []
        
        for evidence in evidence_records:
            # Calculate trust points based on evidence quality and AI collection
            base_points = self._calculate_base_trust_points(evidence)
            ai_multiplier = 3.0 if evidence.get('ai_collected', False) else 1.0
            
            trust_point = TrustPointRecord(
                evidence_id=evidence['id'],
                framework=evidence['framework'],
                control_id=evidence['control_id'],
                evidence_type=evidence['type'],
                confidence_score=evidence.get('validation_score', 0.0),
                ai_collected=evidence.get('ai_collected', False),
                timestamp=datetime.fromisoformat(evidence['created_at']),
                customer_id=evidence['customer_id']
            )
            
            # Apply AI collection multiplier
            adjusted_points = base_points * ai_multiplier
            trust_points.append({
                **asdict(trust_point),
                'points': adjusted_points,
                'multiplier_applied': ai_multiplier
            })
        
        # Send to Trust Equity
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.trust_equity_url}/trust-points/batch",
                    json={
                        'trust_points': trust_points,
                        'source': 'ai_agents',
                        'sync_timestamp': datetime.utcnow().isoformat()
                    }
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        logger.info(
                            "trust_equity_sync_success",
                            records_synced=len(trust_points),
                            total_points=sum(tp['points'] for tp in trust_points)
                        )
                        
                        return {
                            'success': True,
                            'records_synced': len(trust_points),
                            'total_points': sum(tp['points'] for tp in trust_points),
                            'trust_equity_response': result
                        }
                    else:
                        error_text = await response.text()
                        logger.error(
                            "trust_equity_sync_failed",
                            status=response.status,
                            error=error_text
                        )
                        return {'success': False, 'error': error_text}
                        
        except Exception as e:
            logger.error("trust_equity_sync_exception", error=str(e))
            return {'success': False, 'error': str(e)}
    
    def _calculate_base_trust_points(self, evidence: Dict[str, Any]) -> float:
        """Calculate base trust points for evidence"""
        
        # Base points by evidence type
        type_points = {
            'screenshot': 10.0,
            'document': 15.0,
            'configuration': 20.0,
            'audit_log': 25.0,
            'policy': 12.0,
            'procedure': 8.0,
            'training_record': 5.0
        }
        
        base = type_points.get(evidence.get('type', 'screenshot'), 10.0)
        
        # Quality multiplier based on validation score
        validation_score = evidence.get('validation_score', 0.0)
        quality_multiplier = max(0.5, validation_score / 100.0)
        
        # Framework importance multiplier
        framework_multipliers = {
            'SOC2': 1.2,
            'ISO27001': 1.3,
            'HIPAA': 1.4,
            'PCI_DSS': 1.5,
            'GDPR': 1.1,
            'FedRAMP': 1.6
        }
        
        framework_multiplier = framework_multipliers.get(
            evidence.get('framework', ''), 1.0
        )
        
        return base * quality_multiplier * framework_multiplier
    
    async def sync_controls_with_compass(
        self, 
        customer_id: str,
        framework_controls: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Sync control mappings and automation status with Compass"""
        
        compass_mappings = []
        
        for control in framework_controls:
            # Map collected evidence to Compass control format
            mapping = CompassMapping(
                control_id=control['id'],
                framework=control['framework'],
                compliance_requirement=control['description'],
                evidence_artifacts=control.get('evidence_artifacts', []),
                automation_level='high' if control.get('ai_automated', False) else 'manual',
                risk_score=self._calculate_control_risk_score(control)
            )
            
            compass_mappings.append(asdict(mapping))
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.compass_url}/controls/sync",
                    json={
                        'customer_id': customer_id,
                        'mappings': compass_mappings,
                        'automation_source': 'ai_agents',
                        'sync_timestamp': datetime.utcnow().isoformat()
                    }
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        logger.info(
                            "compass_sync_success",
                            customer_id=customer_id,
                            controls_synced=len(compass_mappings)
                        )
                        
                        return {
                            'success': True,
                            'controls_synced': len(compass_mappings),
                            'automation_coverage': len([
                                m for m in compass_mappings 
                                if m['automation_level'] == 'high'
                            ]) / len(compass_mappings) * 100,
                            'compass_response': result
                        }
                    else:
                        error_text = await response.text()
                        logger.error(
                            "compass_sync_failed",
                            status=response.status,
                            error=error_text
                        )
                        return {'success': False, 'error': error_text}
                        
        except Exception as e:
            logger.error("compass_sync_exception", error=str(e))
            return {'success': False, 'error': str(e)}
    
    def _calculate_control_risk_score(self, control: Dict[str, Any]) -> float:
        """Calculate risk score for control based on automation and coverage"""
        
        base_risk = 0.5  # 50% base risk
        
        # Reduce risk based on automation
        if control.get('ai_automated', False):
            base_risk *= 0.3  # 70% risk reduction for AI automation
        
        # Reduce risk based on evidence coverage
        evidence_count = len(control.get('evidence_artifacts', []))
        coverage_multiplier = max(0.1, 1.0 - (evidence_count * 0.1))
        
        # Adjust based on framework criticality
        framework_risk = {
            'SOC2': 0.8,
            'ISO27001': 0.7,
            'HIPAA': 0.9,
            'PCI_DSS': 0.95,
            'GDPR': 0.75,
            'FedRAMP': 1.0
        }
        
        framework_multiplier = framework_risk.get(
            control.get('framework', ''), 0.8
        )
        
        final_risk = base_risk * coverage_multiplier * framework_multiplier
        return round(min(1.0, max(0.0, final_risk)), 2)
    
    async def report_risk_events_to_atlas(
        self,
        customer_id: str,
        risk_events: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Report risk events detected by AI agents to Atlas"""
        
        atlas_events = []
        
        for event in risk_events:
            atlas_event = AtlasRiskEvent(
                event_id=event['id'],
                risk_type=event['type'],
                severity=event['severity'],
                description=event['description'],
                affected_controls=event.get('affected_controls', []),
                mitigation_status='detected',
                customer_id=customer_id
            )
            
            atlas_events.append(asdict(atlas_event))
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.atlas_url}/risk-events/batch",
                    json={
                        'customer_id': customer_id,
                        'events': atlas_events,
                        'source': 'ai_agents',
                        'detection_timestamp': datetime.utcnow().isoformat()
                    }
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        
                        logger.info(
                            "atlas_sync_success",
                            customer_id=customer_id,
                            events_reported=len(atlas_events)
                        )
                        
                        return {
                            'success': True,
                            'events_reported': len(atlas_events),
                            'high_severity_count': len([
                                e for e in atlas_events 
                                if e['severity'] == 'high'
                            ]),
                            'atlas_response': result
                        }
                    else:
                        error_text = await response.text()
                        logger.error(
                            "atlas_sync_failed",
                            status=response.status,
                            error=error_text
                        )
                        return {'success': False, 'error': error_text}
                        
        except Exception as e:
            logger.error("atlas_sync_exception", error=str(e))
            return {'success': False, 'error': str(e)}
    
    async def get_trust_score_update(self, customer_id: str) -> Dict[str, Any]:
        """Get latest Trust Score from Trust Equity"""
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    f"{self.trust_equity_url}/trust-score/{customer_id}"
                ) as response:
                    if response.status == 200:
                        trust_data = await response.json()
                        
                        return {
                            'success': True,
                            'trust_score': trust_data.get('score', 0),
                            'components': trust_data.get('components', {}),
                            'ai_contribution': trust_data.get('ai_points', 0),
                            'last_updated': trust_data.get('last_updated')
                        }
                    else:
                        return {'success': False, 'error': 'Trust Score not found'}
                        
        except Exception as e:
            logger.error("trust_score_fetch_failed", error=str(e))
            return {'success': False, 'error': str(e)}
    
    async def full_platform_sync(self, customer_id: str) -> Dict[str, Any]:
        """Perform comprehensive sync across all ERIP components"""
        
        results = {
            'customer_id': customer_id,
            'sync_timestamp': datetime.utcnow().isoformat(),
            'components': {}
        }
        
        try:
            # Get latest evidence from agents
            session = self.db.SessionLocal()
            
            # Mock evidence query - replace with actual database query
            evidence_records = [
                {
                    'id': 'ev_001',
                    'framework': 'SOC2',
                    'control_id': 'CC6.1',
                    'type': 'screenshot',
                    'validation_score': 95.0,
                    'ai_collected': True,
                    'created_at': datetime.utcnow().isoformat(),
                    'customer_id': customer_id
                }
            ]
            
            # Mock control data
            framework_controls = [
                {
                    'id': 'CC6.1',
                    'framework': 'SOC2',
                    'description': 'Logical access security measures',
                    'evidence_artifacts': ['ev_001'],
                    'ai_automated': True
                }
            ]
            
            # Mock risk events
            risk_events = [
                {
                    'id': 'risk_001',
                    'type': 'configuration_drift',
                    'severity': 'medium',
                    'description': 'AWS security group rules changed',
                    'affected_controls': ['CC6.1', 'CC6.7']
                }
            ]
            
            # Sync with Trust Equity
            trust_result = await self.sync_evidence_to_trust_equity(evidence_records)
            results['components']['trust_equity'] = trust_result
            
            # Sync with Compass
            compass_result = await self.sync_controls_with_compass(
                customer_id, framework_controls
            )
            results['components']['compass'] = compass_result
            
            # Sync with Atlas
            atlas_result = await self.report_risk_events_to_atlas(
                customer_id, risk_events
            )
            results['components']['atlas'] = atlas_result
            
            # Get updated Trust Score
            trust_score = await self.get_trust_score_update(customer_id)
            results['trust_score_update'] = trust_score
            
            # Calculate overall sync success
            component_successes = [
                comp.get('success', False) 
                for comp in results['components'].values()
            ]
            
            results['overall_success'] = all(component_successes)
            results['successful_components'] = sum(component_successes)
            results['total_components'] = len(component_successes)
            
            logger.info(
                "platform_sync_completed",
                customer_id=customer_id,
                success=results['overall_success'],
                components=results['successful_components']
            )
            
            session.close()
            return results
            
        except Exception as e:
            logger.error("platform_sync_failed", customer_id=customer_id, error=str(e))
            results['overall_success'] = False
            results['error'] = str(e)
            return results
    
    async def schedule_periodic_sync(self, customer_id: str):
        """Schedule periodic synchronization with ERIP components"""
        
        while True:
            try:
                await self.full_platform_sync(customer_id)
                await asyncio.sleep(self.sync_interval_minutes * 60)
                
            except asyncio.CancelledError:
                logger.info("periodic_sync_cancelled", customer_id=customer_id)
                break
            except Exception as e:
                logger.error(
                    "periodic_sync_error", 
                    customer_id=customer_id, 
                    error=str(e)
                )
                await asyncio.sleep(60)  # Wait 1 minute before retry
    
    async def create_agent_performance_report(
        self, 
        customer_id: str,
        period_days: int = 30
    ) -> Dict[str, Any]:
        """Create performance report for AI agent integration"""
        
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=period_days)
        
        # Mock data - replace with actual queries
        report = {
            'customer_id': customer_id,
            'report_period': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat(),
                'days': period_days
            },
            'evidence_collection': {
                'total_items': 1547,
                'ai_collected': 1471,
                'manual_collected': 76,
                'automation_rate': 95.1
            },
            'trust_score_impact': {
                'starting_score': 67.3,
                'ending_score': 89.7,
                'improvement': 22.4,
                'ai_contribution_points': 3847
            },
            'framework_coverage': {
                'SOC2': {'controls': 64, 'automated': 61, 'coverage': 95.3},
                'ISO27001': {'controls': 114, 'automated': 108, 'coverage': 94.7},
                'GDPR': {'controls': 23, 'automated': 22, 'coverage': 95.7}
            },
            'risk_detection': {
                'total_events': 23,
                'high_severity': 3,
                'medium_severity': 12,
                'low_severity': 8,
                'resolved': 18
            },
            'time_savings': {
                'manual_hours_saved': 387.5,
                'cost_savings_usd': 15500,
                'onboarding_time_reduction': '92%'
            }
        }
        
        return report


# Global instance
erip_integration = ERIPIntegrationService()