"""
ERIP Sheets WebSocket Manager
Real-time collaboration infrastructure for multi-user spreadsheet editing
"""

from typing import Dict, List, Set, Optional, Any
from fastapi import WebSocket, WebSocketDisconnect
import json
import asyncio
import structlog
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
import uuid
from collections import defaultdict

logger = structlog.get_logger()

class MessageType(str, Enum):
    """WebSocket message types"""
    USER_JOIN = "user_join"
    USER_LEAVE = "user_leave"
    CELL_UPDATE = "cell_update"
    RANGE_UPDATE = "range_update"
    CURSOR_POSITION = "cursor_position"
    SELECTION_CHANGE = "selection_change"
    CHART_UPDATE = "chart_update"
    WORKSHEET_CHANGE = "worksheet_change"
    CONFLICT_RESOLUTION = "conflict_resolution"
    SYNC_REQUEST = "sync_request"
    SYNC_RESPONSE = "sync_response"
    ERROR = "error"
    HEARTBEAT = "heartbeat"

@dataclass
class WebSocketMessage:
    """Standard WebSocket message format"""
    type: MessageType
    payload: Dict[str, Any]
    user_id: str
    timestamp: str
    message_id: str = None
    
    def __post_init__(self):
        if not self.message_id:
            self.message_id = str(uuid.uuid4())
        if not self.timestamp:
            self.timestamp = datetime.utcnow().isoformat()

@dataclass
class UserSession:
    """Active user session"""
    user_id: str
    email: str
    websocket: WebSocket
    workbook_id: str
    worksheet_id: str
    cursor_position: Optional[Dict[str, int]] = None
    selection_range: Optional[Dict[str, int]] = None
    last_activity: datetime = None
    
    def __post_init__(self):
        if not self.last_activity:
            self.last_activity = datetime.utcnow()

@dataclass
class ConflictResolution:
    """Conflict resolution data"""
    cell_row: int
    cell_column: int
    user_edits: List[Dict[str, Any]]
    resolved_value: Any
    resolution_strategy: str
    timestamp: str

