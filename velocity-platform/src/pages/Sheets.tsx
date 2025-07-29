/**
 * ERIP Sheets Page
 * Collaborative spreadsheet workspace with real-time editing
 */

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CollaborativeSpreadsheet } from '@/components/features/sheets';

const Sheets: React.FC = () => {
  // Mock data - in real app this would come from props/context
  const workbookId = "wb_demo_001";
  const worksheetId = "ws_demo_001";
  const userId = "user_123";
  const userEmail = "demo@example.com";

  const [selectedWorkbook, setSelectedWorkbook] = useState<string | null>(workbookId);

  // Mock workbooks list
  const workbooks = [
    {
      id: "wb_demo_001",
      name: "Risk Dashboard Q4 2025",
      description: "Executive risk metrics with PRISM integration",
      template: "risk_dashboard",
      created_at: "2025-01-15T10:00:00Z",
      collaborators: 3,
      status: "active"
    },
    {
      id: "wb_demo_002", 
      name: "Compliance Tracker 2025",
      description: "Framework compliance tracking with COMPASS data",
      template: "compliance_tracker",
      created_at: "2025-01-10T14:30:00Z",
      collaborators: 2,
      status: "active"
    },
    {
      id: "wb_demo_003",
      name: "ROI Analysis - Security Investments",
      description: "Security investment ROI analysis with BEACON data",
      template: "roi_calculator",
      created_at: "2025-01-08T09:15:00Z",
      collaborators: 5,
      status: "active"
    }
  ];

  if (!selectedWorkbook) {
    return (
      <Layout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sheets</h1>
              <p className="text-gray-600">Collaborative spreadsheets with real-time editing and AI insights</p>
            </div>
            <Button>
              New Workbook
            </Button>
          </div>

          {/* Workbooks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workbooks.map((workbook) => (
              <Card key={workbook.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{workbook.name}</CardTitle>
                    <Badge variant={workbook.status === 'active' ? 'default' : 'secondary'}>
                      {workbook.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{workbook.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{workbook.collaborators} users</span>
                      <span>•</span>
                      <span>{new Date(workbook.created_at).toLocaleDateString()}</span>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedWorkbook(workbook.id)}
                    >
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">🤝</span>
                </div>
                <h3 className="font-semibold mb-2">Real-time Collaboration</h3>
                <p className="text-sm text-gray-600">Multiple users can edit simultaneously with conflict resolution</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">📊</span>
                </div>
                <h3 className="font-semibold mb-2">Live Data Connections</h3>
                <p className="text-sm text-gray-600">Connect to PRISM, BEACON, ATLAS, and COMPASS data</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 text-xl">🤖</span>
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-600">Formula assistance and data insights with Claude AI</p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 text-xl">📈</span>
                </div>
                <h3 className="font-semibold mb-2">Advanced Charts</h3>
                <p className="text-sm text-gray-600">Interactive visualizations and executive dashboards</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const currentWorkbook = workbooks.find(wb => wb.id === selectedWorkbook);

  return (
    <Layout>
      <div className="h-screen flex flex-col">
        {/* Workbook Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedWorkbook(null)}>
              ← Back to Workbooks
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{currentWorkbook?.name}</h1>
              <p className="text-sm text-gray-600">{currentWorkbook?.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">WebSocket: Priority 7</Badge>
            <Button variant="outline" size="sm">
              Share
            </Button>
            <Button size="sm">
              Export
            </Button>
          </div>
        </div>

        {/* Collaborative Spreadsheet */}
        <div className="flex-1">
          <CollaborativeSpreadsheet
            workbookId={workbookId}
            worksheetId={worksheetId}
            userId={userId}
            userEmail={userEmail}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Sheets;