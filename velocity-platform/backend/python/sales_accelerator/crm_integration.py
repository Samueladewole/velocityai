"""
ERIP CRM Integration Framework
Seamless integration with Salesforce, HubSpot, and Microsoft Dynamics
for compliance-driven sales acceleration
"""

from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
import asyncio
import structlog
import httpx
import json
from abc import ABC, abstractmethod

logger = structlog.get_logger()

# Base models for CRM integration
class CRMContact(BaseModel):
    """Unified contact model across CRM platforms"""
    id: str
    name: str
    email: str
    company: str
    title: Optional[str] = None
    phone: Optional[str] = None
    industry: Optional[str] = None
    compliance_requirements: List[str] = Field(default_factory=list)

class CRMOpportunity(BaseModel):
    """Unified opportunity model across CRM platforms"""
    id: str
    name: str
    amount: Optional[float] = None
    stage: str
    probability: Optional[float] = None
    close_date: Optional[datetime] = None
    compliance_complexity: Optional[str] = None
    regulatory_requirements: List[str] = Field(default_factory=list)
    competitive_situation: Optional[str] = None
    erip_components_needed: List[str] = Field(default_factory=list)

class ComplianceActivity(BaseModel):
    """Compliance-related activity in CRM"""
    id: str
    type: str  # question, assessment, demo, proposal
    subject: str
    description: str
    created_date: datetime
    contact_id: str
    opportunity_id: Optional[str] = None
    compliance_framework: Optional[str] = None
    confidence_score: Optional[float] = None
    follow_up_required: bool = False

# Abstract base class for CRM integrations
class BaseCRMIntegration(ABC):
    """Base class for CRM integrations with common interface"""
    
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self.client = httpx.AsyncClient(
            timeout=httpx.Timeout(30.0),
            headers={"User-Agent": "ERIP-Sales-Accelerator/1.0"}
        )
    
    @abstractmethod
    async def authenticate(self) -> bool:
        """Authenticate with CRM platform"""
        pass
    
    @abstractmethod
    async def get_contacts(self, filters: Optional[Dict] = None) -> List[CRMContact]:
        """Retrieve contacts from CRM"""
        pass
    
    @abstractmethod
    async def get_opportunities(self, filters: Optional[Dict] = None) -> List[CRMOpportunity]:
        """Retrieve opportunities from CRM"""
        pass
    
    @abstractmethod
    async def create_activity(self, activity: ComplianceActivity) -> str:
        """Create compliance activity in CRM"""
        pass
    
    @abstractmethod
    async def update_opportunity(self, opportunity_id: str, updates: Dict) -> bool:
        """Update opportunity with compliance information"""
        pass

