/**
 * ERIP Collaborative Spreadsheet Component
 * Real-time multi-user spreadsheet with conflict resolution
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWebSocketClient, type WebSocketMessage, type UserSession, type CollaborationState } from './WebSocketClient';
import { UserPresenceIndicator } from './UserPresenceIndicator';
import { ConflictResolutionDialog } from './ConflictResolutionDialog';
// import { toast } from '@/components/ui/toast';

interface CellData {
  row: number;
  column: number;
  value: any;
  formula?: string;
  format?: any;
  locked?: boolean;
  editing_user?: string;
}

interface SpreadsheetData {
  cells: Record<string, CellData>;
  selectedCell?: { row: number; column: number };
  selectedRange?: { start_row: number; start_column: number; end_row: number; end_column: number };
}

interface CollaborativeSpreadsheetProps {
  workbookId: string;
  worksheetId: string;
  userId: string;
  userEmail: string;
  initialData?: SpreadsheetData;
  readOnly?: boolean;
  onDataChange?: (data: SpreadsheetData) => void;
}

export const CollaborativeSpreadsheet: React.FC<CollaborativeSpreadsheetProps> = ({
  workbookId,
  worksheetId,
  userId,
  userEmail,
  initialData,
  readOnly = false,
  onDataChange
}) => {
  // State management
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>(
    initialData || { cells: {} }
  );
  const [activeUsers, setActiveUsers] = useState<UserSession[]>([]);
  const [userCursors, setUserCursors] = useState<Record<string, any>>({});
  const [userSelections, setUserSelections] = useState<Record<string, any>>({});
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [editingCell, setEditingCell] = useState<{ row: number; column: number } | null>(null);
  const [cellValue, setCellValue] = useState<string>('');
  const [conflictResolution, setConflictResolution] = useState<any>(null);
  
  const tableRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // WebSocket handlers
  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log('Received WebSocket message:', message);
  }, []);

  const handleUserJoin = useCallback((user: UserSession) => {
    setActiveUsers(prev => [...prev.filter(u => u.user_id !== user.user_id), user]);
  }, []);

  const handleUserLeave = useCallback((userId: string) => {
    setActiveUsers(prev => prev.filter(u => u.user_id !== userId));
    setUserCursors(prev => {
      const newCursors = { ...prev };
      delete newCursors[userId];
      return newCursors;
    });
    setUserSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[userId];
      return newSelections;
    });
  }, []);

  const handleCellUpdate = useCallback((update: any) => {
    const cellKey = `€{update.row},€{update.column}`;
    setSpreadsheetData(prev => {
      const newData = {
        ...prev,
        cells: {
          ...prev.cells,
          [cellKey]: {
            row: update.row,
            column: update.column,
            value: update.value,
            formula: update.formula,
            editing_user: update.user_id !== userId ? update.user_id : undefined
          }
        }
      };
      
      if (onDataChange) {
        onDataChange(newData);
      }
      
      return newData;
    });
  }, [userId, onDataChange]);

  const handleRangeUpdate = useCallback((update: any) => {
    setSpreadsheetData(prev => {
      const newCells = { ...prev.cells };
      
      update.data.forEach((rowData: any[], rowIndex: number) => {
        rowData.forEach((value: any, colIndex: number) => {
          const row = update.range.start_row + rowIndex;
          const column = update.range.start_column + colIndex;
          const cellKey = `€{row},€{column}`;
          
          newCells[cellKey] = {
            row,
            column,
            value,
            editing_user: update.user_id !== userId ? update.user_id : undefined
          };
        });
      });
      
      const newData = { ...prev, cells: newCells };
      
      if (onDataChange) {
        onDataChange(newData);
      }
      
      return newData;
    });
  }, [userId, onDataChange]);

  const handleCursorMove = useCallback((cursor: any) => {
    if (cursor.user_id !== userId) {
      setUserCursors(prev => ({
        ...prev,
        [cursor.user_id]: cursor
      }));
    }
  }, [userId]);

  const handleSelectionChange = useCallback((selection: any) => {
    if (selection.user_id !== userId) {
      setUserSelections(prev => ({
        ...prev,
        [selection.user_id]: selection
      }));
    }
  }, [userId]);

  const handleSyncData = useCallback((state: CollaborationState) => {
    setActiveUsers(state.active_users);
    setUserCursors(state.user_cursors);
    setUserSelections(state.user_selections);
  }, []);

  // Initialize WebSocket client
  const wsClient = useWebSocketClient({
    workbookId,
    worksheetId,
    userId,
    userEmail,
    onMessage: handleMessage,
    onUserJoin: handleUserJoin,
    onUserLeave: handleUserLeave,
    onCellUpdate: handleCellUpdate,
    onRangeUpdate: handleRangeUpdate,
    onCursorMove: handleCursorMove,
    onSelectionChange: handleSelectionChange,
    onSyncData: handleSyncData,
    onConnectionStatus: setConnectionStatus
  });

  // Spreadsheet interaction handlers
  const handleCellClick = useCallback((row: number, column: number) => {
    if (readOnly) return;
    
    const cellKey = `€{row},€{column}`;
    const cell = spreadsheetData.cells[cellKey];
    
    setSpreadsheetData(prev => ({
      ...prev,
      selectedCell: { row, column }
    }));
    
    // Send cursor position to other users
    wsClient.sendCursorPosition(row, column);
  }, [readOnly, spreadsheetData.cells, wsClient]);

  const handleCellDoubleClick = useCallback((row: number, column: number) => {
    if (readOnly) return;
    
    const cellKey = `€{row},€{column}`;
    const cell = spreadsheetData.cells[cellKey];
    
    setEditingCell({ row, column });
    setCellValue(cell?.formula || cell?.value?.toString() || '');
    
    // Focus the input after render
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  }, [readOnly, spreadsheetData.cells]);

  const handleCellEdit = useCallback((value: string) => {
    if (!editingCell) return;
    
    const { row, column } = editingCell;
    
    // Determine if it's a formula
    const isFormula = value.startsWith('=');
    
    // Update local state immediately for responsiveness
    const cellKey = `€{row},€{column}`;
    setSpreadsheetData(prev => ({
      ...prev,
      cells: {
        ...prev.cells,
        [cellKey]: {
          row,
          column,
          value: isFormula ? value : value, // Will be calculated by backend for formulas
          formula: isFormula ? value : undefined
        }
      }
    }));
    
    // Send update to other users via WebSocket
    wsClient.sendCellUpdate(row, column, value, isFormula ? value : undefined);
    
    setEditingCell(null);
    setCellValue('');
  }, [editingCell, wsClient]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (editingCell) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCellEdit(cellValue);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setEditingCell(null);
        setCellValue('');
      }
      return;
    }

    const selected = spreadsheetData.selectedCell;
    if (!selected) return;

    let newRow = selected.row;
    let newColumn = selected.column;

    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.max(0, selected.row - 1);
        break;
      case 'ArrowDown':
        newRow = selected.row + 1;
        break;
      case 'ArrowLeft':
        newColumn = Math.max(0, selected.column - 1);
        break;
      case 'ArrowRight':
        newColumn = selected.column + 1;
        break;
      case 'Enter':
        if (!readOnly) {
          handleCellDoubleClick(selected.row, selected.column);
        }
        return;
      case 'F2':
        if (!readOnly) {
          handleCellDoubleClick(selected.row, selected.column);
        }
        return;
      default:
        if (!readOnly && e.key.length === 1) {
          handleCellDoubleClick(selected.row, selected.column);
          setCellValue(e.key);
        }
        return;
    }

    handleCellClick(newRow, newColumn);
  }, [editingCell, cellValue, spreadsheetData.selectedCell, handleCellEdit, handleCellClick, handleCellDoubleClick, readOnly]);

  // Utility functions
  const getColumnHeader = (column: number): string => {
    let result = '';
    while (column >= 0) {
      result = String.fromCharCode(65 + (column % 26)) + result;
      column = Math.floor(column / 26) - 1;
    }
    return result;
  };

  const getCellKey = (row: number, column: number): string => `€{row},€{column}`;
  
  const getCellValue = (row: number, column: number): string => {
    const cell = spreadsheetData.cells[getCellKey(row, column)];
    return cell?.value?.toString() || '';
  };

  const getUserColor = (userId: string): string => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const index = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // Render grid
  const renderGrid = () => {
    const rows = 20; // Show 20 rows for demo
    const cols = 10; // Show 10 columns for demo
    
    const gridRows = [];
    
    // Header row with column letters
    const headerRow = (
      <div key="header" className="flex border-b">
        <div className="w-12 h-8 border-r bg-gray-50 flex items-center justify-center text-xs font-medium">
          
        </div>
        {Array.from({ length: cols }, (_, col) => (
          <div key={col} className="w-20 h-8 border-r bg-gray-50 flex items-center justify-center text-xs font-medium">
            {getColumnHeader(col)}
          </div>
        ))}
      </div>
    );
    gridRows.push(headerRow);
    
    // Data rows
    for (let row = 0; row < rows; row++) {
      const cells = [];
      
      // Row number
      cells.push(
        <div key="row-header" className="w-12 h-8 border-r bg-gray-50 flex items-center justify-center text-xs font-medium">
          {row + 1}
        </div>
      );
      
      // Data cells
      for (let col = 0; col < cols; col++) {
        const cellKey = getCellKey(row, col);
        const cell = spreadsheetData.cells[cellKey];
        const isSelected = spreadsheetData.selectedCell?.row === row && spreadsheetData.selectedCell?.column === col;
        const isEditing = editingCell?.row === row && editingCell?.column === col;
        
        // Check if another user is editing this cell
        const editingUser = activeUsers.find(user => user.user_id === cell?.editing_user);
        
        // Check if another user has cursor here
        const cursorUser = Object.values(userCursors).find((cursor: any) => 
          cursor.row === row && cursor.column === col
        );
        
        cells.push(
          <div
            key={col}
            className={`
              w-20 h-8 border-r border-b relative cursor-cell
              €{isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'}
              €{editingUser ? 'bg-yellow-100 border-yellow-300' : ''}
              €{cursorUser ? 'ring-1 ring-green-400' : ''}
            `}
            onClick={() => handleCellClick(row, col)}
            onDoubleClick={() => handleCellDoubleClick(row, col)}
          >
            {isEditing ? (
              <input
                ref={editInputRef}
                type="text"
                value={cellValue}
                onChange={(e) => setCellValue(e.target.value)}
                onBlur={() => handleCellEdit(cellValue)}
                onKeyDown={handleKeyDown}
                className="w-full h-full px-1 text-xs border-none outline-none bg-transparent"
              />
            ) : (
              <div className="w-full h-full px-1 flex items-center text-xs truncate">
                {getCellValue(row, col)}
              </div>
            )}
            
            {/* User presence indicators */}
            {editingUser && (
              <div 
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white text-xs flex items-center justify-center"
                style={{ backgroundColor: getUserColor(editingUser.user_id) }}
                title={`€{editingUser.email} is editing`}
              />
            )}
            
            {cursorUser && !editingUser && (
              <div 
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: getUserColor((cursorUser as any).user_id) }}
                title={`€{(cursorUser as any).email}'s cursor`}
              />
            )}
          </div>
        );
      }
      
      gridRows.push(
        <div key={row} className="flex">
          {cells}
        </div>
      );
    }
    
    return gridRows;
  };

  return (
    <div className="collaborative-spreadsheet w-full h-full flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Header with collaboration info */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Collaborative Spreadsheet</h3>
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
            {connectionStatus}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <UserPresenceIndicator users={activeUsers} currentUserId={userId} />
        </div>
      </div>
      
      {/* Spreadsheet grid */}
      <div className="flex-1 overflow-auto">
        <div ref={tableRef} className="inline-block min-w-full">
          {renderGrid()}
        </div>
      </div>
      
      {/* Formula bar */}
      {spreadsheetData.selectedCell && (
        <div className="border-t p-2 bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {getColumnHeader(spreadsheetData.selectedCell.column)}{spreadsheetData.selectedCell.row + 1}:
            </span>
            <span className="text-sm">
              {spreadsheetData.cells[getCellKey(spreadsheetData.selectedCell.row, spreadsheetData.selectedCell.column)]?.formula || 
               getCellValue(spreadsheetData.selectedCell.row, spreadsheetData.selectedCell.column)}
            </span>
          </div>
        </div>
      )}
      
      {/* Conflict resolution dialog */}
      {conflictResolution && (
        <ConflictResolutionDialog
          conflict={conflictResolution}
          onResolve={(resolution) => {
            // Handle conflict resolution
            setConflictResolution(null);
          }}
          onClose={() => setConflictResolution(null)}
        />
      )}
    </div>
  );
};