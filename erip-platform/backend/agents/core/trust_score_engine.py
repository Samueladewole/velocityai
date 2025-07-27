from typing import Dict, List, Any, Optional, Tuple
import asyncio
import structlog
from dataclasses import dataclass
from datetime import datetime, timedelta
import math
from ..core.database import DatabaseManager, Evidence, TrustScore
from ..core.celery_app import app

logger = structlog.get_logger()

@dataclass
class FrameworkWeight:
    security: float = 0.3
    compliance: float = 0.25
    operations: float = 0.25
    governance: float = 0.2

@dataclass
class TierMultipliers:
    manual_evidence: float = 1.0
    ai_evidence: float = 3.0
    continuous_monitoring: float = 5.0
    automation_bonus: float = 1.5

class TrustScoreEngine:
    """High-performance Trust Score calculation engine"""
    
    def __init__(self, db_manager: DatabaseManager):
        self.db = db_manager
        self.framework_weights = FrameworkWeight()
        self.tier_multipliers = TierMultipliers()
        
        # Compliance framework mappings
        self.framework_controls = {
            'SOC2': {
                'total_controls': 64,
                'critical_controls': ['CC6.1', 'CC6.2', 'CC6.3', 'CC7.1', 'CC7.2'],
                'weight': 1.0
            },
            'ISO27001': {
                'total_controls': 114,
                'critical_controls': ['A.9.2.1', 'A.9.2.4', 'A.12.6.1', 'A.16.1.1'],
                'weight': 1.2
            },
            'GDPR': {
                'total_controls': 47,
                'critical_controls': ['Art25', 'Art32', 'Art35', 'Art37'],
                'weight': 0.8
            },
            'HIPAA': {
                'total_controls': 78,
                'critical_controls': ['164.312(a)(1)', '164.312(e)(1)', '164.306(a)(1)'],
                'weight': 1.1
            }
        }
    
    async def calculate_instant_trust_score(
        self, 
        customer_id: str, 
        evidence_items: List[Evidence],
        automation_percentage: float = 0.0
    ) -> Dict[str, Any]:
        """Calculate Trust Score instantly from evidence"""
        
        try:
            # Parallel calculation of different score components
            tasks = [
                self._calculate_security_score(evidence_items),
                self._calculate_compliance_score(evidence_items),
                self._calculate_operations_score(evidence_items),
                self._calculate_governance_score(evidence_items)
            ]
            
            security_score, compliance_score, operations_score, governance_score = await asyncio.gather(*tasks)
            
            # Calculate weighted overall score
            overall_score = (
                security_score * self.framework_weights.security +
                compliance_score * self.framework_weights.compliance +
                operations_score * self.framework_weights.operations +
                governance_score * self.framework_weights.governance
            )
            
            # Apply automation bonus
            if automation_percentage > 0.7:  # 70%+ automation
                overall_score *= self.tier_multipliers.automation_bonus
            
            # Normalize to 0-100 scale
            overall_score = min(100, overall_score * 100)
            
            # Calculate framework-specific scores
            framework_scores = await self._calculate_framework_scores(evidence_items)
            
            # Calculate control-level scores
            control_scores = await self._calculate_control_scores(evidence_items)
            
            # Calculate Trust Equity points
            trust_points = await self._calculate_trust_equity_points(evidence_items, automation_percentage)
            
            # Calculate next milestone
            next_milestone = self._calculate_next_milestone(overall_score, framework_scores)
            
            return {
                'overall_score': round(overall_score, 1),
                'component_scores': {
                    'security': round(security_score * 100, 1),
                    'compliance': round(compliance_score * 100, 1),
                    'operations': round(operations_score * 100, 1),
                    'governance': round(governance_score * 100, 1)
                },
                'framework_scores': framework_scores,
                'control_scores': control_scores,
                'evidence_count': len(evidence_items),
                'automation_percentage': automation_percentage,
                'trust_equity': trust_points,
                'next_milestone': next_milestone,
                'calculated_at': datetime.utcnow().isoformat(),
                'grade': self._get_trust_grade(overall_score),
                'recommendations': await self._generate_recommendations(evidence_items, framework_scores)
            }
            
        except Exception as e:
            logger.error("trust_score_calculation_failed", error=str(e), customer_id=customer_id)
            raise
    
    async def _calculate_security_score(self, evidence_items: List[Evidence]) -> float:
        """Calculate security component score"""
        
        security_controls = [
            'access_control', 'authentication', 'encryption', 'network_security',
            'vulnerability_management', 'incident_response'
        ]
        
        security_evidence = [
            e for e in evidence_items 
            if any(control in e.control_id.lower() for control in security_controls)
        ]
        
        if not security_evidence:
            return 0.0
        
        # Score based on evidence quality and coverage
        quality_scores = [e.validation_score or 0.5 for e in security_evidence]
        coverage_score = min(1.0, len(security_evidence) / 10)  # Expect ~10 security controls
        
        base_score = sum(quality_scores) / len(quality_scores) if quality_scores else 0
        return base_score * coverage_score
    
    async def _calculate_compliance_score(self, evidence_items: List[Evidence]) -> float:
        """Calculate compliance component score"""
        
        # Group evidence by framework
        framework_evidence = {}
        for evidence in evidence_items:
            framework = evidence.framework_id
            if framework not in framework_evidence:
                framework_evidence[framework] = []
            framework_evidence[framework].append(evidence)
        
        framework_scores = []
        for framework, evidence_list in framework_evidence.items():
            if framework in self.framework_controls:
                framework_config = self.framework_controls[framework]
                total_controls = framework_config['total_controls']
                weight = framework_config['weight']
                
                # Calculate framework completion
                completion = min(1.0, len(evidence_list) / total_controls)
                
                # Calculate evidence quality
                quality_scores = [e.validation_score or 0.5 for e in evidence_list]
                avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 0
                
                framework_score = completion * avg_quality * weight
                framework_scores.append(framework_score)
        
        return sum(framework_scores) / len(framework_scores) if framework_scores else 0.0
    
    async def _calculate_operations_score(self, evidence_items: List[Evidence]) -> float:
        """Calculate operations component score"""
        
        operational_controls = [
            'monitoring', 'logging', 'backup', 'change_management',
            'capacity_management', 'performance'
        ]
        
        ops_evidence = [
            e for e in evidence_items 
            if any(control in e.control_id.lower() for control in operational_controls)
        ]
        
        if not ops_evidence:
            return 0.0
        
        # Consider automation level for operations
        automated_evidence = [e for e in ops_evidence if e.collected_by != 'manual']
        automation_ratio = len(automated_evidence) / len(ops_evidence)
        
        quality_scores = [e.validation_score or 0.5 for e in ops_evidence]
        base_score = sum(quality_scores) / len(quality_scores) if quality_scores else 0
        
        # Bonus for high automation
        automation_bonus = 1 + (automation_ratio * 0.5)
        
        return base_score * automation_bonus
    
    async def _calculate_governance_score(self, evidence_items: List[Evidence]) -> float:
        """Calculate governance component score"""
        
        governance_controls = [
            'policy', 'training', 'risk_management', 'vendor_management',
            'data_governance', 'privacy'
        ]
        
        gov_evidence = [
            e for e in evidence_items 
            if any(control in e.control_id.lower() for control in governance_controls)
        ]
        
        if not gov_evidence:
            return 0.3  # Minimum governance score
        
        quality_scores = [e.validation_score or 0.5 for e in gov_evidence]
        coverage_score = min(1.0, len(gov_evidence) / 8)  # Expect ~8 governance controls
        
        base_score = sum(quality_scores) / len(quality_scores) if quality_scores else 0
        return base_score * coverage_score
    
    async def _calculate_framework_scores(self, evidence_items: List[Evidence]) -> Dict[str, float]:
        """Calculate per-framework completion scores"""
        
        framework_scores = {}
        
        for framework_id, config in self.framework_controls.items():
            framework_evidence = [
                e for e in evidence_items 
                if e.framework_id == framework_id
            ]
            
            if not framework_evidence:
                framework_scores[framework_id] = 0.0
                continue
            
            total_controls = config['total_controls']
            critical_controls = config['critical_controls']
            
            # Count unique controls covered
            covered_controls = set(e.control_id for e in framework_evidence)
            critical_covered = sum(1 for c in critical_controls if c in covered_controls)
            
            # Calculate score
            completion = len(covered_controls) / total_controls
            critical_completion = critical_covered / len(critical_controls)
            
            # Weighted score favoring critical controls
            score = (completion * 0.7) + (critical_completion * 0.3)
            framework_scores[framework_id] = min(100, score * 100)
        
        return framework_scores
    
    async def _calculate_control_scores(self, evidence_items: List[Evidence]) -> Dict[str, float]:
        """Calculate per-control scores"""
        
        control_scores = {}
        
        # Group evidence by control
        control_evidence = {}
        for evidence in evidence_items:
            control_id = evidence.control_id
            if control_id not in control_evidence:
                control_evidence[control_id] = []
            control_evidence[control_id].append(evidence)
        
        for control_id, evidence_list in control_evidence.items():
            # Multiple evidence items improve score
            quantity_bonus = min(1.5, 1 + (len(evidence_list) - 1) * 0.1)
            
            # Quality based on validation scores
            quality_scores = [e.validation_score or 0.5 for e in evidence_list]
            avg_quality = sum(quality_scores) / len(quality_scores)
            
            # Recency bonus
            recent_evidence = [
                e for e in evidence_list 
                if (datetime.utcnow() - e.collected_at).days < 30
            ]
            recency_bonus = 1 + (len(recent_evidence) / len(evidence_list) * 0.2)
            
            control_score = avg_quality * quantity_bonus * recency_bonus
            control_scores[control_id] = min(100, control_score * 100)
        
        return control_scores
    
    async def _calculate_trust_equity_points(
        self, 
        evidence_items: List[Evidence], 
        automation_percentage: float
    ) -> Dict[str, Any]:
        """Calculate Trust Equity points with 3x multiplier for AI evidence"""
        
        total_points = 0
        points_breakdown = {
            'manual_evidence': 0,
            'ai_evidence': 0,
            'continuous_monitoring': 0,
            'automation_bonus': 0
        }
        
        for evidence in evidence_items:
            base_points = 10  # Base points per evidence
            
            if evidence.collected_by == 'manual':
                points = base_points * self.tier_multipliers.manual_evidence
                points_breakdown['manual_evidence'] += points
            else:
                # AI collected evidence gets 3x multiplier
                points = base_points * self.tier_multipliers.ai_evidence
                points_breakdown['ai_evidence'] += points
            
            # Quality bonus
            if evidence.validation_score and evidence.validation_score > 0.8:
                points *= 1.2
            
            total_points += points
        
        # Continuous monitoring bonus
        if automation_percentage > 0.8:
            bonus = total_points * 0.5
            points_breakdown['continuous_monitoring'] = bonus
            total_points += bonus
        
        # Daily automation bonus
        if automation_percentage > 0.9:
            daily_bonus = len(evidence_items) * 5
            points_breakdown['automation_bonus'] = daily_bonus
            total_points += daily_bonus
        
        return {
            'total_points': int(total_points),
            'breakdown': points_breakdown,
            'velocity_multiplier': self.tier_multipliers.ai_evidence
        }
    
    def _calculate_next_milestone(
        self, 
        current_score: float, 
        framework_scores: Dict[str, float]
    ) -> Dict[str, Any]:
        """Calculate next milestone and requirements"""
        
        milestones = [
            {'score': 70, 'name': 'SOC2 Ready', 'description': 'Ready for SOC2 Type I audit'},
            {'score': 80, 'name': 'Enterprise Ready', 'description': 'Strong compliance posture'},
            {'score': 90, 'name': 'Best in Class', 'description': 'Industry-leading security'},
            {'score': 95, 'name': 'Zero Trust', 'description': 'Maximum security posture'}
        ]
        
        next_milestone = None
        for milestone in milestones:
            if current_score < milestone['score']:
                next_milestone = milestone
                break
        
        if not next_milestone:
            return {
                'achieved': True,
                'message': 'All milestones achieved!'
            }
        
        # Calculate requirements for next milestone
        score_gap = next_milestone['score'] - current_score
        estimated_evidence_needed = math.ceil(score_gap / 2)  # Rough estimate
        
        # Identify weakest framework
        weakest_framework = min(framework_scores.items(), key=lambda x: x[1]) if framework_scores else None
        
        requirements = []
        if weakest_framework and weakest_framework[1] < 60:
            requirements.append(f"Improve {weakest_framework[0]} compliance")
        
        if estimated_evidence_needed > 0:
            requirements.append(f"Collect {estimated_evidence_needed} more evidence items")
        
        return {
            'achieved': False,
            'target_score': next_milestone['score'],
            'current_score': current_score,
            'gap': score_gap,
            'name': next_milestone['name'],
            'description': next_milestone['description'],
            'requirements': requirements,
            'estimated_time': f"{estimated_evidence_needed * 2} minutes"
        }
    
    def _get_trust_grade(self, score: float) -> str:
        """Convert numeric score to letter grade"""
        if score >= 95:
            return 'A+'
        elif score >= 90:
            return 'A'
        elif score >= 85:
            return 'A-'
        elif score >= 80:
            return 'B+'
        elif score >= 75:
            return 'B'
        elif score >= 70:
            return 'B-'
        elif score >= 65:
            return 'C+'
        elif score >= 60:
            return 'C'
        else:
            return 'D'
    
    async def _generate_recommendations(
        self, 
        evidence_items: List[Evidence], 
        framework_scores: Dict[str, float]
    ) -> List[Dict[str, Any]]:
        """Generate actionable recommendations"""
        
        recommendations = []
        
        # Framework-specific recommendations
        for framework, score in framework_scores.items():
            if score < 50:
                recommendations.append({
                    'type': 'framework',
                    'priority': 'high',
                    'title': f'Improve {framework} compliance',
                    'description': f'Current score: {score:.1f}%. Add more evidence for {framework} controls.',
                    'estimated_impact': '+15 points',
                    'estimated_time': '10 minutes'
                })
        
        # Evidence quality recommendations
        low_quality_evidence = [e for e in evidence_items if (e.validation_score or 0) < 0.6]
        if len(low_quality_evidence) > 3:
            recommendations.append({
                'type': 'quality',
                'priority': 'medium',
                'title': 'Improve evidence quality',
                'description': f'{len(low_quality_evidence)} evidence items need review or recollection.',
                'estimated_impact': '+8 points',
                'estimated_time': '5 minutes'
            })
        
        # Automation recommendations
        manual_evidence = [e for e in evidence_items if e.collected_by == 'manual']
        if len(manual_evidence) > len(evidence_items) * 0.3:
            recommendations.append({
                'type': 'automation',
                'priority': 'low',
                'title': 'Increase automation',
                'description': 'Enable more AI agents to collect evidence automatically.',
                'estimated_impact': '+12 points',
                'estimated_time': '2 minutes'
            })
        
        return recommendations[:5]  # Return top 5 recommendations

