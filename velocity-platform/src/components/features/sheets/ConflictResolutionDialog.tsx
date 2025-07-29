/**
 * Conflict Resolution Dialog for Collaborative Sheets
 * Handles editing conflicts between multiple users
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConflictEdit {
  user_id: string;
  user_email?: string;
  value: any;
  formula?: string;
  timestamp: string;
}

interface ConflictResolution {
  cell_row: number;
  cell_column: number;
  user_edits: ConflictEdit[];
  resolved_value?: any;
  resolution_strategy: string;
  timestamp: string;
}

interface ConflictResolutionDialogProps {
  conflict: ConflictResolution;
  onResolve: (resolution: { value: any; strategy: string }) => void;
  onClose: () => void;
}

export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  conflict,
  onResolve,
  onClose
}) => {
  const [selectedEdit, setSelectedEdit] = useState<ConflictEdit | null>(null);
  const [customValue, setCustomValue] = useState<string>('');
  const [resolutionStrategy, setResolutionStrategy] = useState<string>('user_choice');

  const getColumnHeader = (column: number): string => {
    let result = '';
    while (column >= 0) {
      result = String.fromCharCode(65 + (column % 26)) + result;
      column = Math.floor(column / 26) - 1;
    }
    return result;
  };

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getUserColor = (userId: string): string => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const index = Array.from(userId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const handleResolve = (strategy: string, value?: any) => {
    let resolvedValue = value;
    
    switch (strategy) {
      case 'last_write_wins':
        const sortedEdits = [...conflict.user_edits].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        resolvedValue = sortedEdits[0]?.value;
        break;
        
      case 'first_write_wins':
        const firstEdit = [...conflict.user_edits].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )[0];
        resolvedValue = firstEdit?.value;
        break;
        
      case 'user_choice':
        resolvedValue = selectedEdit?.value || customValue;
        break;
        
      case 'custom_value':
        resolvedValue = customValue;
        break;
        
      case 'merge':
        // Simple merge strategy - concatenate values
        resolvedValue = conflict.user_edits.map(edit => edit.value).join(' | ');
        break;
    }

    onResolve({
      value: resolvedValue,
      strategy
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            Editing Conflict Detected
          </CardTitle>
          <p className="text-sm text-gray-600">
            Multiple users edited cell {getColumnHeader(conflict.cell_column)}{conflict.cell_row + 1} 
            at the same time. Please choose how to resolve this conflict.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Conflicting Edits */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Conflicting Edits:</h3>
            <div className="space-y-2">
              {conflict.user_edits.map((edit, index) => (
                <div
                  key={`${edit.user_id}-${index}`}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedEdit === edit
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedEdit(edit);
                    setResolutionStrategy('user_choice');
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getUserColor(edit.user_id) }}
                      />
                      <span className="text-sm font-medium">
                        {edit.user_email || edit.user_id}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {formatTime(edit.timestamp)}
                      </Badge>
                    </div>
                    {selectedEdit === edit && (
                      <Badge variant="default" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Value:</span>{' '}
                      <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm">
                        {edit.value}
                      </span>
                    </div>
                    {edit.formula && (
                      <div className="text-sm mt-1">
                        <span className="text-gray-600">Formula:</span>{' '}
                        <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm">
                          {edit.formula}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Strategies */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Resolution Strategy:</h3>
            <div className="space-y-2">
              {/* Auto Strategies */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={resolutionStrategy === 'last_write_wins' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setResolutionStrategy('last_write_wins')}
                >
                  Last Edit Wins
                </Button>
                <Button
                  variant={resolutionStrategy === 'first_write_wins' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setResolutionStrategy('first_write_wins')}
                >
                  First Edit Wins
                </Button>
                <Button
                  variant={resolutionStrategy === 'merge' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setResolutionStrategy('merge')}
                >
                  Merge Values
                </Button>
              </div>

              {/* Custom Value */}
              <div className="space-y-2">
                <Button
                  variant={resolutionStrategy === 'custom_value' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setResolutionStrategy('custom_value')}
                  className="w-full"
                >
                  Use Custom Value
                </Button>
                {resolutionStrategy === 'custom_value' && (
                  <input
                    type="text"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="Enter custom value..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Preview:</h4>
            <div className="text-sm">
              Cell {getColumnHeader(conflict.cell_column)}{conflict.cell_row + 1} will be set to:{' '}
              <span className="font-mono bg-white px-1 py-0.5 rounded">
                {resolutionStrategy === 'last_write_wins' && 
                  [...conflict.user_edits].sort((a, b) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                  )[0]?.value
                }
                {resolutionStrategy === 'first_write_wins' && 
                  [...conflict.user_edits].sort((a, b) => 
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                  )[0]?.value
                }
                {resolutionStrategy === 'user_choice' && selectedEdit?.value}
                {resolutionStrategy === 'custom_value' && customValue}
                {resolutionStrategy === 'merge' && 
                  conflict.user_edits.map(edit => edit.value).join(' | ')
                }
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => handleResolve(resolutionStrategy)}
              disabled={
                resolutionStrategy === 'user_choice' && !selectedEdit ||
                resolutionStrategy === 'custom_value' && !customValue.trim()
              }
            >
              Apply Resolution
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};