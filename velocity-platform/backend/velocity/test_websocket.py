#!/usr/bin/env python3
"""
Test WebSocket functionality for real-time updates
"""
import asyncio
import websockets
import json
from datetime import datetime

async def test_websocket_connection():
    """Test WebSocket connection and message broadcasting"""
    print("Testing WebSocket connection...")
    
    try:
        # Connect to WebSocket endpoint
        uri = "ws://localhost:8000/ws"
        async with websockets.connect(uri) as websocket:
            print("✓ WebSocket connection established")
            
            # Send ping message
            ping_message = {"type": "ping", "timestamp": datetime.utcnow().isoformat()}
            await websocket.send(json.dumps(ping_message))
            print("✓ Ping message sent")
            
            # Wait for response
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                response_data = json.loads(response)
                print(f"✓ Received response: {response_data}")
                
                if response_data.get("type") == "pong":
                    print("✓ Ping-pong test successful")
                elif response_data.get("type") == "connection_established":
                    print("✓ Connection establishment confirmed")
                    
                    # Send another ping after establishment
                    await websocket.send(json.dumps(ping_message))
                    pong_response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    pong_data = json.loads(pong_response)
                    if pong_data.get("type") == "pong":
                        print("✓ Follow-up ping-pong successful")
                
            except asyncio.TimeoutError:
                print("✗ No response received within timeout")
                
            # Keep connection alive for a bit to test
            print("Keeping connection alive for 10 seconds...")
            await asyncio.sleep(10)
            
    except ConnectionRefusedError:
        print("✗ WebSocket connection refused - server may not be running")
    except websockets.exceptions.InvalidStatusCode as e:
        print(f"✗ WebSocket connection failed with status: {e.status_code}")
    except Exception as e:
        print(f"✗ WebSocket connection error: {e}")

async def test_multiple_connections():
    """Test multiple WebSocket connections"""
    print("\nTesting multiple WebSocket connections...")
    
    connections = []
    try:
        # Create 3 concurrent connections
        for i in range(3):
            try:
                uri = "ws://localhost:8000/ws"
                websocket = await websockets.connect(uri)
                connections.append(websocket)
                print(f"✓ Connection {i+1} established")
                
                # Send identification message
                message = {
                    "type": "identify",
                    "data": {"connection_id": f"test-connection-{i+1}"}
                }
                await websocket.send(json.dumps(message))
                
            except Exception as e:
                print(f"✗ Failed to establish connection {i+1}: {e}")
        
        if connections:
            print(f"✓ {len(connections)} connections established")
            
            # Test broadcasting by sending messages
            for i, websocket in enumerate(connections):
                try:
                    ping_msg = {"type": "ping", "from": f"connection-{i+1}"}
                    await websocket.send(json.dumps(ping_msg))
                    
                    # Try to receive response
                    response = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                    print(f"✓ Connection {i+1} received: {json.loads(response)}")
                    
                except asyncio.TimeoutError:
                    print(f"✗ Connection {i+1} timed out")
                except Exception as e:
                    print(f"✗ Connection {i+1} error: {e}")
            
        # Clean up connections
        for websocket in connections:
            try:
                await websocket.close()
            except Exception:
                pass
                
    except Exception as e:
        print(f"✗ Multiple connections test failed: {e}")

async def simulate_agent_execution_websocket():
    """Simulate agent execution and check for WebSocket updates"""
    print("\nTesting agent execution WebSocket updates...")
    
    try:
        uri = "ws://localhost:8000/ws"
        async with websockets.connect(uri) as websocket:
            print("✓ WebSocket connected for agent execution test")
            
            # Listen for messages in background
            async def listen_for_messages():
                try:
                    while True:
                        message = await websocket.recv()
                        data = json.loads(message)
                        print(f"📡 WebSocket message received: {data}")
                        
                        if data.get("type") == "agent_started":
                            print("✓ Agent execution start notification received")
                        elif data.get("type") == "evidence_collected":
                            print("✓ Evidence collection notification received")
                        elif data.get("type") == "agent_completed":
                            print("✓ Agent completion notification received")
                            
                except websockets.exceptions.ConnectionClosed:
                    print("WebSocket connection closed")
                except Exception as e:
                    print(f"Error listening for messages: {e}")
            
            # Start listening task
            listen_task = asyncio.create_task(listen_for_messages())
            
            # Simulate triggering an agent execution via HTTP API
            import httpx
            try:
                async with httpx.AsyncClient() as client:
                    # Trigger agent execution
                    response = await client.post("http://localhost:8000/api/v1/agents/agent-1/run")
                    if response.status_code == 200:
                        print("✓ Agent execution triggered via API")
                    else:
                        print(f"✗ Agent execution failed: {response.status_code}")
                        
            except Exception as e:
                print(f"✗ Failed to trigger agent execution: {e}")
            
            # Wait for messages
            await asyncio.sleep(15)
            listen_task.cancel()
            
    except Exception as e:
        print(f"✗ Agent execution WebSocket test failed: {e}")

async def main():
    """Main test function"""
    print("WebSocket Functionality Test Suite")
    print("=" * 50)
    
    # Test 1: Basic WebSocket connection
    await test_websocket_connection()
    
    # Test 2: Multiple connections
    await test_multiple_connections()
    
    # Test 3: Agent execution notifications
    await simulate_agent_execution_websocket()
    
    print("\n" + "="*50)
    print("WebSocket test suite completed")

if __name__ == "__main__":
    asyncio.run(main())