"""
FastAPI endpoints for ERIP Velocity tier billing and subscription management.
"""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime
import structlog
from ..core.billing_service import billing_service, VelocityTier
import stripe

logger = structlog.get_logger()

app = FastAPI(title="ERIP Velocity Billing API", version="1.0.0")


# Pydantic models
class SubscriptionCreateRequest(BaseModel):
    customer_id: str = Field(..., description="ERIP customer ID")
    tier: str = Field(..., description="Velocity tier (starter, growth, scale)")
    billing_period: str = Field(default="monthly", description="Billing period (monthly, annual)")
    payment_method: Optional[str] = Field(None, description="Stripe payment method ID")
    trial_days: int = Field(default=14, description="Trial period in days")


class SubscriptionUpgradeRequest(BaseModel):
    customer_id: str = Field(..., description="ERIP customer ID")
    new_tier: str = Field(..., description="New Velocity tier")
    prorate: bool = Field(default=True, description="Whether to prorate the upgrade")


class WebhookEvent(BaseModel):
    type: str
    data: Dict[str, Any]


# Endpoints
@app.post("/subscriptions", response_model=Dict[str, Any])
async def create_subscription(request: SubscriptionCreateRequest):
    """Create a new Velocity subscription"""
    
    try:
        # Validate tier
        try:
            tier = VelocityTier(request.tier)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid tier: {request.tier}")
        
        # Validate billing period
        if request.billing_period not in ["monthly", "annual"]:
            raise HTTPException(status_code=400, detail="Billing period must be 'monthly' or 'annual'")
        
        result = await billing_service.create_customer_subscription(
            customer_id=request.customer_id,
            tier=tier,
            billing_period=request.billing_period,
            payment_method=request.payment_method,
            trial_days=request.trial_days
        )
        
        return {
            "success": True,
            "subscription": result
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("subscription_creation_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to create subscription")


@app.get("/subscriptions/{customer_id}/usage", response_model=Dict[str, Any])
async def get_usage_limits(customer_id: str):
    """Get current usage against tier limits"""
    
    try:
        result = await billing_service.check_usage_limits(customer_id)
        
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error("usage_check_failed", customer_id=customer_id, error=str(e))
        raise HTTPException(status_code=500, detail="Failed to check usage limits")


@app.get("/subscriptions/{customer_id}/billing", response_model=Dict[str, Any])
async def get_billing_summary(customer_id: str):
    """Get comprehensive billing summary"""
    
    try:
        result = await billing_service.get_billing_summary(customer_id)
        
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        
        return result
        
    except Exception as e:
        logger.error("billing_summary_failed", customer_id=customer_id, error=str(e))
        raise HTTPException(status_code=500, detail="Failed to get billing summary")


@app.post("/subscriptions/{customer_id}/upgrade", response_model=Dict[str, Any])
async def upgrade_subscription(customer_id: str, request: SubscriptionUpgradeRequest):
    """Upgrade customer subscription to higher tier"""
    
    try:
        # Validate new tier
        try:
            new_tier = VelocityTier(request.new_tier)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid tier: {request.new_tier}")
        
        result = await billing_service.upgrade_subscription(
            customer_id=customer_id,
            new_tier=new_tier,
            prorate=request.prorate
        )
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("subscription_upgrade_failed", customer_id=customer_id, error=str(e))
        raise HTTPException(status_code=500, detail="Failed to upgrade subscription")


@app.delete("/subscriptions/{customer_id}", response_model=Dict[str, Any])
async def cancel_subscription(customer_id: str, at_period_end: bool = True):
    """Cancel customer subscription"""
    
    try:
        result = await billing_service.cancel_subscription(
            customer_id=customer_id,
            at_period_end=at_period_end
        )
        
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error("subscription_cancellation_failed", customer_id=customer_id, error=str(e))
        raise HTTPException(status_code=500, detail="Failed to cancel subscription")


@app.get("/tiers", response_model=Dict[str, Any])
async def get_velocity_tiers():
    """Get all available Velocity tiers and their configurations"""
    
    try:
        tiers = {}
        
        for tier, config in billing_service.tier_configs.items():
            tiers[tier.value] = {
                "name": config.name,
                "pricing": {
                    "monthly": config.monthly_price / 100,
                    "annual": config.annual_price / 100,
                    "annual_discount": round((1 - (config.annual_price / 12) / config.monthly_price) * 100, 1)
                },
                "limits": {
                    "users": config.max_users if config.max_users != -1 else "unlimited",
                    "frameworks": config.max_frameworks if config.max_frameworks != -1 else "all",
                    "evidence_items": config.max_evidence_items,
                    "api_calls": config.max_api_calls,
                    "storage_gb": config.storage_gb
                },
                "support": config.support_channels,
                "features": config.features
            }
        
        return {
            "tiers": tiers,
            "currency": "USD",
            "trial_days": 14
        }
        
    except Exception as e:
        logger.error("tiers_fetch_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch tier information")


@app.post("/webhooks/stripe", response_model=Dict[str, Any])
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        # Verify webhook signature
        endpoint_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
        if endpoint_secret:
            try:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, endpoint_secret
                )
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid payload")
            except stripe.error.SignatureVerificationError:
                raise HTTPException(status_code=400, detail="Invalid signature")
        else:
            event = stripe.Event.construct_from(
                json.loads(payload), stripe.api_key
            )
        
        # Handle the event
        if event['type'] == 'invoice.payment_succeeded':
            await handle_payment_succeeded(event['data']['object'])
        elif event['type'] == 'invoice.payment_failed':
            await handle_payment_failed(event['data']['object'])
        elif event['type'] == 'customer.subscription.deleted':
            await handle_subscription_deleted(event['data']['object'])
        elif event['type'] == 'customer.subscription.updated':
            await handle_subscription_updated(event['data']['object'])
        else:
            logger.info("unhandled_webhook_event", event_type=event['type'])
        
        return {"received": True}
        
    except Exception as e:
        logger.error("webhook_processing_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Webhook processing failed")


