"""
ERIP Sheets Integration API Router
FastAPI routes for spreadsheet operations with Excel compatibility and AI assistance
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime
import structlog
import io
import asyncio
import json

from shared.auth import get_current_user, require_permission, ComponentPermissions, TokenData
from .sheets_engine import (
    SheetsEngine,
    Cell,
    Range,
    Chart,
    ChartType,
    DataSource,
    DataConnection,
    CellDataType,
    Workbook,
    Worksheet
)
from .websocket_manager import websocket_manager

router = APIRouter()
logger = structlog.get_logger()

# Initialize the sheets engine
sheets_engine = SheetsEngine()

# Pydantic models for API requests
class CreateWorkbookRequest(BaseModel):
    name: str
    template: Optional[str] = None
    
class UpdateCellRequest(BaseModel):
    row: int
    column: int
    value: Optional[Any] = None
    formula: Optional[str] = None
    
class RangeRequest(BaseModel):
    start_row: int
    start_column: int
    end_row: int
    end_column: int
    
class SetRangeDataRequest(BaseModel):
    range: RangeRequest
    data: List[List[Any]]
    
class CreateChartRequest(BaseModel):
    chart_type: ChartType
    title: str
    data_range: RangeRequest
    position: Dict[str, int]
    
class DataConnectionRequest(BaseModel):
    name: str
    source_type: DataSource
    connection_config: Dict[str, Any]
    target_range: RangeRequest
    auto_refresh: bool = True
    refresh_schedule: Optional[str] = None
    
class FormulaAssistanceRequest(BaseModel):
    context: str
    data_description: str
    
class DataAnalysisRequest(BaseModel):
    worksheet_id: str
    data_range: RangeRequest
    analysis_type: str = "general"

@router.post("/workbooks", response_model=Dict[str, str])
async def create_workbook(
    request: CreateWorkbookRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Create a new spreadsheet workbook
    
    Supports templates for common use cases like risk dashboards, ROI calculators,
    and compliance trackers. Each workbook includes live data connections to ERIP components.
    """
    try:
        logger.info("Creating new workbook",
                   user_id=current_user.user_id,
                   name=request.name,
                   template=request.template)
        
        workbook_id = await sheets_engine.create_workbook(
            name=request.name,
            created_by=current_user.user_id,
            template=request.template
        )
        
        logger.info("Workbook created successfully",
                   user_id=current_user.user_id,
                   workbook_id=workbook_id)
        
        return {"workbook_id": workbook_id}
        
    except Exception as e:
        logger.error("Failed to create workbook",
                    user_id=current_user.user_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create workbook: {str(e)}"
        )

