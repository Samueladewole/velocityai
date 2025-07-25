"""
ERP Integration Service
Building on existing cloud connectors to integrate financial systems
SAP, Oracle, NetSuite, and other ERP platforms for financial data sync
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union
import asyncio
import aiohttp
import json
from datetime import datetime, timedelta
from decimal import Decimal
import uuid
from enum import Enum
import base64
import hmac
import hashlib

# Import existing cloud connector infrastructure
from data_architecture.cloud_connectors import CloudConnector, ConnectionConfig

router = APIRouter()

class ERPSystem(str, Enum):
    SAP = "sap"
    ORACLE = "oracle"
    NETSUITE = "netsuite"
    MICROSOFT_DYNAMICS = "dynamics"
    SAGE = "sage"
    QUICKBOOKS = "quickbooks"

class FinancialDataType(str, Enum):
    GENERAL_LEDGER = "general_ledger"
    ACCOUNTS_PAYABLE = "accounts_payable"
    ACCOUNTS_RECEIVABLE = "accounts_receivable"
    BUDGET_DATA = "budget_data"
    ACTUAL_EXPENSES = "actual_expenses"
    COST_CENTERS = "cost_centers"
    PROFIT_LOSS = "profit_loss"
    BALANCE_SHEET = "balance_sheet"
    CASH_FLOW = "cash_flow"

class ERPConnectionConfig(BaseModel):
    """ERP system connection configuration"""
    system_type: ERPSystem
    connection_name: str
    host_url: str
    username: str
    password: str
    client_id: Optional[str] = None
    client_secret: Optional[str] = None
    tenant_id: Optional[str] = None
    api_version: str = "v1"
    environment: str = "production"  # production, sandbox, test
    sync_frequency: str = "daily"    # hourly, daily, weekly
    
class FinancialRecord(BaseModel):
    """Standardized financial record"""
    record_id: str
    record_type: FinancialDataType
    company_id: str
    account_code: str
    account_name: str
    amount: Decimal
    currency: str
    transaction_date: datetime
    posting_date: datetime
    description: str
    cost_center: Optional[str] = None
    department: Optional[str] = None
    project_code: Optional[str] = None
    reference_number: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ERPSyncResult(BaseModel):
    """ERP synchronization result"""
    sync_id: str
    system_type: ERPSystem
    sync_started: datetime
    sync_completed: datetime
    records_processed: int
    records_successful: int
    records_failed: int
    errors: List[str]
    data_types_synced: List[FinancialDataType]

class SAPConnector(CloudConnector):
    """SAP ERP connector extending base cloud connector"""
    
    def __init__(self, config: ERPConnectionConfig):
        super().__init__()
        self.config = config
        self.session = None
        
    async def connect(self) -> bool:
        """Establish connection to SAP system"""
        try:
            # SAP REST API authentication
            auth_url = f"{self.config.host_url}/sap/bc/rest/oauth2/token"
            
            auth_data = {
                'grant_type': 'client_credentials',
                'client_id': self.config.client_id,
                'client_secret': self.config.client_secret
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(auth_url, data=auth_data) as response:
                    if response.status == 200:
                        token_data = await response.json()
                        self.access_token = token_data['access_token']
                        return True
                    else:
                        raise Exception(f"SAP authentication failed: {response.status}")
        
        except Exception as e:
            raise Exception(f"SAP connection failed: {str(e)}")
    
    async def get_financial_data(
        self, 
        data_type: FinancialDataType,
        start_date: datetime,
        end_date: datetime
    ) -> List[FinancialRecord]:
        """Extract financial data from SAP"""
        
        records = []
        
        try:
            # Map data types to SAP APIs
            api_endpoints = {
                FinancialDataType.GENERAL_LEDGER: "/sap/opu/odata/sap/API_JOURNALENTRY_SRV/A_JournalEntry",
                FinancialDataType.ACCOUNTS_PAYABLE: "/sap/opu/odata/sap/API_SUPPLIER_INVOICE_SRV/A_SupplierInvoice",
                FinancialDataType.ACCOUNTS_RECEIVABLE: "/sap/opu/odata/sap/API_CUSTOMER_INVOICE_SRV/A_CustomerInvoice",
                FinancialDataType.COST_CENTERS: "/sap/opu/odata/sap/API_CONTROLLINGAREA_SRV/A_CostCenter",
                FinancialDataType.BUDGET_DATA: "/sap/opu/odata/sap/API_BUDGET_SRV/A_Budget"
            }
            
            endpoint = api_endpoints.get(data_type)
            if not endpoint:
                raise Exception(f"Unsupported data type for SAP: {data_type}")
            
            url = f"{self.config.host_url}{endpoint}"
            params = {
                '$filter': f"PostingDate ge datetime'{start_date.isoformat()}' and PostingDate le datetime'{end_date.isoformat()}'",
                '$format': 'json'
            }
            
            headers = {
                'Authorization': f'Bearer {self.access_token}',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Process SAP response format
                        for item in data.get('d', {}).get('results', []):
                            record = self._map_sap_record(item, data_type)
                            if record:
                                records.append(record)
                    else:
                        raise Exception(f"SAP API error: {response.status}")
        
        except Exception as e:
            raise Exception(f"SAP data extraction failed: {str(e)}")
        
        return records
    
    def _map_sap_record(self, sap_data: Dict, data_type: FinancialDataType) -> Optional[FinancialRecord]:
        """Map SAP data format to standardized financial record"""
        
        try:
            # SAP-specific field mapping
            if data_type == FinancialDataType.GENERAL_LEDGER:
                return FinancialRecord(
                    record_id=sap_data.get('AccountingDocument', ''),
                    record_type=data_type,
                    company_id=sap_data.get('CompanyCode', ''),
                    account_code=sap_data.get('GLAccount', ''),
                    account_name=sap_data.get('GLAccountName', ''),
                    amount=Decimal(str(sap_data.get('AmountInCompanyCodeCurrency', 0))),
                    currency=sap_data.get('CompanyCodeCurrency', 'EUR'),
                    transaction_date=datetime.fromisoformat(sap_data.get('DocumentDate', '')),
                    posting_date=datetime.fromisoformat(sap_data.get('PostingDate', '')),
                    description=sap_data.get('DocumentHeaderText', ''),
                    cost_center=sap_data.get('CostCenter', ''),
                    reference_number=sap_data.get('Reference', '')
                )
            
            elif data_type == FinancialDataType.ACCOUNTS_PAYABLE:
                return FinancialRecord(
                    record_id=sap_data.get('SupplierInvoice', ''),
                    record_type=data_type,
                    company_id=sap_data.get('CompanyCode', ''),
                    account_code=sap_data.get('Supplier', ''),
                    account_name=sap_data.get('SupplierName', ''),
                    amount=Decimal(str(sap_data.get('InvoiceGrossAmount', 0))),
                    currency=sap_data.get('DocumentCurrency', 'EUR'),
                    transaction_date=datetime.fromisoformat(sap_data.get('DocumentDate', '')),
                    posting_date=datetime.fromisoformat(sap_data.get('PostingDate', '')),
                    description=sap_data.get('DocumentHeaderText', ''),
                    reference_number=sap_data.get('SupplierInvoiceIDByInvcgParty', '')
                )
            
            # Add more mappings as needed
            return None
            
        except Exception as e:
            print(f"Error mapping SAP record: {e}")
            return None

class OracleConnector(CloudConnector):
    """Oracle ERP connector"""
    
    def __init__(self, config: ERPConnectionConfig):
        super().__init__()
        self.config = config
        
    async def connect(self) -> bool:
        """Establish connection to Oracle ERP Cloud"""
        try:
            # Oracle REST API uses basic authentication
            credentials = base64.b64encode(
                f"{self.config.username}:{self.config.password}".encode()
            ).decode()
            
            self.auth_header = f"Basic {credentials}"
            
            # Test connection
            test_url = f"{self.config.host_url}/fscmRestApi/resources/11.13.18.05/ledgers"
            headers = {
                'Authorization': self.auth_header,
                'Content-Type': 'application/json'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(test_url, headers=headers) as response:
                    return response.status == 200
                    
        except Exception as e:
            raise Exception(f"Oracle connection failed: {str(e)}")
    
    async def get_financial_data(
        self, 
        data_type: FinancialDataType,
        start_date: datetime,
        end_date: datetime
    ) -> List[FinancialRecord]:
        """Extract financial data from Oracle ERP"""
        
        records = []
        
        try:
            # Oracle REST API endpoints
            api_endpoints = {
                FinancialDataType.GENERAL_LEDGER: "/fscmRestApi/resources/11.13.18.05/journalEntries",
                FinancialDataType.ACCOUNTS_PAYABLE: "/fscmRestApi/resources/11.13.18.05/invoices",
                FinancialDataType.ACCOUNTS_RECEIVABLE: "/fscmRestApi/resources/11.13.18.05/receivablesInvoices",
                FinancialDataType.BUDGET_DATA: "/fscmRestApi/resources/11.13.18.05/budgets"
            }
            
            endpoint = api_endpoints.get(data_type)
            if not endpoint:
                raise Exception(f"Unsupported data type for Oracle: {data_type}")
            
            url = f"{self.config.host_url}{endpoint}"
            params = {
                'q': f"CreationDate >= '{start_date.isoformat()}' AND CreationDate <= '{end_date.isoformat()}'",
                'limit': 1000
            }
            
            headers = {
                'Authorization': self.auth_header,
                'Accept': 'application/json'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        for item in data.get('items', []):
                            record = self._map_oracle_record(item, data_type)
                            if record:
                                records.append(record)
                    else:
                        raise Exception(f"Oracle API error: {response.status}")
        
        except Exception as e:
            raise Exception(f"Oracle data extraction failed: {str(e)}")
        
        return records
    
    def _map_oracle_record(self, oracle_data: Dict, data_type: FinancialDataType) -> Optional[FinancialRecord]:
        """Map Oracle data to standardized format"""
        
        try:
            if data_type == FinancialDataType.GENERAL_LEDGER:
                return FinancialRecord(
                    record_id=str(oracle_data.get('JournalEntryId', '')),
                    record_type=data_type,
                    company_id=oracle_data.get('LedgerName', ''),
                    account_code=oracle_data.get('AccountCombination', ''),
                    account_name=oracle_data.get('AccountDescription', ''),
                    amount=Decimal(str(oracle_data.get('EnteredAmount', 0))),
                    currency=oracle_data.get('EnteredCurrency', 'USD'),
                    transaction_date=datetime.fromisoformat(oracle_data.get('EffectiveDate', '')),
                    posting_date=datetime.fromisoformat(oracle_data.get('CreationDate', '')),
                    description=oracle_data.get('Description', ''),
                    reference_number=oracle_data.get('Reference', '')
                )
            
            return None
            
        except Exception as e:
            print(f"Error mapping Oracle record: {e}")
            return None

class NetSuiteConnector(CloudConnector):
    """NetSuite ERP connector"""
    
    def __init__(self, config: ERPConnectionConfig):
        super().__init__()
        self.config = config
        
    async def connect(self) -> bool:
        """Establish connection to NetSuite via REST API"""
        try:
            # NetSuite uses OAuth 1.0 or token-based authentication
            # This is a simplified version - production would need full OAuth implementation
            
            test_url = f"{self.config.host_url}/services/rest/query/v1/suiteql"
            headers = {
                'Authorization': f'NLAuth nlauth_account={self.config.tenant_id}, nlauth_email={self.config.username}, nlauth_signature={self.config.password}',
                'Content-Type': 'application/json'
            }
            
            test_query = {
                "q": "SELECT id FROM account FETCH FIRST 1 ROWS ONLY"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(test_url, json=test_query, headers=headers) as response:
                    return response.status == 200
                    
        except Exception as e:
            raise Exception(f"NetSuite connection failed: {str(e)}")
    
    async def get_financial_data(
        self, 
        data_type: FinancialDataType,
        start_date: datetime,
        end_date: datetime
    ) -> List[FinancialRecord]:
        """Extract financial data from NetSuite"""
        
        records = []
        
        try:
            # NetSuite SuiteQL queries
            queries = {
                FinancialDataType.GENERAL_LEDGER: f"""
                    SELECT t.id, t.tranid, t.trandate, t.postingperiod, t.amount, 
                           t.account, a.acctnumber, a.acctname, t.memo
                    FROM transaction t
                    JOIN account a ON t.account = a.id
                    WHERE t.trandate BETWEEN '{start_date.date()}' AND '{end_date.date()}'
                """,
                FinancialDataType.ACCOUNTS_PAYABLE: f"""
                    SELECT v.id, v.tranid, v.trandate, v.total, v.entity, e.entityid
                    FROM vendorbill v
                    JOIN entity e ON v.entity = e.id
                    WHERE v.trandate BETWEEN '{start_date.date()}' AND '{end_date.date()}'
                """
            }
            
            query = queries.get(data_type)
            if not query:
                raise Exception(f"Unsupported data type for NetSuite: {data_type}")
            
            url = f"{self.config.host_url}/services/rest/query/v1/suiteql"
            headers = {
                'Authorization': f'NLAuth nlauth_account={self.config.tenant_id}, nlauth_email={self.config.username}, nlauth_signature={self.config.password}',
                'Content-Type': 'application/json'
            }
            
            query_data = {"q": query}
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=query_data, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        for item in data.get('items', []):
                            record = self._map_netsuite_record(item, data_type)
                            if record:
                                records.append(record)
                    else:
                        raise Exception(f"NetSuite API error: {response.status}")
        
        except Exception as e:
            raise Exception(f"NetSuite data extraction failed: {str(e)}")
        
        return records
    
    def _map_netsuite_record(self, ns_data: Dict, data_type: FinancialDataType) -> Optional[FinancialRecord]:
        """Map NetSuite data to standardized format"""
        
        try:
            if data_type == FinancialDataType.GENERAL_LEDGER:
                return FinancialRecord(
                    record_id=str(ns_data.get('id', '')),
                    record_type=data_type,
                    company_id=self.config.tenant_id,
                    account_code=ns_data.get('acctnumber', ''),
                    account_name=ns_data.get('acctname', ''),
                    amount=Decimal(str(ns_data.get('amount', 0))),
                    currency='USD',  # Default - would need currency lookup
                    transaction_date=datetime.fromisoformat(ns_data.get('trandate', '')),
                    posting_date=datetime.fromisoformat(ns_data.get('trandate', '')),
                    description=ns_data.get('memo', ''),
                    reference_number=ns_data.get('tranid', '')
                )
            
            return None
            
        except Exception as e:
            print(f"Error mapping NetSuite record: {e}")
            return None

class ERPIntegrationManager:
    """Unified ERP integration manager"""
    
    def __init__(self):
        self.connectors = {}
        self.sync_history = {}
    
    def register_connector(self, config: ERPConnectionConfig) -> str:
        """Register a new ERP connector"""
        
        connector_id = str(uuid.uuid4())
        
        if config.system_type == ERPSystem.SAP:
            connector = SAPConnector(config)
        elif config.system_type == ERPSystem.ORACLE:
            connector = OracleConnector(config)
        elif config.system_type == ERPSystem.NETSUITE:
            connector = NetSuiteConnector(config)
        else:
            raise ValueError(f"Unsupported ERP system: {config.system_type}")
        
        self.connectors[connector_id] = connector
        return connector_id
    
    async def sync_financial_data(
        self,
        connector_id: str,
        data_types: List[FinancialDataType],
        start_date: datetime,
        end_date: datetime
    ) -> ERPSyncResult:
        """Synchronize financial data from ERP system"""
        
        if connector_id not in self.connectors:
            raise ValueError(f"Connector not found: {connector_id}")
        
        connector = self.connectors[connector_id]
        sync_id = str(uuid.uuid4())
        sync_started = datetime.utcnow()
        
        try:
            # Connect to ERP system
            await connector.connect()
            
            all_records = []
            errors = []
            
            # Extract data for each requested type
            for data_type in data_types:
                try:
                    records = await connector.get_financial_data(data_type, start_date, end_date)
                    all_records.extend(records)
                except Exception as e:
                    errors.append(f"Error extracting {data_type}: {str(e)}")
            
            sync_completed = datetime.utcnow()
            
            # Create sync result
            sync_result = ERPSyncResult(
                sync_id=sync_id,
                system_type=connector.config.system_type,
                sync_started=sync_started,
                sync_completed=sync_completed,
                records_processed=len(all_records),
                records_successful=len(all_records) - len(errors),
                records_failed=len(errors),
                errors=errors,
                data_types_synced=data_types
            )
            
            # Store sync history
            self.sync_history[sync_id] = {
                'result': sync_result,
                'records': all_records
            }
            
            return sync_result
            
        except Exception as e:
            sync_completed = datetime.utcnow()
            
            return ERPSyncResult(
                sync_id=sync_id,
                system_type=connector.config.system_type,
                sync_started=sync_started,
                sync_completed=sync_completed,
                records_processed=0,
                records_successful=0,
                records_failed=1,
                errors=[str(e)],
                data_types_synced=[]
            )
    
    def get_sync_history(self, connector_id: str) -> List[ERPSyncResult]:
        """Get synchronization history for a connector"""
        
        history = []
        for sync_data in self.sync_history.values():
            if sync_data['result'].system_type == self.connectors[connector_id].config.system_type:
                history.append(sync_data['result'])
        
        return sorted(history, key=lambda x: x.sync_started, reverse=True)
    
    def get_financial_records(self, sync_id: str) -> List[FinancialRecord]:
        """Get financial records from a specific sync"""
        
        if sync_id in self.sync_history:
            return self.sync_history[sync_id]['records']
        
        return []

# Global integration manager
erp_manager = ERPIntegrationManager()

# API Endpoints
@router.post("/register-erp-connector")
async def register_erp_connector(config: ERPConnectionConfig):
    """Register a new ERP system connector"""
    try:
        connector_id = erp_manager.register_connector(config)
        return {"connector_id": connector_id, "status": "registered"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/sync-financial-data/{connector_id}")
async def sync_financial_data(
    connector_id: str,
    data_types: List[FinancialDataType],
    start_date: datetime,
    end_date: datetime,
    background_tasks: BackgroundTasks
):
    """Synchronize financial data from ERP system"""
    try:
        # Run sync in background for large datasets
        sync_result = await erp_manager.sync_financial_data(
            connector_id, data_types, start_date, end_date
        )
        return sync_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sync-history/{connector_id}")
async def get_sync_history(connector_id: str):
    """Get synchronization history"""
    try:
        history = erp_manager.get_sync_history(connector_id)
        return {"sync_history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/financial-records/{sync_id}")
async def get_financial_records(sync_id: str):
    """Get financial records from a sync"""
    try:
        records = erp_manager.get_financial_records(sync_id)
        return {"records": records, "count": len(records)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))