async def handle_payment_succeeded(invoice: Dict[str, Any]):
    """Handle successful payment"""
    
    customer_id = invoice.get('metadata', {}).get('erip_customer_id')
    if customer_id:
        logger.info(
            "payment_succeeded",
            customer_id=customer_id,
            amount=invoice.get('amount_paid', 0) / 100,
            invoice_id=invoice.get('id')
        )
        
        # Update customer status if needed
        session = billing_service.db.SessionLocal()
        try:
            customer = session.query(billing_service.db.Customer).filter(
                billing_service.db.Customer.id == customer_id
            ).first()
            
            if customer and customer.status in ['trial', 'suspended']:
                customer.status = 'active'
                session.commit()
                
        finally:
            session.close()


async def handle_payment_failed(invoice: Dict[str, Any]):
    """Handle failed payment"""
    
    customer_id = invoice.get('metadata', {}).get('erip_customer_id')
    if customer_id:
        logger.warning(
            "payment_failed",
            customer_id=customer_id,
            amount=invoice.get('amount_due', 0) / 100,
            invoice_id=invoice.get('id')
        )
        
        # Could trigger dunning management or suspension logic here


async def handle_subscription_deleted(subscription: Dict[str, Any]):
    """Handle subscription cancellation"""
    
    customer_id = subscription.get('metadata', {}).get('erip_customer_id')
    if customer_id:
        logger.info("subscription_cancelled", customer_id=customer_id)
        
        # Update customer status
        session = billing_service.db.SessionLocal()
        try:
            customer = session.query(billing_service.db.Customer).filter(
                billing_service.db.Customer.id == customer_id
            ).first()
            
            if customer:
                customer.status = 'cancelled'
                session.commit()
                
        finally:
            session.close()


async def handle_subscription_updated(subscription: Dict[str, Any]):
    """Handle subscription updates"""
    
    customer_id = subscription.get('metadata', {}).get('erip_customer_id')
    tier = subscription.get('metadata', {}).get('tier')
    
    if customer_id and tier:
        logger.info(
            "subscription_updated",
            customer_id=customer_id,
            tier=tier,
            status=subscription.get('status')
        )


@app.get("/subscriptions/{customer_id}/overages", response_model=Dict[str, Any])
async def get_usage_overages(customer_id: str):
    """Get usage-based billing overages"""
    
    try:
        result = await billing_service.process_usage_based_billing(customer_id)
        return result
        
    except Exception as e:
        logger.error("overage_calculation_failed", customer_id=customer_id, error=str(e))
        raise HTTPException(status_code=500, detail="Failed to calculate overages")


@app.get("/analytics/revenue", response_model=Dict[str, Any])
async def get_revenue_analytics():
    """Get Velocity tier revenue analytics"""
    
    try:
        # Mock analytics data - replace with real queries
        analytics = {
            "total_customers": 247,
            "monthly_recurring_revenue": 485750,  # $4,857.50
            "annual_recurring_revenue": 5829000,  # $58,290.00
            "by_tier": {
                "starter": {
                    "customers": 156,
                    "mrr": 155844,  # $1,558.44
                    "percentage": 63.2
                },
                "growth": {
                    "customers": 67,
                    "mrr": 167433,  # $1,674.33
                    "percentage": 27.1
                },
                "scale": {
                    "customers": 24,
                    "mrr": 119976,  # $1,199.76
                    "percentage": 9.7
                }
            },
            "churn_rate": 2.1,
            "upgrade_rate": 8.4,
            "average_ltv": 18450,  # $184.50
            "trial_conversion_rate": 34.7
        }
        
        return analytics
        
    except Exception as e:
        logger.error("analytics_fetch_failed", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch analytics")


# Add CORS middleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://erip.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)