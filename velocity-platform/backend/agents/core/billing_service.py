"""
High-performance billing service for ERIP Velocity tier management.
Handles subscription management, usage tracking, and billing automation.
"""

import stripe
import asyncio
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import structlog
from enum import Enum
import os
from .database import DatabaseManager, Customer, VelocityCustomer
import json

logger = structlog.get_logger()


class VelocityTier(Enum):
    STARTER = "starter"
    GROWTH = "growth" 
    SCALE = "scale"


@dataclass
class TierConfig:
    name: str
    monthly_price: int  # in cents
    annual_price: int   # in cents
    max_users: int
    max_frameworks: int
    max_evidence_items: int
    max_api_calls: int
    storage_gb: int
    support_channels: List[str]
    features: List[str]


class VelocityBillingService:
    """Comprehensive billing service for ERIP Velocity tier management"""
    
    def __init__(self, stripe_secret_key: str = None):
        # Initialize Stripe
        stripe.api_key = stripe_secret_key or os.getenv('STRIPE_SECRET_KEY')
        
        self.db = DatabaseManager()
        
        # Define tier configurations
        self.tier_configs = {
            VelocityTier.STARTER: TierConfig(
                name="Velocity Starter",
                monthly_price=99900,  # €999.00
                annual_price=959904,  # €9,599.04 (20% discount)
                max_users=5,
                max_frameworks=2,
                max_evidence_items=1000,
                max_api_calls=10000,
                storage_gb=100,
                support_channels=['email', 'docs'],
                features=[
                    'SOC2 Type I', 'GDPR basics', '95% evidence automation',
                    'AI questionnaires', 'Basic monitoring', 'Email alerts'
                ]
            ),
            VelocityTier.GROWTH: TierConfig(
                name="Velocity Growth", 
                monthly_price=249900,  # €2,499.00
                annual_price=2399904,  # €23,999.04 (20% discount)
                max_users=15,
                max_frameworks=4, 
                max_evidence_items=5000,
                max_api_calls=50000,
                storage_gb=500,
                support_channels=['email', 'chat', 'priority'],
                features=[
                    'SOC2 Type I & II', 'ISO 27001', 'GDPR', 'HIPAA',
                    '95% evidence automation', 'Advanced monitoring',
                    'Real-time alerts', 'Custom workflows'
                ]
            ),
            VelocityTier.SCALE: TierConfig(
                name="Velocity Scale",
                monthly_price=499900,  # €4,999.00  
                annual_price=4799904,  # €47,999.04 (20% discount)
                max_users=-1,  # unlimited
                max_frameworks=-1,  # all
                max_evidence_items=50000,
                max_api_calls=500000,
                storage_gb=2000,
                support_channels=['email', 'chat', 'phone', 'dedicated'],
                features=[
                    'All frameworks', 'FedRAMP', 'PCI DSS', 'AI Act',
                    '95% evidence automation', '24/7 monitoring',
                    'Proactive alerts', 'Custom integrations',
                    'Dedicated CSM', 'White-glove onboarding'
                ]
            )
        }
        
        # Stripe product IDs (to be created)
        self.stripe_products = {}
        self.stripe_prices = {}
    
    async def initialize_stripe_products(self):
        """Initialize Stripe products and prices for Velocity tiers"""
        
        for tier, config in self.tier_configs.items():
            try:
                # Create or retrieve product
                product = stripe.Product.create(
                    name=config.name,
                    description=f"ERIP {config.name} - AI-powered compliance automation",
                    metadata={
                        'tier': tier.value,
                        'max_users': str(config.max_users),
                        'max_frameworks': str(config.max_frameworks),
                        'features': json.dumps(config.features)
                    }
                )
                self.stripe_products[tier] = product.id
                
                # Create monthly price
                monthly_price = stripe.Price.create(
                    unit_amount=config.monthly_price,
                    currency='usd',
                    recurring={'interval': 'month'},
                    product=product.id,
                    metadata={'billing_period': 'monthly'}
                )
                
                # Create annual price  
                annual_price = stripe.Price.create(
                    unit_amount=config.annual_price,
                    currency='usd',
                    recurring={'interval': 'year'},
                    product=product.id,
                    metadata={'billing_period': 'annual'}
                )
                
                self.stripe_prices[f"{tier.value}_monthly"] = monthly_price.id
                self.stripe_prices[f"{tier.value}_annual"] = annual_price.id
                
                logger.info(
                    "stripe_product_created",
                    tier=tier.value,
                    product_id=product.id,
                    monthly_price_id=monthly_price.id,
                    annual_price_id=annual_price.id
                )
                
            except stripe.error.StripeError as e:
                logger.error("stripe_product_creation_failed", tier=tier.value, error=str(e))
    
    async def create_customer_subscription(
        self,
        customer_id: str,
        tier: VelocityTier,
        billing_period: str = 'monthly',
        payment_method: str = None,
        trial_days: int = 14
    ) -> Dict[str, Any]:
        """Create a new Velocity subscription for customer"""
        
        try:
            # Get customer info
            session = self.db.SessionLocal()
            customer = session.query(Customer).filter(Customer.id == customer_id).first()
            
            if not customer:
                raise ValueError(f"Customer {customer_id} not found")
            
            # Create or retrieve Stripe customer
            stripe_customer = await self._get_or_create_stripe_customer(customer)
            
            # Get price ID
            price_id = self.stripe_prices.get(f"{tier.value}_{billing_period}")
            if not price_id:
                raise ValueError(f"Price not found for {tier.value} {billing_period}")
            
            # Create subscription
            subscription_params = {
                'customer': stripe_customer.id,
                'items': [{'price': price_id}],
                'metadata': {
                    'erip_customer_id': customer_id,
                    'tier': tier.value,
                    'billing_period': billing_period
                },
                'expand': ['latest_invoice.payment_intent']
            }
            
            # Add trial if specified
            if trial_days > 0:
                subscription_params['trial_period_days'] = trial_days
            
            # Add payment method if provided
            if payment_method:
                subscription_params['default_payment_method'] = payment_method
            
            subscription = stripe.Subscription.create(**subscription_params)
            
            # Update customer record
            customer.tier = tier.value
            customer.status = 'trial' if trial_days > 0 else 'active'
            
            # Create or update VelocityCustomer record
            velocity_customer = session.query(VelocityCustomer).filter(
                VelocityCustomer.customer_id == customer_id
            ).first()
            
            if not velocity_customer:
                velocity_customer = VelocityCustomer(
                    customer_id=customer_id,
                    onboarding_status='not_started'
                )
                session.add(velocity_customer)
            
            session.commit()
            session.close()
            
            return {
                'subscription_id': subscription.id,
                'status': subscription.status,
                'current_period_start': datetime.fromtimestamp(subscription.current_period_start),
                'current_period_end': datetime.fromtimestamp(subscription.current_period_end),
                'trial_end': datetime.fromtimestamp(subscription.trial_end) if subscription.trial_end else None,
                'client_secret': subscription.latest_invoice.payment_intent.client_secret if subscription.latest_invoice else None
            }
            
        except Exception as e:
            logger.error("subscription_creation_failed", customer_id=customer_id, error=str(e))
            raise
    
    async def _get_or_create_stripe_customer(self, customer: Customer) -> stripe.Customer:
        """Get or create Stripe customer record"""
        
        # Try to find existing Stripe customer by email
        existing_customers = stripe.Customer.list(email=customer.organization_id)
        
        if existing_customers.data:
            return existing_customers.data[0]
        
        # Create new Stripe customer
        return stripe.Customer.create(
            email=customer.organization_id,
            metadata={
                'erip_customer_id': str(customer.id),
                'created_at': customer.created_at.isoformat()
            }
        )
    
    async def check_usage_limits(self, customer_id: str) -> Dict[str, Any]:
        """Check current usage against tier limits"""
        
        session = self.db.SessionLocal()
        try:
            customer = session.query(Customer).filter(Customer.id == customer_id).first()
            velocity_customer = session.query(VelocityCustomer).filter(
                VelocityCustomer.customer_id == customer_id
            ).first()
            
            if not customer or not velocity_customer:
                return {'error': 'Customer not found'}
            
            tier = VelocityTier(customer.tier)
            config = self.tier_configs[tier]
            
            # Get current usage
            current_usage = {
                'users': 5,  # Mock data - replace with actual query
                'frameworks': len(velocity_customer.frameworks_enabled or []),
                'evidence_items': velocity_customer.evidence_collected_count or 0,
                'api_calls': 1500,  # Mock data - replace with actual tracking
                'storage_gb': 25.5   # Mock data - replace with actual calculation
            }
            
            # Calculate limits and usage percentages
            limits_check = {}
            for resource, current in current_usage.items():
                if resource in ['users', 'frameworks', 'evidence_items', 'api_calls', 'storage_gb']:
                    limit_key = f'max_{resource}' if resource != 'storage_gb' else 'storage_gb'
                    max_limit = getattr(config, limit_key, -1)
                    
                    if max_limit == -1:  # Unlimited
                        limits_check[resource] = {
                            'current': current,
                            'limit': 'unlimited',
                            'percentage': 0,
                            'status': 'ok'
                        }
                    else:
                        percentage = (current / max_limit) * 100
                        status = 'critical' if percentage >= 90 else 'warning' if percentage >= 75 else 'ok'
                        
                        limits_check[resource] = {
                            'current': current,
                            'limit': max_limit,
                            'percentage': round(percentage, 1),
                            'status': status
                        }
            
            return {
                'tier': tier.value,
                'limits': limits_check,
                'upgrade_recommended': any(l['status'] in ['warning', 'critical'] for l in limits_check.values())
            }
            
        finally:
            session.close()
    
    async def process_usage_based_billing(self, customer_id: str) -> Dict[str, Any]:
        """Process usage-based billing for overages"""
        
        usage_check = await self.check_usage_limits(customer_id)
        
        if usage_check.get('error'):
            return usage_check
        
        overages = []
        total_overage_cost = 0
        
        # Define overage pricing (in cents)
        overage_pricing = {
            'users': 5000,        # €50 per additional user
            'frameworks': 10000,   # €100 per additional framework
            'evidence_items': 5,   # €0.05 per additional evidence item
            'api_calls': 1,        # €0.01 per additional API call
            'storage_gb': 200      # €2 per additional GB
        }
        
        for resource, data in usage_check['limits'].items():
            if data['limit'] != 'unlimited' and data['current'] > data['limit']:
                overage_amount = data['current'] - data['limit']
                overage_cost = overage_amount * overage_pricing.get(resource, 0)
                
                overages.append({
                    'resource': resource,
                    'limit': data['limit'],
                    'usage': data['current'],
                    'overage': overage_amount,
                    'unit_cost': overage_pricing.get(resource, 0),
                    'total_cost': overage_cost
                })
                
                total_overage_cost += overage_cost
        
        return {
            'customer_id': customer_id,
            'billing_period': datetime.utcnow().strftime('%Y-%m'),
            'overages': overages,
            'total_overage_cost_cents': total_overage_cost,
            'total_overage_cost_dollars': total_overage_cost / 100,
            'requires_billing': total_overage_cost > 0
        }
    
    async def upgrade_subscription(
        self, 
        customer_id: str, 
        new_tier: VelocityTier,
        prorate: bool = True
    ) -> Dict[str, Any]:
        """Upgrade customer subscription to new tier"""
        
        try:
            # Get current subscription
            session = self.db.SessionLocal()
            customer = session.query(Customer).filter(Customer.id == customer_id).first()
            
            if not customer:
                raise ValueError(f"Customer {customer_id} not found")
            
            # Find Stripe subscription
            stripe_customer = await self._get_or_create_stripe_customer(customer)
            subscriptions = stripe.Subscription.list(customer=stripe_customer.id, status='active')
            
            if not subscriptions.data:
                raise ValueError("No active subscription found")
            
            subscription = subscriptions.data[0]
            current_tier = VelocityTier(customer.tier)
            
            # Check if upgrade is valid
            tier_hierarchy = [VelocityTier.STARTER, VelocityTier.GROWTH, VelocityTier.SCALE]
            if tier_hierarchy.index(new_tier) <= tier_hierarchy.index(current_tier):
                raise ValueError("Can only upgrade to higher tier")
            
            # Get new price ID
            billing_period = 'monthly' if subscription.items.data[0].price.recurring.interval == 'month' else 'annual'
            new_price_id = self.stripe_prices.get(f"{new_tier.value}_{billing_period}")
            
            # Update subscription
            stripe.Subscription.modify(
                subscription.id,
                items=[{
                    'id': subscription.items.data[0].id,
                    'price': new_price_id
                }],
                proration_behavior='create_prorations' if prorate else 'none',
                metadata={
                    **subscription.metadata,
                    'tier': new_tier.value,
                    'upgraded_at': datetime.utcnow().isoformat()
                }
            )
            
            # Update customer record
            customer.tier = new_tier.value
            session.commit()
            session.close()
            
            return {
                'success': True,
                'old_tier': current_tier.value,
                'new_tier': new_tier.value,
                'prorated': prorate,
                'effective_date': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error("subscription_upgrade_failed", customer_id=customer_id, error=str(e))
            raise
    
    async def cancel_subscription(
        self, 
        customer_id: str, 
        at_period_end: bool = True
    ) -> Dict[str, Any]:
        """Cancel customer subscription"""
        
        try:
            session = self.db.SessionLocal()
            customer = session.query(Customer).filter(Customer.id == customer_id).first()
            
            if not customer:
                raise ValueError(f"Customer {customer_id} not found")
            
            # Find and cancel Stripe subscription
            stripe_customer = await self._get_or_create_stripe_customer(customer)
            subscriptions = stripe.Subscription.list(customer=stripe_customer.id, status='active')
            
            if subscriptions.data:
                subscription = subscriptions.data[0]
                
                if at_period_end:
                    # Cancel at period end
                    stripe.Subscription.modify(
                        subscription.id,
                        cancel_at_period_end=True
                    )
                    customer.status = 'cancelled'
                else:
                    # Cancel immediately
                    stripe.Subscription.delete(subscription.id)
                    customer.status = 'cancelled'
                
                session.commit()
            
            session.close()
            
            return {
                'success': True,
                'cancelled_at': datetime.utcnow().isoformat(),
                'at_period_end': at_period_end
            }
            
        except Exception as e:
            logger.error("subscription_cancellation_failed", customer_id=customer_id, error=str(e))
            raise
    
    async def get_billing_summary(self, customer_id: str) -> Dict[str, Any]:
        """Get comprehensive billing summary for customer"""
        
        session = self.db.SessionLocal()
        try:
            customer = session.query(Customer).filter(Customer.id == customer_id).first()
            velocity_customer = session.query(VelocityCustomer).filter(
                VelocityCustomer.customer_id == customer_id
            ).first()
            
            if not customer:
                return {'error': 'Customer not found'}
            
            tier = VelocityTier(customer.tier)
            config = self.tier_configs[tier]
            
            # Get usage and limits
            usage_data = await self.check_usage_limits(customer_id)
            overage_data = await self.process_usage_based_billing(customer_id)
            
            return {
                'customer_id': customer_id,
                'tier': {
                    'name': config.name,
                    'level': tier.value,
                    'monthly_price': config.monthly_price / 100,
                    'features': config.features
                },
                'subscription': {
                    'status': customer.status,
                    'signup_date': customer.signup_date.isoformat() if customer.signup_date else None,
                    'trial_ends_at': customer.trial_ends_at.isoformat() if customer.trial_ends_at else None
                },
                'usage': usage_data.get('limits', {}),
                'billing': {
                    'current_period_cost': config.monthly_price / 100,
                    'overage_cost': overage_data.get('total_overage_cost_dollars', 0),
                    'total_cost': (config.monthly_price / 100) + overage_data.get('total_overage_cost_dollars', 0),
                    'next_billing_date': (datetime.utcnow() + timedelta(days=30)).isoformat()
                },
                'upgrade_recommended': usage_data.get('upgrade_recommended', False),
                'available_upgrades': self._get_available_upgrades(tier)
            }
            
        finally:
            session.close()
    
    def _get_available_upgrades(self, current_tier: VelocityTier) -> List[Dict[str, Any]]:
        """Get available upgrade options"""
        
        tier_hierarchy = [VelocityTier.STARTER, VelocityTier.GROWTH, VelocityTier.SCALE]
        current_index = tier_hierarchy.index(current_tier)
        
        upgrades = []
        for tier in tier_hierarchy[current_index + 1:]:
            config = self.tier_configs[tier]
            upgrades.append({
                'tier': tier.value,
                'name': config.name,
                'monthly_price': config.monthly_price / 100,
                'key_benefits': [
                    f"Up to {config.max_users} users" if config.max_users != -1 else "Unlimited users",
                    f"{config.max_frameworks} frameworks" if config.max_frameworks != -1 else "All frameworks",
                    f"{config.storage_gb}GB storage"
                ]
            })
        
        return upgrades


# Global instance
billing_service = VelocityBillingService()