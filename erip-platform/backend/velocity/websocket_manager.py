"""
Velocity AI Platform - WebSocket Manager
Real-time communication for live updates and notifications
"""
import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional, Set
import uuid
from dataclasses import dataclass, asdict

from fastapi import WebSocket
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

@dataclass
class WebSocketConnection:
    id: str
    websocket: WebSocket
    organization_id: str
    user_id: Optional[str] = None
    connected_at: datetime = None
    last_ping: datetime = None
    
    def __post_init__(self):
        if self.connected_at is None:
            self.connected_at = datetime.now(timezone.utc)
        if self.last_ping is None:
            self.last_ping = datetime.now(timezone.utc)

@dataclass
class WebSocketMessage:
    type: str
    data: Dict[str, Any]
    timestamp: str = None
    id: str = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now(timezone.utc).isoformat()
        if self.id is None:
            self.id = str(uuid.uuid4())

class WebSocketManager:
    """Manages WebSocket connections and real-time messaging"""
    
    def __init__(self):
        self.connections: Dict[str, WebSocketConnection] = {}
        self.organization_connections: Dict[str, Set[str]] = {}
        self.heartbeat_task: Optional[asyncio.Task] = None
        self._shutdown = False
    
    async def add_connection(
        self, 
        websocket: WebSocket, 
        organization_id: str, 
        user_id: Optional[str] = None
    ) -> str:
        """Add a new WebSocket connection"""
        connection_id = str(uuid.uuid4())
        
        connection = WebSocketConnection(
            id=connection_id,
            websocket=websocket,
            organization_id=organization_id,
            user_id=user_id
        )
        
        self.connections[connection_id] = connection
        
        # Add to organization group
        if organization_id not in self.organization_connections:
            self.organization_connections[organization_id] = set()
        self.organization_connections[organization_id].add(connection_id)
        
        logger.info(f"WebSocket connection added: {connection_id} for org {organization_id}")
        
        # Send connection confirmation
        await self.send_to_connection(connection_id, {
            "type": "connection_established",
            "data": {
                "connection_id": connection_id,
                "organization_id": organization_id,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        })
        
        return connection_id
    
    async def remove_connection(self, connection_id: str):
        """Remove a WebSocket connection"""
        if connection_id not in self.connections:
            return
        
        connection = self.connections[connection_id]
        organization_id = connection.organization_id
        
        # Remove from connections
        del self.connections[connection_id]
        
        # Remove from organization group
        if organization_id in self.organization_connections:
            self.organization_connections[organization_id].discard(connection_id)
            if not self.organization_connections[organization_id]:
                del self.organization_connections[organization_id]
        
        logger.info(f"WebSocket connection removed: {connection_id}")
    
    async def send_to_connection(self, connection_id: str, message: Dict[str, Any]):
        """Send message to a specific connection"""
        if connection_id not in self.connections:
            logger.warning(f"Connection {connection_id} not found")
            return
        
        connection = self.connections[connection_id]
        
        try:
            # Create message with metadata
            ws_message = WebSocketMessage(
                type=message.get("type", "message"),
                data=message.get("data", message)
            )
            
            await connection.websocket.send_text(json.dumps(asdict(ws_message)))
            
        except Exception as e:
            logger.error(f"Error sending message to connection {connection_id}: {e}")
            # Remove broken connection
            await self.remove_connection(connection_id)
    
    async def broadcast_to_organization(self, organization_id: str, message: Dict[str, Any]):
        """Broadcast message to all connections in an organization"""
        if organization_id not in self.organization_connections:
            return
        
        connection_ids = list(self.organization_connections[organization_id])
        
        # Send to all connections in parallel
        tasks = []
        for connection_id in connection_ids:
            task = asyncio.create_task(
                self.send_to_connection(connection_id, message)
            )
            tasks.append(task)
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
        
        logger.debug(f"Broadcasted message to {len(connection_ids)} connections in org {organization_id}")
    
    async def broadcast_to_all(self, message: Dict[str, Any]):
        """Broadcast message to all connections"""
        connection_ids = list(self.connections.keys())
        
        tasks = []
        for connection_id in connection_ids:
            task = asyncio.create_task(
                self.send_to_connection(connection_id, message)
            )
            tasks.append(task)
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
        
        logger.debug(f"Broadcasted message to {len(connection_ids)} connections")
    
    async def send_agent_status_update(self, organization_id: str, agent_data: Dict[str, Any]):
        """Send agent status update to organization"""
        message = {
            "type": "agent_status_update",
            "data": {
                "agent_id": agent_data.get("id"),
                "name": agent_data.get("name"),
                "status": agent_data.get("status"),
                "evidence_collected": agent_data.get("evidence_collected", 0),
                "last_run": agent_data.get("last_run"),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
        
        await self.broadcast_to_organization(organization_id, message)
    
    async def send_evidence_collected(self, organization_id: str, evidence_data: Dict[str, Any]):
        """Send evidence collection notification"""
        message = {
            "type": "evidence_collected",
            "data": {
                "evidence_id": evidence_data.get("id"),
                "title": evidence_data.get("title"),
                "type": evidence_data.get("evidence_type"),
                "framework": evidence_data.get("framework"),
                "control_id": evidence_data.get("control_id"),
                "trust_points": evidence_data.get("trust_points", 0),
                "agent_name": evidence_data.get("agent_name"),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
        
        await self.broadcast_to_organization(organization_id, message)
    
    async def send_trust_score_update(self, organization_id: str, score_data: Dict[str, Any]):
        """Send trust score update"""
        message = {
            "type": "trust_score_update",
            "data": {
                "total_score": score_data.get("total_score", 0),
                "score_change": score_data.get("score_change", 0),
                "evidence_count": score_data.get("evidence_count", 0),
                "automation_rate": score_data.get("automation_rate", 0.0),
                "framework_scores": score_data.get("framework_scores", {}),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
        
        await self.broadcast_to_organization(organization_id, message)
    
    async def send_integration_status(self, organization_id: str, integration_data: Dict[str, Any]):
        """Send integration status update"""
        message = {
            "type": "integration_status",
            "data": {
                "integration_id": integration_data.get("id"),
                "name": integration_data.get("name"),
                "platform": integration_data.get("platform"),
                "status": integration_data.get("status"),
                "last_sync": integration_data.get("last_sync"),
                "error_count": integration_data.get("error_count", 0),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
        
        await self.broadcast_to_organization(organization_id, message)
    
    async def send_system_notification(self, organization_id: str, notification: Dict[str, Any]):
        """Send system notification"""
        message = {
            "type": "system_notification",
            "data": {
                "level": notification.get("level", "info"),  # info, warning, error, success
                "title": notification.get("title", ""),
                "message": notification.get("message", ""),
                "action_url": notification.get("action_url"),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }
        }
        
        await self.broadcast_to_organization(organization_id, message)
    
    async def start_heartbeat(self):
        """Start heartbeat task to keep connections alive"""
        logger.info("Starting WebSocket heartbeat...")
        self.heartbeat_task = asyncio.create_task(self._heartbeat_loop())
    
    async def stop_heartbeat(self):
        """Stop heartbeat task"""
        logger.info("Stopping WebSocket heartbeat...")
        self._shutdown = True
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
            try:
                await self.heartbeat_task
            except asyncio.CancelledError:
                pass
    
    async def _heartbeat_loop(self):
        """Main heartbeat loop"""
        while not self._shutdown:
            try:
                await self._send_heartbeat()
                await self._cleanup_stale_connections()
                await asyncio.sleep(30)  # Send heartbeat every 30 seconds
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Heartbeat error: {e}")
                await asyncio.sleep(30)
    
    async def _send_heartbeat(self):
        """Send heartbeat to all connections"""
        if not self.connections:
            return
        
        heartbeat_message = {
            "type": "heartbeat",
            "data": {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "active_connections": len(self.connections)
            }
        }
        
        # Send heartbeat to all connections
        tasks = []
        for connection_id in list(self.connections.keys()):
            task = asyncio.create_task(
                self.send_to_connection(connection_id, heartbeat_message)
            )
            tasks.append(task)
        
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
    
    async def _cleanup_stale_connections(self):
        """Remove stale connections that haven't responded to heartbeat"""
        current_time = datetime.now(timezone.utc)
        stale_connections = []
        
        for connection_id, connection in self.connections.items():
            # Consider connection stale if no ping in last 2 minutes
            if (current_time - connection.last_ping).total_seconds() > 120:
                stale_connections.append(connection_id)
        
        for connection_id in stale_connections:
            logger.info(f"Removing stale connection: {connection_id}")
            await self.remove_connection(connection_id)
    
    def get_connection_stats(self) -> Dict[str, Any]:
        """Get connection statistics"""
        stats = {
            "total_connections": len(self.connections),
            "organizations": len(self.organization_connections),
            "connections_by_org": {
                org_id: len(conn_ids) 
                for org_id, conn_ids in self.organization_connections.items()
            },
            "oldest_connection": None,
            "newest_connection": None
        }
        
        if self.connections:
            connections_by_time = sorted(
                self.connections.values(), 
                key=lambda c: c.connected_at
            )
            stats["oldest_connection"] = connections_by_time[0].connected_at.isoformat()
            stats["newest_connection"] = connections_by_time[-1].connected_at.isoformat()
        
        return stats

# Global WebSocket manager instance
websocket_manager = WebSocketManager()