class WebSocketManager:
    """
    Manages WebSocket connections for real-time collaboration
    
    Features:
    - Multi-user editing with conflict resolution
    - Real-time cursor tracking and selection sharing
    - Automatic synchronization and recovery
    - Performance optimized for 100+ concurrent users per workbook
    """
    
    def __init__(self):
        # Connection tracking
        self.active_connections: Dict[str, UserSession] = {}
        self.workbook_users: Dict[str, Set[str]] = defaultdict(set)
        self.user_connections: Dict[str, str] = {}  # user_id -> connection_id
        
        # Collaboration state
        self.user_cursors: Dict[str, Dict[str, Any]] = defaultdict(dict)
        self.user_selections: Dict[str, Dict[str, Any]] = defaultdict(dict)
        self.pending_operations: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        
        # Conflict resolution
        self.edit_history: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
        self.conflict_resolution_queue: Dict[str, List[ConflictResolution]] = defaultdict(list)
        
        # Performance monitoring
        self.message_count = 0
        self.connection_count = 0
        
        logger.info("WebSocket manager initialized")
    
    async def connect(
        self, 
        websocket: WebSocket, 
        user_id: str, 
        email: str,
        workbook_id: str, 
        worksheet_id: str
    ) -> str:
        """
        Connect user to collaborative session
        
        Returns connection_id for tracking
        """
        try:
            await websocket.accept()
            
            connection_id = str(uuid.uuid4())
            session = UserSession(
                user_id=user_id,
                email=email,
                websocket=websocket,
                workbook_id=workbook_id,
                worksheet_id=worksheet_id
            )
            
            self.active_connections[connection_id] = session
            self.workbook_users[workbook_id].add(user_id)
            self.user_connections[user_id] = connection_id
            self.connection_count += 1
            
            # Notify other users about new connection
            await self._broadcast_user_join(workbook_id, user_id, email, connection_id)
            
            # Send current collaborative state to new user
            await self._send_sync_data(connection_id, workbook_id, worksheet_id)
            
            logger.info("User connected to collaborative session",
                       user_id=user_id,
                       workbook_id=workbook_id,
                       connection_id=connection_id,
                       total_connections=self.connection_count)
            
            return connection_id
            
        except Exception as e:
            logger.error("Failed to connect user", 
                        user_id=user_id,
                        error=str(e))
            raise
    
    async def disconnect(self, connection_id: str):
        """Disconnect user from collaborative session"""
        try:
            if connection_id not in self.active_connections:
                return
            
            session = self.active_connections[connection_id]
            user_id = session.user_id
            workbook_id = session.workbook_id
            
            # Remove from tracking
            del self.active_connections[connection_id]
            self.workbook_users[workbook_id].discard(user_id)
            if user_id in self.user_connections:
                del self.user_connections[user_id]
            self.connection_count -= 1
            
            # Clean up user state
            if user_id in self.user_cursors:
                del self.user_cursors[user_id]
            if user_id in self.user_selections:
                del self.user_selections[user_id]
            
            # Notify other users about disconnection
            await self._broadcast_user_leave(workbook_id, user_id, connection_id)
            
            logger.info("User disconnected from collaborative session",
                       user_id=user_id,
                       workbook_id=workbook_id,
                       connection_id=connection_id,
                       remaining_connections=self.connection_count)
            
        except Exception as e:
            logger.error("Error during disconnect", 
                        connection_id=connection_id,
                        error=str(e))
    
    async def handle_message(self, connection_id: str, message: dict):
        """Handle incoming WebSocket message"""
        try:
            if connection_id not in self.active_connections:
                logger.warning("Message from unknown connection", connection_id=connection_id)
                return
            
            session = self.active_connections[connection_id]
            session.last_activity = datetime.utcnow()
            self.message_count += 1
            
            # Parse message
            msg_type = MessageType(message.get("type"))
            payload = message.get("payload", {})
            
            # Route message to appropriate handler
            if msg_type == MessageType.CELL_UPDATE:
                await self._handle_cell_update(session, payload)
            elif msg_type == MessageType.RANGE_UPDATE:
                await self._handle_range_update(session, payload)
            elif msg_type == MessageType.CURSOR_POSITION:
                await self._handle_cursor_position(session, payload)
            elif msg_type == MessageType.SELECTION_CHANGE:
                await self._handle_selection_change(session, payload)
            elif msg_type == MessageType.CHART_UPDATE:
                await self._handle_chart_update(session, payload)
            elif msg_type == MessageType.SYNC_REQUEST:
                await self._handle_sync_request(session, payload)
            elif msg_type == MessageType.HEARTBEAT:
                await self._handle_heartbeat(session, payload)
            else:
                logger.warning("Unknown message type", type=msg_type, connection_id=connection_id)
            
        except Exception as e:
            logger.error("Error handling WebSocket message",
                        connection_id=connection_id,
                        error=str(e))
            await self._send_error(connection_id, f"Error processing message: {str(e)}")
    
    async def _handle_cell_update(self, session: UserSession, payload: dict):
        """Handle cell update with conflict resolution"""
        try:
            row = payload.get("row")
            column = payload.get("column")
            value = payload.get("value")
            formula = payload.get("formula")
            
            # Check for conflicts
            conflicts = await self._detect_conflicts(
                session.workbook_id, row, column, session.user_id
            )
            
            if conflicts:
                # Handle conflict resolution
                resolution = await self._resolve_conflict(
                    session.workbook_id, row, column, 
                    session.user_id, value, formula, conflicts
                )
                
                # Broadcast conflict resolution
                await self._broadcast_conflict_resolution(
                    session.workbook_id, resolution
                )
            else:
                # No conflicts, proceed with update
                update_data = {
                    "row": row,
                    "column": column,
                    "value": value,
                    "formula": formula,
                    "user_id": session.user_id,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                # Record edit in history
                self._record_edit(session.workbook_id, update_data)
                
                # Broadcast to other users
                await self._broadcast_to_workbook(
                    session.workbook_id,
                    MessageType.CELL_UPDATE,
                    update_data,
                    exclude_user=session.user_id
                )
            
            logger.info("Cell update processed",
                       workbook_id=session.workbook_id,
                       user_id=session.user_id,
                       row=row, column=column)
            
        except Exception as e:
            logger.error("Error handling cell update", error=str(e))
            await self._send_error(session.user_id, "Failed to update cell")
    
    async def _handle_range_update(self, session: UserSession, payload: dict):
        """Handle bulk range update"""
        try:
            range_data = payload.get("range")
            data = payload.get("data")
            
            update_data = {
                "range": range_data,
                "data": data,
                "user_id": session.user_id,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Broadcast to other users
            await self._broadcast_to_workbook(
                session.workbook_id,
                MessageType.RANGE_UPDATE,
                update_data,
                exclude_user=session.user_id
            )
            
            logger.info("Range update processed",
                       workbook_id=session.workbook_id,
                       user_id=session.user_id,
                       range=range_data)
            
        except Exception as e:
            logger.error("Error handling range update", error=str(e))
            await self._send_error(session.user_id, "Failed to update range")
    
    async def _handle_cursor_position(self, session: UserSession, payload: dict):
        """Handle cursor position update"""
        try:
            cursor_data = {
                "row": payload.get("row"),
                "column": payload.get("column"),
                "user_id": session.user_id,
                "email": session.email,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Update cursor tracking
            self.user_cursors[session.user_id] = cursor_data
            session.cursor_position = {"row": cursor_data["row"], "column": cursor_data["column"]}
            
            # Broadcast to other users (lightweight message)
            await self._broadcast_to_workbook(
                session.workbook_id,
                MessageType.CURSOR_POSITION,
                cursor_data,
                exclude_user=session.user_id
            )
            
        except Exception as e:
            logger.error("Error handling cursor position", error=str(e))
    
    async def _handle_selection_change(self, session: UserSession, payload: dict):
        """Handle selection range change"""
        try:
            selection_data = {
                "start_row": payload.get("start_row"),
                "start_column": payload.get("start_column"),
                "end_row": payload.get("end_row"),
                "end_column": payload.get("end_column"),
                "user_id": session.user_id,
                "email": session.email,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Update selection tracking
            self.user_selections[session.user_id] = selection_data
            session.selection_range = {
                "start_row": selection_data["start_row"],
                "start_column": selection_data["start_column"],
                "end_row": selection_data["end_row"],
                "end_column": selection_data["end_column"]
            }
            
            # Broadcast to other users
            await self._broadcast_to_workbook(
                session.workbook_id,
                MessageType.SELECTION_CHANGE,
                selection_data,
                exclude_user=session.user_id
            )
            
        except Exception as e:
            logger.error("Error handling selection change", error=str(e))
    
    async def _handle_chart_update(self, session: UserSession, payload: dict):
        """Handle chart update"""
        try:
            chart_data = {
                "chart_id": payload.get("chart_id"),
                "action": payload.get("action"),  # create, update, delete
                "chart_config": payload.get("chart_config"),
                "user_id": session.user_id,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Broadcast to other users
            await self._broadcast_to_workbook(
                session.workbook_id,
                MessageType.CHART_UPDATE,
                chart_data,
                exclude_user=session.user_id
            )
            
            logger.info("Chart update processed",
                       workbook_id=session.workbook_id,
                       chart_id=chart_data["chart_id"],
                       action=chart_data["action"])
            
        except Exception as e:
            logger.error("Error handling chart update", error=str(e))
    
    async def _handle_sync_request(self, session: UserSession, payload: dict):
        """Handle synchronization request"""
        try:
            await self._send_sync_data(
                self.user_connections[session.user_id], 
                session.workbook_id, 
                session.worksheet_id
            )
        except Exception as e:
            logger.error("Error handling sync request", error=str(e))
    
    async def _handle_heartbeat(self, session: UserSession, payload: dict):
        """Handle heartbeat to maintain connection"""
        session.last_activity = datetime.utcnow()
        
        # Send heartbeat response
        await self._send_message_to_user(
            session.user_id,
            MessageType.HEARTBEAT,
            {"status": "alive", "timestamp": datetime.utcnow().isoformat()}
        )
    
    async def _detect_conflicts(
        self, 
        workbook_id: str, 
        row: int, 
        column: int, 
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Detect editing conflicts for the same cell"""
        conflicts = []
        
        # Check recent edit history for the same cell
        recent_edits = [
            edit for edit in self.edit_history[workbook_id]
            if (edit.get("row") == row and 
                edit.get("column") == column and
                edit.get("user_id") != user_id and
                # Within last 5 seconds
                (datetime.utcnow() - datetime.fromisoformat(edit.get("timestamp", ""))).seconds < 5
            )
        ]
        
        return recent_edits
    
    async def _resolve_conflict(
        self,
        workbook_id: str,
        row: int,
        column: int,
        user_id: str,
        value: Any,
        formula: str,
        conflicts: List[Dict[str, Any]]
    ) -> ConflictResolution:
        """Resolve editing conflict using last-write-wins strategy"""
        
        # For now, use simple last-write-wins
        # In production, could implement more sophisticated conflict resolution
        resolution = ConflictResolution(
            cell_row=row,
            cell_column=column,
            user_edits=conflicts + [{
                "user_id": user_id,
                "value": value,
                "formula": formula,
                "timestamp": datetime.utcnow().isoformat()
            }],
            resolved_value=value,  # Last write wins
            resolution_strategy="last_write_wins",
            timestamp=datetime.utcnow().isoformat()
        )
        
        return resolution
    
    def _record_edit(self, workbook_id: str, edit_data: Dict[str, Any]):
        """Record edit in history for conflict detection"""
        self.edit_history[workbook_id].append(edit_data)
        
        # Keep only recent edits (last 100 or last hour)
        cutoff_time = datetime.utcnow() - timedelta(hours=1)
        self.edit_history[workbook_id] = [
            edit for edit in self.edit_history[workbook_id][-100:]
            if datetime.fromisoformat(edit.get("timestamp", "")) > cutoff_time
        ]
    
    async def _broadcast_user_join(
        self, 
        workbook_id: str, 
        user_id: str, 
        email: str, 
        connection_id: str
    ):
        """Broadcast user join notification"""
        join_data = {
            "user_id": user_id,
            "email": email,
            "connection_id": connection_id,
            "active_users": len(self.workbook_users[workbook_id]),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self._broadcast_to_workbook(
            workbook_id,
            MessageType.USER_JOIN,
            join_data,
            exclude_user=user_id
        )
    
    async def _broadcast_user_leave(
        self, 
        workbook_id: str, 
        user_id: str, 
        connection_id: str
    ):
        """Broadcast user leave notification"""
        leave_data = {
            "user_id": user_id,
            "connection_id": connection_id,
            "active_users": len(self.workbook_users[workbook_id]),
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await self._broadcast_to_workbook(
            workbook_id,
            MessageType.USER_LEAVE,
            leave_data,
            exclude_user=user_id
        )
    
    async def _broadcast_conflict_resolution(
        self, 
        workbook_id: str, 
        resolution: ConflictResolution
    ):
        """Broadcast conflict resolution to all users"""
        resolution_data = asdict(resolution)
        
        await self._broadcast_to_workbook(
            workbook_id,
            MessageType.CONFLICT_RESOLUTION,
            resolution_data
        )
    
    async def _broadcast_to_workbook(
        self, 
        workbook_id: str, 
        message_type: MessageType, 
        payload: Dict[str, Any],
        exclude_user: str = None
    ):
        """Broadcast message to all users in workbook"""
        message = WebSocketMessage(
            type=message_type,
            payload=payload,
            user_id="system",
            timestamp=datetime.utcnow().isoformat()
        )
        
        # Find all connections for this workbook
        workbook_connections = [
            conn for conn in self.active_connections.values()
            if conn.workbook_id == workbook_id and (
                not exclude_user or conn.user_id != exclude_user
            )
        ]
        
        # Send to all connections
        for session in workbook_connections:
            try:
                await session.websocket.send_text(json.dumps(asdict(message)))
            except Exception as e:
                logger.warning("Failed to send message to user",
                             user_id=session.user_id,
                             error=str(e))
                # Connection might be stale, will be cleaned up on next disconnect
    
    async def _send_message_to_user(
        self, 
        user_id: str, 
        message_type: MessageType, 
        payload: Dict[str, Any]
    ):
        """Send message to specific user"""
        if user_id not in self.user_connections:
            return
        
        connection_id = self.user_connections[user_id]
        if connection_id not in self.active_connections:
            return
        
        session = self.active_connections[connection_id]
        message = WebSocketMessage(
            type=message_type,
            payload=payload,
            user_id="system",
            timestamp=datetime.utcnow().isoformat()
        )
        
        try:
            await session.websocket.send_text(json.dumps(asdict(message)))
        except Exception as e:
            logger.warning("Failed to send message to user",
                         user_id=user_id,
                         error=str(e))
    
    async def _send_error(self, connection_id: str, error_message: str):
        """Send error message to connection"""
        if connection_id not in self.active_connections:
            return
        
        session = self.active_connections[connection_id]
        message = WebSocketMessage(
            type=MessageType.ERROR,
            payload={"error": error_message},
            user_id="system",
            timestamp=datetime.utcnow().isoformat()
        )
        
        try:
            await session.websocket.send_text(json.dumps(asdict(message)))
        except Exception as e:
            logger.warning("Failed to send error message",
                         connection_id=connection_id,
                         error=str(e))
    
    async def _send_sync_data(
        self, 
        connection_id: str, 
        workbook_id: str, 
        worksheet_id: str
    ):
        """Send current collaborative state to user"""
        try:
            # Get active users in workbook
            active_users = []
            for session in self.active_connections.values():
                if session.workbook_id == workbook_id:
                    active_users.append({
                        "user_id": session.user_id,
                        "email": session.email,
                        "cursor_position": session.cursor_position,
                        "selection_range": session.selection_range,
                        "last_activity": session.last_activity.isoformat()
                    })
            
            sync_data = {
                "workbook_id": workbook_id,
                "worksheet_id": worksheet_id,
                "active_users": active_users,
                "user_cursors": dict(self.user_cursors),
                "user_selections": dict(self.user_selections),
                "timestamp": datetime.utcnow().isoformat()
            }
            
            session = self.active_connections[connection_id]
            message = WebSocketMessage(
                type=MessageType.SYNC_RESPONSE,
                payload=sync_data,
                user_id="system",
                timestamp=datetime.utcnow().isoformat()
            )
            
            await session.websocket.send_text(json.dumps(asdict(message)))
            
        except Exception as e:
            logger.error("Failed to send sync data",
                        connection_id=connection_id,
                        error=str(e))
    
    def get_workbook_stats(self, workbook_id: str) -> Dict[str, Any]:
        """Get collaboration statistics for workbook"""
        active_user_count = len(self.workbook_users.get(workbook_id, set()))
        
        return {
            "workbook_id": workbook_id,
            "active_users": active_user_count,
            "total_connections": self.connection_count,
            "total_messages": self.message_count,
            "recent_edits": len(self.edit_history.get(workbook_id, [])),
            "conflicts_resolved": len(self.conflict_resolution_queue.get(workbook_id, []))
        }
    
    async def cleanup_stale_connections(self):
        """Clean up inactive connections"""
        current_time = datetime.utcnow()
        stale_connections = []
        
        for connection_id, session in self.active_connections.items():
            # Consider connections stale after 5 minutes of inactivity
            if (current_time - session.last_activity).seconds > 300:
                stale_connections.append(connection_id)
        
        for connection_id in stale_connections:
            await self.disconnect(connection_id)
        
        if stale_connections:
            logger.info("Cleaned up stale connections", count=len(stale_connections))

# Global WebSocket manager instance
websocket_manager = WebSocketManager()