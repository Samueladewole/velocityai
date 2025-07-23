"""
ETL Pipeline Framework for ERIP Data Architecture
Reusable Extract, Transform, Load components with advanced scheduling and error handling
"""

from typing import Dict, List, Optional, Any, Callable, Union, AsyncIterator
from datetime import datetime, timedelta
from abc import ABC, abstractmethod
import asyncio
import json
from enum import Enum
import structlog
from pydantic import BaseModel, Field
import pandas as pd
import numpy as np
from concurrent.futures import ThreadPoolExecutor
import schedule
import time

logger = structlog.get_logger()

class PipelineStatus(str, Enum):
    """Pipeline execution status"""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"
    RETRYING = "retrying"

class DataType(str, Enum):
    """Supported data types for validation"""
    STRING = "string"
    INTEGER = "integer"
    FLOAT = "float"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"
    JSON = "json"
    EMAIL = "email"
    URL = "url"

class ValidationResult(BaseModel):
    """Data validation result"""
    is_valid: bool
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    statistics: Dict[str, Any] = Field(default_factory=dict)

class PipelineRun(BaseModel):
    """ETL pipeline execution record"""
    run_id: str
    pipeline_id: str
    status: PipelineStatus
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[float] = None
    records_processed: int = 0
    records_success: int = 0
    records_failed: int = 0
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class DataValidator:
    """
    Reusable data validation engine
    Supports schema validation, data quality checks, and business rule enforcement
    """
    
    def __init__(self):
        self.rules: Dict[str, List[Callable]] = {}
        self.schemas: Dict[str, Dict[str, Any]] = {}
        
    def add_schema(self, schema_name: str, schema: Dict[str, Any]) -> None:
        """Add reusable data schema"""
        self.schemas[schema_name] = schema
        logger.info("Schema added", schema_name=schema_name)
    
    def add_validation_rule(self, rule_name: str, rule: Callable) -> None:
        """Add reusable validation rule"""
        if rule_name not in self.rules:
            self.rules[rule_name] = []
        self.rules[rule_name].append(rule)
        logger.info("Validation rule added", rule_name=rule_name)
    
    async def validate_data(
        self, 
        data: Union[Dict[str, Any], List[Dict[str, Any]], pd.DataFrame],
        schema_name: Optional[str] = None,
        rules: Optional[List[str]] = None
    ) -> ValidationResult:
        """Validate data against schema and rules"""
        result = ValidationResult(is_valid=True)
        
        try:
            # Convert to DataFrame for easier processing
            if isinstance(data, dict):
                df = pd.DataFrame([data])
            elif isinstance(data, list):
                df = pd.DataFrame(data)
            elif isinstance(data, pd.DataFrame):
                df = data
            else:
                result.is_valid = False
                result.errors.append("Unsupported data format")
                return result
            
            # Schema validation
            if schema_name and schema_name in self.schemas:
                schema_result = await self._validate_schema(df, self.schemas[schema_name])
                result.errors.extend(schema_result.errors)
                result.warnings.extend(schema_result.warnings)
                if not schema_result.is_valid:
                    result.is_valid = False
            
            # Rule validation
            if rules:
                for rule_name in rules:
                    if rule_name in self.rules:
                        for rule in self.rules[rule_name]:
                            rule_result = await self._apply_rule(df, rule)
                            result.errors.extend(rule_result.errors)
                            result.warnings.extend(rule_result.warnings)
                            if not rule_result.is_valid:
                                result.is_valid = False
            
            # Generate statistics
            result.statistics = await self._generate_statistics(df)
            
            logger.info("Data validation completed", 
                       is_valid=result.is_valid,
                       error_count=len(result.errors),
                       warning_count=len(result.warnings))
            
        except Exception as e:
            result.is_valid = False
            result.errors.append(f"Validation error: {str(e)}")
            logger.error("Data validation failed", error=str(e))
        
        return result
    
    async def _validate_schema(self, df: pd.DataFrame, schema: Dict[str, Any]) -> ValidationResult:
        """Validate DataFrame against schema"""
        result = ValidationResult(is_valid=True)
        
        # Check required columns
        required_columns = [col for col, spec in schema.items() if spec.get('required', False)]
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            result.is_valid = False
            result.errors.extend([f"Missing required column: {col}" for col in missing_columns])
        
        # Check data types
        for column, spec in schema.items():
            if column not in df.columns:
                continue
                
            expected_type = spec.get('type')
            if expected_type and not await self._validate_column_type(df[column], expected_type):
                result.warnings.append(f"Column {column} type mismatch")
        
        return result
    
    async def _validate_column_type(self, series: pd.Series, expected_type: str) -> bool:
        """Validate column data type"""
        try:
            if expected_type == DataType.INTEGER:
                pd.to_numeric(series, errors='raise')
            elif expected_type == DataType.FLOAT:
                pd.to_numeric(series, errors='raise')
            elif expected_type == DataType.DATE:
                pd.to_datetime(series, errors='raise')
            elif expected_type == DataType.BOOLEAN:
                series.astype(bool, errors='raise')
            # Add more type validations as needed
            return True
        except:
            return False
    
    async def _apply_rule(self, df: pd.DataFrame, rule: Callable) -> ValidationResult:
        """Apply validation rule"""
        result = ValidationResult(is_valid=True)
        
        try:
            if asyncio.iscoroutinefunction(rule):
                rule_result = await rule(df)
            else:
                rule_result = rule(df)
            
            if isinstance(rule_result, bool):
                result.is_valid = rule_result
            elif isinstance(rule_result, dict):
                result.is_valid = rule_result.get('is_valid', True)
                result.errors.extend(rule_result.get('errors', []))
                result.warnings.extend(rule_result.get('warnings', []))
                
        except Exception as e:
            result.is_valid = False
            result.errors.append(f"Rule execution error: {str(e)}")
        
        return result
    
    async def _generate_statistics(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate data quality statistics"""
        stats = {
            "row_count": len(df),
            "column_count": len(df.columns),
            "null_counts": df.isnull().sum().to_dict(),
            "data_types": df.dtypes.astype(str).to_dict()
        }
        
        # Add numeric statistics for numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            stats["numeric_summary"] = df[numeric_cols].describe().to_dict()
        
        return stats

class DataTransformer:
    """
    Reusable data transformation engine
    Supports common transformations, custom functions, and data enrichment
    """
    
    def __init__(self):
        self.transformations: Dict[str, Callable] = {}
        self.lookup_tables: Dict[str, Dict[str, Any]] = {}
        
    def register_transformation(self, name: str, transform_func: Callable) -> None:
        """Register reusable transformation function"""
        self.transformations[name] = transform_func
        logger.info("Transformation registered", name=name)
    
    def add_lookup_table(self, name: str, lookup_data: Dict[str, Any]) -> None:
        """Add lookup table for data enrichment"""
        self.lookup_tables[name] = lookup_data
        logger.info("Lookup table added", name=name, size=len(lookup_data))
    
    async def transform_data(
        self,
        data: Union[Dict[str, Any], List[Dict[str, Any]], pd.DataFrame],
        transformations: List[str]
    ) -> Union[pd.DataFrame, List[Dict[str, Any]]]:
        """Apply transformations to data"""
        try:
            # Convert to DataFrame
            if isinstance(data, dict):
                df = pd.DataFrame([data])
                single_record = True
            elif isinstance(data, list):
                df = pd.DataFrame(data)
                single_record = False
            elif isinstance(data, pd.DataFrame):
                df = data
                single_record = False
            else:
                raise ValueError("Unsupported data format")
            
            # Apply transformations in sequence
            for transform_name in transformations:
                if transform_name in self.transformations:
                    transform_func = self.transformations[transform_name]
                    
                    if asyncio.iscoroutinefunction(transform_func):
                        df = await transform_func(df)
                    else:
                        df = transform_func(df)
                else:
                    logger.warning("Transformation not found", name=transform_name)
            
            # Return in original format
            if single_record:
                return df.to_dict('records')[0] if len(df) > 0 else {}
            else:
                return df
                
        except Exception as e:
            logger.error("Data transformation failed", error=str(e))
            raise
    
    async def enrich_data(
        self,
        data: pd.DataFrame,
        enrichment_config: Dict[str, Any]
    ) -> pd.DataFrame:
        """Enrich data using lookup tables and external sources"""
        enriched_df = data.copy()
        
        for lookup_name, config in enrichment_config.items():
            if lookup_name not in self.lookup_tables:
                continue
            
            lookup_table = self.lookup_tables[lookup_name]
            join_column = config.get('join_column')
            target_columns = config.get('target_columns', [])
            
            if join_column and join_column in enriched_df.columns:
                # Create lookup DataFrame
                lookup_df = pd.DataFrame.from_dict(lookup_table, orient='index')
                lookup_df.index.name = join_column
                lookup_df = lookup_df.reset_index()
                
                # Perform left join
                enriched_df = enriched_df.merge(
                    lookup_df[target_columns + [join_column]],
                    on=join_column,
                    how='left'
                )
        
        return enriched_df

class BatchProcessor:
    """
    Reusable batch processing engine
    Handles large datasets with parallel processing and memory management
    """
    
    def __init__(self, batch_size: int = 1000, max_workers: int = 4):
        self.batch_size = batch_size
        self.max_workers = max_workers
        self.executor = ThreadPoolExecutor(max_workers=max_workers)
        
    async def process_batches(
        self,
        data_source: AsyncIterator[Any],
        process_func: Callable,
        output_handler: Optional[Callable] = None
    ) -> Dict[str, Any]:
        """Process data in batches"""
        results = {
            "total_processed": 0,
            "total_success": 0,
            "total_failed": 0,
            "batches_processed": 0
        }
        
        batch = []
        async for item in data_source:
            batch.append(item)
            
            if len(batch) >= self.batch_size:
                batch_result = await self._process_batch(batch, process_func, output_handler)
                self._update_results(results, batch_result)
                batch = []
                results["batches_processed"] += 1
        
        # Process remaining items
        if batch:
            batch_result = await self._process_batch(batch, process_func, output_handler)
            self._update_results(results, batch_result)
            results["batches_processed"] += 1
        
        logger.info("Batch processing completed", results=results)
        return results
    
    async def _process_batch(
        self,
        batch: List[Any],
        process_func: Callable,
        output_handler: Optional[Callable]
    ) -> Dict[str, int]:
        """Process a single batch"""
        batch_results = {"processed": 0, "success": 0, "failed": 0}
        
        try:
            # Process batch using thread pool for CPU-intensive work
            loop = asyncio.get_event_loop()
            
            if asyncio.iscoroutinefunction(process_func):
                results = await process_func(batch)
            else:
                results = await loop.run_in_executor(self.executor, process_func, batch)
            
            batch_results["processed"] = len(batch)
            batch_results["success"] = len(batch)  # Assume success if no exception
            
            # Handle output if handler provided
            if output_handler and results:
                if asyncio.iscoroutinefunction(output_handler):
                    await output_handler(results)
                else:
                    await loop.run_in_executor(self.executor, output_handler, results)
                    
        except Exception as e:
            batch_results["processed"] = len(batch)
            batch_results["failed"] = len(batch)
            logger.error("Batch processing failed", error=str(e), batch_size=len(batch))
        
        return batch_results
    
    def _update_results(self, total_results: Dict[str, Any], batch_results: Dict[str, int]) -> None:
        """Update total results with batch results"""
        total_results["total_processed"] += batch_results["processed"]
        total_results["total_success"] += batch_results["success"]
        total_results["total_failed"] += batch_results["failed"]
    
    def __del__(self):
        """Clean up thread pool"""
        if hasattr(self, 'executor'):
            self.executor.shutdown(wait=False)

class ETLPipeline:
    """
    Complete ETL pipeline orchestrator
    Combines extraction, transformation, loading with monitoring and error handling
    """
    
    def __init__(
        self,
        pipeline_id: str,
        name: str,
        validator: Optional[DataValidator] = None,
        transformer: Optional[DataTransformer] = None,
        batch_processor: Optional[BatchProcessor] = None
    ):
        self.pipeline_id = pipeline_id
        self.name = name
        self.validator = validator or DataValidator()
        self.transformer = transformer or DataTransformer()
        self.batch_processor = batch_processor or BatchProcessor()
        
        # Pipeline configuration
        self.extractors: List[Callable] = []
        self.transformations: List[str] = []
        self.validation_rules: List[str] = []
        self.loaders: List[Callable] = []
        self.error_handlers: List[Callable] = []
        
        # Pipeline state
        self.runs: List[PipelineRun] = []
        self._is_running = False
    
    def add_extractor(self, extractor: Callable) -> 'ETLPipeline':
        """Add data extractor"""
        self.extractors.append(extractor)
        return self
    
    def add_transformation(self, transformation_name: str) -> 'ETLPipeline':
        """Add data transformation"""
        self.transformations.append(transformation_name)
        return self
    
    def add_validation_rule(self, rule_name: str) -> 'ETLPipeline':
        """Add validation rule"""
        self.validation_rules.append(rule_name)
        return self
    
    def add_loader(self, loader: Callable) -> 'ETLPipeline':
        """Add data loader"""
        self.loaders.append(loader)
        return self
    
    def add_error_handler(self, handler: Callable) -> 'ETLPipeline':
        """Add error handler"""
        self.error_handlers.append(handler)
        return self
    
    async def run(self, context: Optional[Dict[str, Any]] = None) -> PipelineRun:
        """Execute ETL pipeline"""
        if self._is_running:
            raise RuntimeError("Pipeline is already running")
        
        run_id = f"{self.pipeline_id}_{int(time.time())}"
        run = PipelineRun(
            run_id=run_id,
            pipeline_id=self.pipeline_id,
            status=PipelineStatus.RUNNING,
            started_at=datetime.utcnow(),
            metadata=context or {}
        )
        
        self.runs.append(run)
        self._is_running = True
        
        try:
            logger.info("ETL pipeline started", 
                       pipeline_id=self.pipeline_id,
                       run_id=run_id)
            
            # Extract phase
            extracted_data = await self._extract_data(context or {})
            if not extracted_data:
                raise Exception("No data extracted")
            
            # Transform phase
            transformed_data = await self._transform_data(extracted_data)
            
            # Validate phase
            validation_result = await self._validate_data(transformed_data)
            if not validation_result.is_valid:
                logger.warning("Data validation failed", 
                             errors=validation_result.errors)
            
            # Load phase
            load_results = await self._load_data(transformed_data)
            
            # Update run status
            run.status = PipelineStatus.SUCCESS
            run.completed_at = datetime.utcnow()
            run.duration_seconds = (run.completed_at - run.started_at).total_seconds()
            run.records_processed = len(transformed_data) if isinstance(transformed_data, list) else 1
            run.records_success = run.records_processed
            
            logger.info("ETL pipeline completed successfully", 
                       pipeline_id=self.pipeline_id,
                       run_id=run_id,
                       duration=run.duration_seconds)
            
        except Exception as e:
            # Handle errors
            run.status = PipelineStatus.FAILED
            run.error_message = str(e)
            run.completed_at = datetime.utcnow()
            
            logger.error("ETL pipeline failed", 
                        pipeline_id=self.pipeline_id,
                        run_id=run_id,
                        error=str(e))
            
            # Call error handlers
            for handler in self.error_handlers:
                try:
                    await self._call_handler(handler, {"run": run, "error": e})
                except Exception as handler_error:
                    logger.error("Error handler failed", error=str(handler_error))
            
        finally:
            self._is_running = False
        
        return run
    
    async def _extract_data(self, context: Dict[str, Any]) -> Any:
        """Extract data using configured extractors"""
        extracted_data = []
        
        for extractor in self.extractors:
            try:
                if asyncio.iscoroutinefunction(extractor):
                    data = await extractor(context)
                else:
                    data = extractor(context)
                
                if isinstance(data, list):
                    extracted_data.extend(data)
                else:
                    extracted_data.append(data)
                    
            except Exception as e:
                logger.error("Extraction failed", extractor=str(extractor), error=str(e))
                raise
        
        return extracted_data
    
    async def _transform_data(self, data: Any) -> Any:
        """Transform data using configured transformations"""
        if not self.transformations:
            return data
        
        return await self.transformer.transform_data(data, self.transformations)
    
    async def _validate_data(self, data: Any) -> ValidationResult:
        """Validate data using configured rules"""
        if not self.validation_rules:
            return ValidationResult(is_valid=True)
        
        return await self.validator.validate_data(data, rules=self.validation_rules)
    
    async def _load_data(self, data: Any) -> List[Any]:
        """Load data using configured loaders"""
        results = []
        
        for loader in self.loaders:
            try:
                if asyncio.iscoroutinefunction(loader):
                    result = await loader(data)
                else:
                    result = loader(data)
                
                results.append(result)
                
            except Exception as e:
                logger.error("Loading failed", loader=str(loader), error=str(e))
                raise
        
        return results
    
    async def _call_handler(self, handler: Callable, context: Dict[str, Any]) -> Any:
        """Call handler function with async support"""
        if asyncio.iscoroutinefunction(handler):
            return await handler(context)
        return handler(context)
    
    def get_last_run(self) -> Optional[PipelineRun]:
        """Get the last pipeline run"""
        return self.runs[-1] if self.runs else None
    
    def get_success_rate(self) -> float:
        """Calculate pipeline success rate"""
        if not self.runs:
            return 0.0
        
        successful_runs = len([r for r in self.runs if r.status == PipelineStatus.SUCCESS])
        return successful_runs / len(self.runs)

class ScheduleManager:
    """
    Reusable pipeline scheduling system
    Supports cron-like scheduling with error handling and retry logic
    """
    
    def __init__(self):
        self.scheduled_pipelines: Dict[str, Dict[str, Any]] = {}
        self._running = False
        self._scheduler_task: Optional[asyncio.Task] = None
    
    def schedule_pipeline(
        self,
        pipeline: ETLPipeline,
        schedule_config: Dict[str, Any]
    ) -> None:
        """Schedule pipeline execution"""
        pipeline_id = pipeline.pipeline_id
        
        self.scheduled_pipelines[pipeline_id] = {
            "pipeline": pipeline,
            "schedule": schedule_config,
            "last_run": None,
            "next_run": self._calculate_next_run(schedule_config),
            "retry_count": 0,
            "max_retries": schedule_config.get("max_retries", 3),
            "retry_delay": schedule_config.get("retry_delay", 300)  # 5 minutes
        }
        
        logger.info("Pipeline scheduled", 
                   pipeline_id=pipeline_id,
                   schedule=schedule_config)
    
    def unschedule_pipeline(self, pipeline_id: str) -> bool:
        """Unschedule pipeline"""
        if pipeline_id in self.scheduled_pipelines:
            del self.scheduled_pipelines[pipeline_id]
            logger.info("Pipeline unscheduled", pipeline_id=pipeline_id)
            return True
        return False
    
    async def start_scheduler(self) -> None:
        """Start the pipeline scheduler"""
        if self._running:
            return
        
        self._running = True
        self._scheduler_task = asyncio.create_task(self._scheduler_loop())
        logger.info("Pipeline scheduler started")
    
    async def stop_scheduler(self) -> None:
        """Stop the pipeline scheduler"""
        self._running = False
        if self._scheduler_task:
            self._scheduler_task.cancel()
            try:
                await self._scheduler_task
            except asyncio.CancelledError:
                pass
        logger.info("Pipeline scheduler stopped")
    
    async def _scheduler_loop(self) -> None:
        """Main scheduler loop"""
        while self._running:
            try:
                current_time = datetime.utcnow()
                
                for pipeline_id, config in self.scheduled_pipelines.items():
                    if current_time >= config["next_run"]:
                        # Execute pipeline
                        asyncio.create_task(self._execute_scheduled_pipeline(pipeline_id))
                        
                        # Update next run time
                        config["next_run"] = self._calculate_next_run(config["schedule"])
                
                # Sleep for 60 seconds before next check
                await asyncio.sleep(60)
                
            except Exception as e:
                logger.error("Scheduler loop error", error=str(e))
                await asyncio.sleep(60)
    
    async def _execute_scheduled_pipeline(self, pipeline_id: str) -> None:
        """Execute scheduled pipeline with retry logic"""
        config = self.scheduled_pipelines.get(pipeline_id)
        if not config:
            return
        
        pipeline = config["pipeline"]
        
        try:
            run = await pipeline.run()
            config["last_run"] = run
            config["retry_count"] = 0  # Reset retry count on success
            
            if run.status == PipelineStatus.SUCCESS:
                logger.info("Scheduled pipeline completed successfully", 
                           pipeline_id=pipeline_id)
            else:
                logger.error("Scheduled pipeline failed", 
                           pipeline_id=pipeline_id,
                           error=run.error_message)
                
        except Exception as e:
            logger.error("Scheduled pipeline execution failed", 
                        pipeline_id=pipeline_id,
                        error=str(e))
            
            # Handle retries
            config["retry_count"] += 1
            if config["retry_count"] <= config["max_retries"]:
                # Schedule retry
                retry_time = datetime.utcnow() + timedelta(seconds=config["retry_delay"])
                config["next_run"] = retry_time
                logger.info("Pipeline retry scheduled", 
                           pipeline_id=pipeline_id,
                           retry_count=config["retry_count"],
                           retry_time=retry_time)
    
    def _calculate_next_run(self, schedule_config: Dict[str, Any]) -> datetime:
        """Calculate next run time based on schedule configuration"""
        current_time = datetime.utcnow()
        
        if "interval_minutes" in schedule_config:
            return current_time + timedelta(minutes=schedule_config["interval_minutes"])
        elif "interval_hours" in schedule_config:
            return current_time + timedelta(hours=schedule_config["interval_hours"])
        elif "daily_at" in schedule_config:
            # Schedule for specific time each day
            target_time = schedule_config["daily_at"]  # Format: "HH:MM"
            hour, minute = map(int, target_time.split(":"))
            
            next_run = current_time.replace(hour=hour, minute=minute, second=0, microsecond=0)
            if next_run <= current_time:
                next_run += timedelta(days=1)
            
            return next_run
        else:
            # Default to hourly
            return current_time + timedelta(hours=1)

# Reusable transformation functions
async def clean_text_data(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and standardize text data"""
    text_columns = df.select_dtypes(include=['object']).columns
    
    for col in text_columns:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.lower()
            df[col] = df[col].replace('', None)  # Replace empty strings with None
    
    return df

async def normalize_dates(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize date columns to consistent format"""
    date_columns = df.select_dtypes(include=['datetime64']).columns
    
    for col in date_columns:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    
    return df

async def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicate rows"""
    initial_count = len(df)
    df_cleaned = df.drop_duplicates()
    removed_count = initial_count - len(df_cleaned)
    
    if removed_count > 0:
        logger.info("Duplicates removed", count=removed_count)
    
    return df_cleaned

# Reusable validation rules
def validate_required_fields(df: pd.DataFrame) -> Dict[str, Any]:
    """Validate that required fields are present"""
    required_fields = ['id', 'timestamp']  # Customize as needed
    missing_fields = [field for field in required_fields if field not in df.columns]
    
    return {
        "is_valid": len(missing_fields) == 0,
        "errors": [f"Missing required field: {field}" for field in missing_fields]
    }

def validate_data_ranges(df: pd.DataFrame) -> Dict[str, Any]:
    """Validate that numeric data is within expected ranges"""
    errors = []
    
    # Example: Check for negative IDs
    if 'id' in df.columns:
        negative_ids = df[df['id'] < 0]
        if len(negative_ids) > 0:
            errors.append(f"Found {len(negative_ids)} negative IDs")
    
    return {
        "is_valid": len(errors) == 0,
        "errors": errors
    }