class SalesforceIntegration(BaseCRMIntegration):
    """Salesforce CRM integration for compliance intelligence"""
    
    def __init__(self, client_id: str, client_secret: str, username: str, password: str, security_token: str):
        super().__init__("", "https://login.salesforce.com")
        self.client_id = client_id
        self.client_secret = client_secret
        self.username = username
        self.password = password
        self.security_token = security_token
        self.access_token = None
        self.instance_url = None
    
    async def authenticate(self) -> bool:
        """Authenticate with Salesforce using OAuth 2.0"""
        try:
            auth_data = {
                "grant_type": "password",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "username": self.username,
                "password": f"{self.password}{self.security_token}"
            }
            
            response = await self.client.post(
                f"{self.base_url}/services/oauth2/token",
                data=auth_data
            )
            
            if response.status_code == 200:
                auth_result = response.json()
                self.access_token = auth_result["access_token"]
                self.instance_url = auth_result["instance_url"]
                
                # Update client headers
                self.client.headers.update({
                    "Authorization": f"Bearer {self.access_token}",
                    "Content-Type": "application/json"
                })
                
                logger.info("Salesforce authentication successful")
                return True
            else:
                logger.error("Salesforce authentication failed", status=response.status_code)
                return False
                
        except Exception as e:
            logger.error("Salesforce authentication error", error=str(e))
            return False
    
    async def get_contacts(self, filters: Optional[Dict] = None) -> List[CRMContact]:
        """Retrieve contacts from Salesforce with compliance context"""
        try:
            # Build SOQL query for contacts with compliance fields
            query = """
            SELECT Id, Name, Email, Company, Title, Phone, Industry,
                   Compliance_Requirements__c, Regulatory_Framework__c
            FROM Contact
            WHERE Email != null
            """
            
            if filters:
                if "industry" in filters:
                    query += f" AND Industry = '{filters['industry']}'"
                if "compliance_framework" in filters:
                    query += f" AND Regulatory_Framework__c INCLUDES ('{filters['compliance_framework']}')"
            
            query += " LIMIT 100"
            
            response = await self.client.get(
                f"{self.instance_url}/services/data/v60.0/query",
                params={"q": query}
            )
            
            if response.status_code == 200:
                data = response.json()
                contacts = []
                
                for record in data["records"]:
                    compliance_reqs = []
                    if record.get("Compliance_Requirements__c"):
                        compliance_reqs = record["Compliance_Requirements__c"].split(";")
                    
                    contact = CRMContact(
                        id=record["Id"],
                        name=record["Name"] or "",
                        email=record["Email"] or "",
                        company=record["Company"] or "",
                        title=record.get("Title"),
                        phone=record.get("Phone"),
                        industry=record.get("Industry"),
                        compliance_requirements=compliance_reqs
                    )
                    contacts.append(contact)
                
                logger.info("Retrieved Salesforce contacts", count=len(contacts))
                return contacts
            else:
                logger.error("Failed to retrieve Salesforce contacts", status=response.status_code)
                return []
                
        except Exception as e:
            logger.error("Error retrieving Salesforce contacts", error=str(e))
            return []
    
    async def get_opportunities(self, filters: Optional[Dict] = None) -> List[CRMOpportunity]:
        """Retrieve opportunities from Salesforce with compliance intelligence"""
        try:
            query = """
            SELECT Id, Name, Amount, StageName, Probability, CloseDate,
                   Compliance_Complexity__c, Regulatory_Requirements__c,
                   Competitive_Situation__c, ERIP_Components__c
            FROM Opportunity
            WHERE IsClosed = false
            """
            
            if filters:
                if "stage" in filters:
                    query += f" AND StageName = '{filters['stage']}'"
                if "amount_min" in filters:
                    query += f" AND Amount >= {filters['amount_min']}"
            
            query += " ORDER BY CloseDate ASC LIMIT 100"
            
            response = await self.client.get(
                f"{self.instance_url}/services/data/v60.0/query",
                params={"q": query}
            )
            
            if response.status_code == 200:
                data = response.json()
                opportunities = []
                
                for record in data["records"]:
                    regulatory_reqs = []
                    if record.get("Regulatory_Requirements__c"):
                        regulatory_reqs = record["Regulatory_Requirements__c"].split(";")
                    
                    erip_components = []
                    if record.get("ERIP_Components__c"):
                        erip_components = record["ERIP_Components__c"].split(";")
                    
                    close_date = None
                    if record.get("CloseDate"):
                        close_date = datetime.fromisoformat(record["CloseDate"])
                    
                    opportunity = CRMOpportunity(
                        id=record["Id"],
                        name=record["Name"],
                        amount=record.get("Amount"),
                        stage=record["StageName"],
                        probability=record.get("Probability"),
                        close_date=close_date,
                        compliance_complexity=record.get("Compliance_Complexity__c"),
                        regulatory_requirements=regulatory_reqs,
                        competitive_situation=record.get("Competitive_Situation__c"),
                        erip_components_needed=erip_components
                    )
                    opportunities.append(opportunity)
                
                logger.info("Retrieved Salesforce opportunities", count=len(opportunities))
                return opportunities
            else:
                logger.error("Failed to retrieve Salesforce opportunities", status=response.status_code)
                return []
                
        except Exception as e:
            logger.error("Error retrieving Salesforce opportunities", error=str(e))
            return []
    
    async def create_activity(self, activity: ComplianceActivity) -> str:
        """Create compliance activity in Salesforce"""
        try:
            # Create Task record for compliance activity
            task_data = {
                "Subject": activity.subject,
                "Description": activity.description,
                "Type": "Compliance_Question" if activity.type == "question" else "Other",
                "Status": "Completed",
                "Priority": "High" if activity.follow_up_required else "Normal",
                "WhoId": activity.contact_id,
                "WhatId": activity.opportunity_id,
                "Compliance_Framework__c": activity.compliance_framework,
                "Confidence_Score__c": activity.confidence_score,
                "Follow_Up_Required__c": activity.follow_up_required
            }
            
            response = await self.client.post(
                f"{self.instance_url}/services/data/v60.0/sobjects/Task",
                json=task_data
            )
            
            if response.status_code == 201:
                result = response.json()
                logger.info("Created Salesforce activity", task_id=result["id"])
                return result["id"]
            else:
                logger.error("Failed to create Salesforce activity", status=response.status_code)
                return ""
                
        except Exception as e:
            logger.error("Error creating Salesforce activity", error=str(e))
            return ""
    
    async def update_opportunity(self, opportunity_id: str, updates: Dict) -> bool:
        """Update Salesforce opportunity with compliance information"""
        try:
            # Map ERIP updates to Salesforce fields
            sf_updates = {}
            
            if "compliance_score" in updates:
                sf_updates["Compliance_Score__c"] = updates["compliance_score"]
            if "regulatory_frameworks" in updates:
                sf_updates["Regulatory_Requirements__c"] = ";".join(updates["regulatory_frameworks"])
            if "erip_components" in updates:
                sf_updates["ERIP_Components__c"] = ";".join(updates["erip_components"])
            if "next_steps" in updates:
                sf_updates["Next_Steps__c"] = updates["next_steps"]
            
            response = await self.client.patch(
                f"{self.instance_url}/services/data/v60.0/sobjects/Opportunity/{opportunity_id}",
                json=sf_updates
            )
            
            if response.status_code == 204:
                logger.info("Updated Salesforce opportunity", opportunity_id=opportunity_id)
                return True
            else:
                logger.error("Failed to update Salesforce opportunity", 
                           opportunity_id=opportunity_id, status=response.status_code)
                return False
                
        except Exception as e:
            logger.error("Error updating Salesforce opportunity", 
                        opportunity_id=opportunity_id, error=str(e))
            return False