@app.task(name='agents.core.calculate_trust_score')
def calculate_trust_score_task(customer_id: str, evidence_data: List[Dict]) -> Dict[str, Any]:
    """Celery task for Trust Score calculation"""
    
    db_manager = DatabaseManager()
    trust_engine = TrustScoreEngine(db_manager)
    
    # Convert evidence data to Evidence objects (simplified)
    evidence_items = []
    for item in evidence_data:
        evidence = Evidence(
            id=item['id'],
            customer_id=customer_id,
            evidence_type=item['type'],
            framework_id=item['framework_id'],
            control_id=item['control_id'],
            collected_at=datetime.fromisoformat(item['collected_at']),
            collected_by=item['collected_by'],
            validation_score=item.get('validation_score', 0.5)
        )
        evidence_items.append(evidence)
    
    # Calculate automation percentage
    ai_evidence_count = sum(1 for e in evidence_items if e.collected_by != 'manual')
    automation_percentage = ai_evidence_count / len(evidence_items) if evidence_items else 0
    
    # Run async calculation in sync context
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        result = loop.run_until_complete(
            trust_engine.calculate_instant_trust_score(
                customer_id, evidence_items, automation_percentage
            )
        )
        
        # Store result in database
        loop.run_until_complete(
            db_manager.update_trust_score(customer_id, result)
        )
        
        return result
    finally:
        loop.close()