@router.get("/workbooks/{workbook_id}")
async def get_workbook(
    workbook_id: str,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Get workbook details and metadata
    
    Returns complete workbook structure including worksheets, charts, and data connections.
    """
    try:
        workbook = sheets_engine.workbooks.get(workbook_id)
        if not workbook:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Workbook {workbook_id} not found"
            )
        
        # Check permissions
        if current_user.user_id not in workbook.permissions and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied to this workbook"
            )
        
        return workbook.dict()
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to get workbook",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get workbook: {str(e)}"
        )

@router.post("/workbooks/{workbook_id}/worksheets/{worksheet_id}/cells")
async def update_cell(
    workbook_id: str,
    worksheet_id: str,
    request: UpdateCellRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Update individual cell value or formula
    
    Supports Excel-compatible formulas with automatic calculation and dependency updates.
    """
    try:
        logger.info("Updating cell",
                   user_id=current_user.user_id,
                   workbook_id=workbook_id,
                   row=request.row,
                   column=request.column)
        
        cell = await sheets_engine.update_cell(
            workbook_id=workbook_id,
            worksheet_id=worksheet_id,
            row=request.row,
            column=request.column,
            value=request.value,
            formula=request.formula
        )
        
        return cell.dict()
        
    except Exception as e:
        logger.error("Failed to update cell",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update cell: {str(e)}"
        )

@router.get("/workbooks/{workbook_id}/worksheets/{worksheet_id}/range")
async def get_range_data(
    workbook_id: str,
    worksheet_id: str,
    start_row: int = Query(...),
    start_column: int = Query(...),
    end_row: int = Query(...),
    end_column: int = Query(...),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Get data from specified cell range
    
    Returns a 2D array of cell values from the specified range.
    """
    try:
        range_def = Range(
            start_row=start_row,
            start_column=start_column,
            end_row=end_row,
            end_column=end_column
        )
        
        data = await sheets_engine.get_range_data(
            workbook_id=workbook_id,
            worksheet_id=worksheet_id,
            range_def=range_def
        )
        
        return {"data": data, "range": range_def.to_excel_notation()}
        
    except Exception as e:
        logger.error("Failed to get range data",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get range data: {str(e)}"
        )

@router.put("/workbooks/{workbook_id}/worksheets/{worksheet_id}/range")
async def set_range_data(
    workbook_id: str,
    worksheet_id: str,
    request: SetRangeDataRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Set data for specified cell range
    
    Bulk update cells with automatic data type detection and formula processing.
    """
    try:
        range_def = Range(**request.range.dict())
        
        success = await sheets_engine.set_range_data(
            workbook_id=workbook_id,
            worksheet_id=worksheet_id,
            range_def=range_def,
            data=request.data
        )
        
        return {"success": success, "cells_updated": len(request.data) * len(request.data[0]) if request.data else 0}
        
    except Exception as e:
        logger.error("Failed to set range data",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to set range data: {str(e)}"
        )

@router.post("/workbooks/{workbook_id}/worksheets/{worksheet_id}/charts")
async def create_chart(
    workbook_id: str,
    worksheet_id: str,
    request: CreateChartRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Create chart in worksheet
    
    Supports multiple chart types with automatic data binding and real-time updates.
    """
    try:
        range_def = Range(**request.data_range.dict())
        
        chart_id = await sheets_engine.create_chart(
            workbook_id=workbook_id,
            worksheet_id=worksheet_id,
            chart_type=request.chart_type,
            title=request.title,
            data_range=range_def,
            position=request.position
        )
        
        logger.info("Chart created successfully",
                   user_id=current_user.user_id,
                   chart_id=chart_id)
        
        return {"chart_id": chart_id}
        
    except Exception as e:
        logger.error("Failed to create chart",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create chart: {str(e)}"
        )

@router.post("/workbooks/{workbook_id}/worksheets/{worksheet_id}/connections")
async def connect_data_source(
    workbook_id: str,
    worksheet_id: str,
    request: DataConnectionRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Connect external data source to worksheet
    
    Enables live data connections to PRISM, BEACON, ATLAS, COMPASS, and external APIs.
    Data automatically refreshes based on configured schedule.
    """
    try:
        logger.info("Connecting data source",
                   user_id=current_user.user_id,
                   workbook_id=workbook_id,
                   source_type=request.source_type)
        
        range_def = Range(**request.target_range.dict())
        
        connection_id = await sheets_engine.connect_data_source(
            workbook_id=workbook_id,
            worksheet_id=worksheet_id,
            connection_name=request.name,
            source_type=request.source_type,
            config=request.connection_config,
            target_range=range_def
        )
        
        logger.info("Data source connected successfully",
                   user_id=current_user.user_id,
                   connection_id=connection_id)
        
        return {"connection_id": connection_id}
        
    except Exception as e:
        logger.error("Failed to connect data source",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to connect data source: {str(e)}"
        )

@router.post("/workbooks/{workbook_id}/refresh")
async def refresh_data_connections(
    workbook_id: str,
    worksheet_id: Optional[str] = None,
    background_tasks: BackgroundTasks = BackgroundTasks(),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Refresh data connections
    
    Updates all live data connections in the workbook or specific worksheet.
    Can be run synchronously or in background for large datasets.
    """
    try:
        logger.info("Refreshing data connections",
                   user_id=current_user.user_id,
                   workbook_id=workbook_id)
        
        # For large refreshes, run in background
        if worksheet_id is None:  # Full workbook refresh
            background_tasks.add_task(
                sheets_engine.refresh_data_connections,
                workbook_id,
                worksheet_id
            )
            return {"status": "refresh_started", "mode": "background"}
        else:
            # Single worksheet refresh can be synchronous
            results = await sheets_engine.refresh_data_connections(
                workbook_id,
                worksheet_id
            )
            return {"status": "refresh_completed", "results": results}
        
    except Exception as e:
        logger.error("Failed to refresh data connections",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to refresh data connections: {str(e)}"
        )

@router.post("/ai/formula-assistance")
async def get_formula_assistance(
    request: FormulaAssistanceRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    AI-powered formula assistance
    
    Natural language to Excel formula conversion with context-aware suggestions.
    """
    try:
        logger.info("Formula assistance requested",
                   user_id=current_user.user_id,
                   context=request.context[:50])
        
        suggestions = await sheets_engine.ai_assistant.suggest_formulas(
            context=request.context,
            data_description=request.data_description
        )
        
        return {
            "suggestions": suggestions,
            "explanation": "AI-generated formula suggestions based on your context"
        }
        
    except Exception as e:
        logger.error("Failed to get formula assistance",
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get formula assistance: {str(e)}"
        )

@router.post("/ai/analyze-data")
async def analyze_data(
    workbook_id: str,
    request: DataAnalysisRequest,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    AI-powered data analysis
    
    Provides insights, patterns, anomalies, and recommendations for selected data range.
    """
    try:
        logger.info("Data analysis requested",
                   user_id=current_user.user_id,
                   workbook_id=workbook_id,
                   analysis_type=request.analysis_type)
        
        range_def = Range(**request.data_range.dict())
        
        analysis = await sheets_engine.ai_assistant.analyze_data(
            workbook_id=workbook_id,
            worksheet_id=request.worksheet_id,
            data_range=range_def
        )
        
        return analysis
        
    except Exception as e:
        logger.error("Failed to analyze data",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze data: {str(e)}"
        )

@router.post("/workbooks/{workbook_id}/import/excel")
async def import_excel(
    workbook_id: str,
    file: UploadFile = File(...),
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Import Excel file into workbook
    
    Supports .xlsx, .xls, and .csv formats with automatic structure detection.
    """
    try:
        logger.info("Importing Excel file",
                   user_id=current_user.user_id,
                   workbook_id=workbook_id,
                   filename=file.filename)
        
        # Read file content
        content = await file.read()
        
        # Import into workbook
        success = await sheets_engine.excel_converter.import_excel(
            file_content=content,
            workbook_id=workbook_id
        )
        
        if success:
            return {"status": "imported", "filename": file.filename}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to import Excel file"
            )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to import Excel file",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to import Excel file: {str(e)}"
        )

@router.get("/workbooks/{workbook_id}/export/excel")
async def export_excel(
    workbook_id: str,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Export workbook to Excel format
    
    Generates Excel file with full formatting, formulas, and charts preserved.
    """
    try:
        logger.info("Exporting to Excel",
                   user_id=current_user.user_id,
                   workbook_id=workbook_id)
        
        workbook = sheets_engine.workbooks.get(workbook_id)
        if not workbook:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Workbook {workbook_id} not found"
            )
        
        # Export to Excel
        excel_content = await sheets_engine.excel_converter.export_excel(workbook)
        
        # Return as downloadable file
        return StreamingResponse(
            io.BytesIO(excel_content),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename={workbook.name}.xlsx"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to export Excel file",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to export Excel file: {str(e)}"
        )

@router.get("/templates")
async def get_available_templates(
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Get available workbook templates
    
    Returns list of pre-configured templates for common use cases.
    """
    templates = [
        {
            "id": "risk_dashboard",
            "name": "Risk Dashboard",
            "description": "Executive risk metrics with PRISM integration",
            "components": ["PRISM", "BEACON"]
        },
        {
            "id": "compliance_tracker",
            "name": "Compliance Tracker",
            "description": "Framework compliance tracking with COMPASS data",
            "components": ["COMPASS", "ATLAS"]
        },
        {
            "id": "roi_calculator",
            "name": "ROI Calculator",
            "description": "Security investment ROI analysis",
            "components": ["BEACON", "PRISM"]
        },
        {
            "id": "security_scorecard",
            "name": "Security Scorecard",
            "description": "Organization security posture assessment",
            "components": ["ATLAS", "NEXUS"]
        },
        {
            "id": "blank",
            "name": "Blank Workbook",
            "description": "Empty workbook with no pre-configured data",
            "components": []
        }
    ]
    
    return {"templates": templates}

@router.get("/workbooks/{workbook_id}/insights")
async def get_workbook_insights(
    workbook_id: str,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Get AI-generated insights for entire workbook
    
    Analyzes all worksheets and provides executive-level insights and recommendations.
    """
    try:
        logger.info("Generating workbook insights",
                   user_id=current_user.user_id,
                   workbook_id=workbook_id)
        
        workbook = sheets_engine.workbooks.get(workbook_id)
        if not workbook:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Workbook {workbook_id} not found"
            )
        
        # Generate insights for each worksheet
        all_insights = []
        for ws_id, worksheet in workbook.worksheets.items():
            insights = await sheets_engine.ai_assistant.generate_insights(
                workbook, ws_id
            )
            all_insights.extend(insights)
        
        return {
            "workbook_id": workbook_id,
            "insights": all_insights,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Failed to generate insights",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate insights: {str(e)}"
        )

@router.websocket("/workbooks/{workbook_id}/worksheets/{worksheet_id}/collaborate")
async def websocket_collaborate(
    websocket: WebSocket,
    workbook_id: str,
    worksheet_id: str,
    user_id: str = Query(..., description="User ID for authentication"),
    email: str = Query(..., description="User email for display")
):
    """
    WebSocket endpoint for real-time collaboration
    
    Enables multi-user editing with:
    - Real-time cell updates and conflict resolution
    - Live cursor tracking and selection sharing
    - Automatic synchronization and recovery
    - Performance optimized for 100+ concurrent users
    """
    connection_id = None
    
    try:
        # Connect user to collaborative session
        connection_id = await websocket_manager.connect(
            websocket=websocket,
            user_id=user_id,
            email=email,
            workbook_id=workbook_id,
            worksheet_id=worksheet_id
        )
        
        logger.info("WebSocket collaboration session started",
                   user_id=user_id,
                   workbook_id=workbook_id,
                   worksheet_id=worksheet_id,
                   connection_id=connection_id)
        
        # Handle incoming messages
        while True:
            try:
                # Receive message from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Process message through WebSocket manager
                await websocket_manager.handle_message(connection_id, message)
                
            except WebSocketDisconnect:
                logger.info("WebSocket client disconnected", 
                           user_id=user_id,
                           connection_id=connection_id)
                break
                
            except json.JSONDecodeError as e:
                logger.warning("Invalid JSON received",
                             user_id=user_id,
                             error=str(e))
                continue
                
            except Exception as e:
                logger.error("Error processing WebSocket message",
                           user_id=user_id,
                           connection_id=connection_id,
                           error=str(e))
                continue
    
    except Exception as e:
        logger.error("WebSocket collaboration session failed",
                   user_id=user_id,
                   workbook_id=workbook_id,
                   error=str(e))
        
    finally:
        # Ensure cleanup on disconnect
        if connection_id:
            await websocket_manager.disconnect(connection_id)

@router.get("/workbooks/{workbook_id}/collaboration/stats")
async def get_collaboration_stats(
    workbook_id: str,
    current_user: TokenData = Depends(require_permission(ComponentPermissions.BEACON))
):
    """
    Get collaboration statistics for workbook
    
    Returns active user count, connection statistics, and performance metrics
    """
    try:
        stats = websocket_manager.get_workbook_stats(workbook_id)
        
        return {
            "workbook_id": workbook_id,
            "collaboration_stats": stats,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error("Failed to get collaboration stats",
                    workbook_id=workbook_id,
                    error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get collaboration stats: {str(e)}"
        )