class HubSpotIntegration(BaseCRMIntegration):
    """HubSpot CRM integration for compliance intelligence"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key, "https://api.hubapi.com")
        self.client.headers.update({"Authorization": f"Bearer {api_key}"})
    
    async def authenticate(self) -> bool:
        """Validate HubSpot API key"""
        try:
            response = await self.client.get(f"{self.base_url}/account-info/v3/details")
            
            if response.status_code == 200:
                logger.info("HubSpot authentication successful")
                return True
            else:
                logger.error("HubSpot authentication failed", status=response.status_code)
                return False
                
        except Exception as e:
            logger.error("HubSpot authentication error", error=str(e))
            return False
    
    async def get_contacts(self, filters: Optional[Dict] = None) -> List[CRMContact]:
        """Retrieve contacts from HubSpot"""
        try:
            params = {
                "properties": ["firstname", "lastname", "email", "company", "jobtitle", "phone", "industry"],
                "limit": 100
            }
            
            response = await self.client.get(
                f"{self.base_url}/crm/v3/objects/contacts",
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                contacts = []
                
                for record in data["results"]:
                    props = record["properties"]
                    name = f"{props.get('firstname', '')} {props.get('lastname', '')}".strip()
                    
                    contact = CRMContact(
                        id=record["id"],
                        name=name,
                        email=props.get("email", ""),
                        company=props.get("company", ""),
                        title=props.get("jobtitle"),
                        phone=props.get("phone"),
                        industry=props.get("industry")
                    )
                    contacts.append(contact)
                
                logger.info("Retrieved HubSpot contacts", count=len(contacts))
                return contacts
            else:
                logger.error("Failed to retrieve HubSpot contacts", status=response.status_code)
                return []
                
        except Exception as e:
            logger.error("Error retrieving HubSpot contacts", error=str(e))
            return []
    
    async def get_opportunities(self, filters: Optional[Dict] = None) -> List[CRMOpportunity]:
        """Retrieve deals from HubSpot"""
        try:
            params = {
                "properties": ["dealname", "amount", "dealstage", "probability", "closedate"],
                "limit": 100
            }
            
            response = await self.client.get(
                f"{self.base_url}/crm/v3/objects/deals",
                params=params
            )
            
            if response.status_code == 200:
                data = response.json()
                opportunities = []
                
                for record in data["results"]:
                    props = record["properties"]
                    
                    close_date = None
                    if props.get("closedate"):
                        close_date = datetime.fromisoformat(props["closedate"])
                    
                    amount = None
                    if props.get("amount"):
                        amount = float(props["amount"])
                    
                    probability = None
                    if props.get("probability"):
                        probability = float(props["probability"])
                    
                    opportunity = CRMOpportunity(
                        id=record["id"],
                        name=props.get("dealname", ""),
                        amount=amount,
                        stage=props.get("dealstage", ""),
                        probability=probability,
                        close_date=close_date
                    )
                    opportunities.append(opportunity)
                
                logger.info("Retrieved HubSpot opportunities", count=len(opportunities))
                return opportunities
            else:
                logger.error("Failed to retrieve HubSpot opportunities", status=response.status_code)
                return []
                
        except Exception as e:
            logger.error("Error retrieving HubSpot opportunities", error=str(e))
            return []
    
    async def create_activity(self, activity: ComplianceActivity) -> str:
        """Create activity in HubSpot"""
        try:
            activity_data = {
                "properties": {
                    "hs_activity_type": "COMPLIANCE_QUESTION",
                    "hs_activity_subject": activity.subject,
                    "hs_activity_body": activity.description,
                    "hs_activity_date": activity.created_date.isoformat(),
                    "hs_activity_source": "ERIP_SALES_ACCELERATOR"
                }
            }
            
            response = await self.client.post(
                f"{self.base_url}/crm/v3/objects/activities",
                json=activity_data
            )
            
            if response.status_code == 201:
                result = response.json()
                logger.info("Created HubSpot activity", activity_id=result["id"])
                return result["id"]
            else:
                logger.error("Failed to create HubSpot activity", status=response.status_code)
                return ""
                
        except Exception as e:
            logger.error("Error creating HubSpot activity", error=str(e))
            return ""
    
    async def update_opportunity(self, opportunity_id: str, updates: Dict) -> bool:
        """Update HubSpot deal with compliance information"""
        try:
            hs_updates = {"properties": {}}
            
            if "compliance_score" in updates:
                hs_updates["properties"]["compliance_score"] = updates["compliance_score"]
            if "next_steps" in updates:
                hs_updates["properties"]["next_steps"] = updates["next_steps"]
            
            response = await self.client.patch(
                f"{self.base_url}/crm/v3/objects/deals/{opportunity_id}",
                json=hs_updates
            )
            
            if response.status_code == 200:
                logger.info("Updated HubSpot opportunity", opportunity_id=opportunity_id)
                return True
            else:
                logger.error("Failed to update HubSpot opportunity", 
                           opportunity_id=opportunity_id, status=response.status_code)
                return False
                
        except Exception as e:
            logger.error("Error updating HubSpot opportunity", 
                        opportunity_id=opportunity_id, error=str(e))
            return False

class CRMIntegrationManager:
    """Unified CRM integration manager for multiple platforms"""
    
    def __init__(self):
        self.integrations: Dict[str, BaseCRMIntegration] = {}
        self.default_platform = None
    
    def add_integration(self, platform: str, integration: BaseCRMIntegration, is_default: bool = False):
        """Add CRM integration for a platform"""
        self.integrations[platform] = integration
        if is_default or len(self.integrations) == 1:
            self.default_platform = platform
        
        logger.info("Added CRM integration", platform=platform, is_default=is_default)
    
    async def sync_compliance_data(self, platform: Optional[str] = None) -> Dict[str, Any]:
        """Sync compliance data across CRM platforms"""
        target_platform = platform or self.default_platform
        
        if not target_platform or target_platform not in self.integrations:
            logger.error("Invalid CRM platform specified", platform=target_platform)
            return {"success": False, "error": "Invalid platform"}
        
        integration = self.integrations[target_platform]
        
        try:
            # Authenticate with CRM
            if not await integration.authenticate():
                return {"success": False, "error": "Authentication failed"}
            
            # Sync contacts and opportunities
            contacts = await integration.get_contacts()
            opportunities = await integration.get_opportunities()
            
            sync_result = {
                "success": True,
                "platform": target_platform,
                "contacts_synced": len(contacts),
                "opportunities_synced": len(opportunities),
                "last_sync": datetime.utcnow().isoformat()
            }
            
            logger.info("CRM sync completed", **sync_result)
            return sync_result
            
        except Exception as e:
            logger.error("CRM sync failed", platform=target_platform, error=str(e))
            return {"success": False, "error": str(e)}
    
    async def create_compliance_activity(
        self, 
        activity: ComplianceActivity, 
        platform: Optional[str] = None
    ) -> str:
        """Create compliance activity in specified CRM platform"""
        target_platform = platform or self.default_platform
        
        if target_platform in self.integrations:
            integration = self.integrations[target_platform]
            return await integration.create_activity(activity)
        else:
            logger.error("CRM platform not configured", platform=target_platform)
            return ""
    
    async def update_opportunity_compliance(
        self, 
        opportunity_id: str, 
        updates: Dict, 
        platform: Optional[str] = None
    ) -> bool:
        """Update opportunity with compliance information"""
        target_platform = platform or self.default_platform
        
        if target_platform in self.integrations:
            integration = self.integrations[target_platform]
            return await integration.update_opportunity(opportunity_id, updates)
        else:
            logger.error("CRM platform not configured", platform=target_platform)
            return False
    
    async def get_compliance_pipeline(self, platform: Optional[str] = None) -> Dict[str, Any]:
        """Get compliance-focused pipeline analysis"""
        target_platform = platform or self.default_platform
        
        if target_platform not in self.integrations:
            return {"error": "Platform not configured"}
        
        integration = self.integrations[target_platform]
        
        try:
            if not await integration.authenticate():
                return {"error": "Authentication failed"}
            
            opportunities = await integration.get_opportunities()
            
            # Analyze compliance complexity and requirements
            pipeline_analysis = {
                "total_opportunities": len(opportunities),
                "total_value": sum(opp.amount or 0 for opp in opportunities),
                "compliance_breakdown": {
                    "high_complexity": 0,
                    "medium_complexity": 0,
                    "low_complexity": 0,
                    "not_assessed": 0
                },
                "regulatory_requirements": {},
                "erip_components_needed": {},
                "competitive_situations": {}
            }
            
            for opp in opportunities:
                # Analyze compliance complexity
                if opp.compliance_complexity:
                    complexity = opp.compliance_complexity.lower()
                    if complexity in pipeline_analysis["compliance_breakdown"]:
                        pipeline_analysis["compliance_breakdown"][complexity] += 1
                else:
                    pipeline_analysis["compliance_breakdown"]["not_assessed"] += 1
                
                # Count regulatory requirements
                for req in opp.regulatory_requirements:
                    pipeline_analysis["regulatory_requirements"][req] = \
                        pipeline_analysis["regulatory_requirements"].get(req, 0) + 1
                
                # Count ERIP components needed
                for component in opp.erip_components_needed:
                    pipeline_analysis["erip_components_needed"][component] = \
                        pipeline_analysis["erip_components_needed"].get(component, 0) + 1
                
                # Count competitive situations
                if opp.competitive_situation:
                    pipeline_analysis["competitive_situations"][opp.competitive_situation] = \
                        pipeline_analysis["competitive_situations"].get(opp.competitive_situation, 0) + 1
            
            return pipeline_analysis
            
        except Exception as e:
            logger.error("Failed to get compliance pipeline", error=str(e))
            return {"error": str(e)}