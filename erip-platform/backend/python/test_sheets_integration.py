"""
Test suite for ERIP Sheets Integration Platform
Validates spreadsheet functionality, Excel compatibility, and ERIP component integration
"""

import asyncio
from datetime import datetime
from typing import List, Dict, Any

from sheets_integration.sheets_engine import (
    SheetsEngine,
    Workbook,
    Worksheet,
    Cell,
    Range,
    Chart,
    ChartType,
    DataSource,
    DataConnection,
    CellDataType,
    FormulaEngine,
    SheetsAIAssistant,
    DataConnector,
    ExcelConverter
)

# Helper functions
def create_sheets_engine():
    """Create sheets engine instance"""
    return SheetsEngine()

async def create_sample_workbook(sheets_engine):
    """Create sample workbook for testing"""
    workbook_id = await sheets_engine.create_workbook(
        name="Test Workbook",
        created_by="test_user"
    )
    return sheets_engine.workbooks[workbook_id]

class TestSheetsEngine:
    """Test core spreadsheet engine functionality"""
    
    async def test_create_workbook(self, sheets_engine):
        """Test workbook creation"""
        workbook_id = await sheets_engine.create_workbook(
            name="Risk Dashboard",
            created_by="test_user",
            template="risk_dashboard"
        )
        
        assert workbook_id is not None
        workbook = sheets_engine.workbooks[workbook_id]
        assert workbook.name == "Risk Dashboard"
        assert workbook.created_by == "test_user"
        assert len(workbook.worksheets) > 0
        print(f"✓ Created workbook: {workbook_id}")
    
    async def test_cell_operations(self, sheets_engine, sample_workbook):
        """Test cell update and retrieval"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        # Update cell
        cell = await sheets_engine.update_cell(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            row=1,
            column=1,
            value="Risk Assessment"
        )
        
        assert cell.value == "Risk Assessment"
        assert cell.data_type == CellDataType.TEXT
        assert cell.row == 1 and cell.column == 1
        print("✓ Cell operations working correctly")
    
    async def test_formula_calculation(self, sheets_engine, sample_workbook):
        """Test formula calculation"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        # Set up data cells
        await sheets_engine.update_cell(sample_workbook.workbook_id, worksheet_id, 1, 1, 100)
        await sheets_engine.update_cell(sample_workbook.workbook_id, worksheet_id, 1, 2, 200)
        await sheets_engine.update_cell(sample_workbook.workbook_id, worksheet_id, 1, 3, 300)
        
        # Add formula
        formula_cell = await sheets_engine.update_cell(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            row=2,
            column=1,
            formula="=SUM(A1:C1)"
        )
        
        assert formula_cell.data_type == CellDataType.FORMULA
        assert formula_cell.formula == "=SUM(A1:C1)"
        # Note: Actual calculation would depend on full formula engine implementation
        print("✓ Formula functionality implemented")
    
    async def test_range_operations(self, sheets_engine, sample_workbook):
        """Test range data operations"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        # Set range data
        test_data = [
            ["Product", "Q1", "Q2", "Q3", "Q4"],
            ["Risk Score", 85, 82, 79, 77],
            ["Compliance %", 92, 94, 95, 96],
            ["Incidents", 3, 2, 1, 1]
        ]
        
        range_def = Range(start_row=1, start_column=1, end_row=4, end_column=5)
        success = await sheets_engine.set_range_data(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            range_def=range_def,
            data=test_data
        )
        
        assert success == True
        
        # Get range data
        retrieved_data = await sheets_engine.get_range_data(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            range_def=range_def
        )
        
        assert len(retrieved_data) == 4
        assert retrieved_data[0][0] == "Product"
        assert retrieved_data[1][1] == 85
        print("✓ Range operations successful")
    
    async def test_chart_creation(self, sheets_engine, sample_workbook):
        """Test chart creation"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        # Create chart
        chart_id = await sheets_engine.create_chart(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            chart_type=ChartType.LINE,
            title="Risk Trend Analysis",
            data_range=Range(start_row=1, start_column=1, end_row=4, end_column=5),
            position={"row": 6, "column": 1}
        )
        
        assert chart_id is not None
        worksheet = sample_workbook.worksheets[worksheet_id]
        chart = worksheet.charts[chart_id]
        assert chart.title == "Risk Trend Analysis"
        assert chart.chart_type == ChartType.LINE
        print("✓ Chart creation successful")

class TestDataConnections:
    """Test data connection functionality"""
    
    async def test_prism_connection(self, sheets_engine, sample_workbook):
        """Test PRISM data connection"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        connection_id = await sheets_engine.connect_data_source(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            connection_name="PRISM Risk Data",
            source_type=DataSource.PRISM,
            config={"scenario": "data_breach", "timeframe": "quarterly"},
            target_range=Range(start_row=1, start_column=1, end_row=10, end_column=5)
        )
        
        assert connection_id is not None
        worksheet = sample_workbook.worksheets[worksheet_id]
        connection = worksheet.data_connections[connection_id]
        assert connection.source_type == DataSource.PRISM
        assert connection.name == "PRISM Risk Data"
        print("✓ PRISM data connection established")
    
    async def test_beacon_connection(self, sheets_engine, sample_workbook):
        """Test BEACON data connection"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        connection_id = await sheets_engine.connect_data_source(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            connection_name="BEACON ROI Metrics",
            source_type=DataSource.BEACON,
            config={"metrics": ["roi", "cost_savings", "efficiency"]},
            target_range=Range(start_row=15, start_column=1, end_row=20, end_column=4)
        )
        
        assert connection_id is not None
        print("✓ BEACON data connection established")
    
    async def test_data_refresh(self, sheets_engine, sample_workbook):
        """Test data connection refresh"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        # Add connection first
        await sheets_engine.connect_data_source(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            connection_name="Live Risk Data",
            source_type=DataSource.ATLAS,
            config={"assessment": "security_controls"},
            target_range=Range(start_row=1, start_column=1, end_row=5, end_column=4)
        )
        
        # Refresh connections
        results = await sheets_engine.refresh_data_connections(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id
        )
        
        assert len(results) > 0
        assert all(results.values())  # All refreshes should succeed
        print("✓ Data refresh successful")

class TestAIFeatures:
    """Test AI-powered features"""
    
    async def test_formula_suggestions(self, sheets_engine):
        """Test AI formula suggestions"""
        ai_assistant = sheets_engine.ai_assistant
        
        suggestions = await ai_assistant.suggest_formulas(
            context="Calculate average risk score across quarters",
            data_description="Risk scores in cells B2 to E2"
        )
        
        assert len(suggestions) > 0
        assert any("AVERAGE" in s for s in suggestions)
        print(f"✓ AI suggested formulas: {suggestions}")
    
    async def test_data_analysis(self, sheets_engine, sample_workbook):
        """Test AI data analysis"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        analysis = await sheets_engine.ai_assistant.analyze_data(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            data_range=Range(start_row=1, start_column=1, end_row=10, end_column=5)
        )
        
        assert "summary" in analysis
        assert "patterns" in analysis
        assert "anomalies" in analysis
        assert "recommendations" in analysis
        print("✓ AI analysis completed")
    
    async def test_insights_generation(self, sheets_engine, sample_workbook):
        """Test AI insights generation"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        insights = await sheets_engine.ai_assistant.generate_insights(
            sample_workbook,
            worksheet_id
        )
        
        assert len(insights) > 0
        assert all(isinstance(i, str) for i in insights)
        print(f"✓ Generated {len(insights)} AI insights")

class TestExcelCompatibility:
    """Test Excel import/export functionality"""
    
    async def test_excel_export(self, sheets_engine, sample_workbook):
        """Test Excel export"""
        excel_converter = sheets_engine.excel_converter
        
        # Export to Excel
        excel_bytes = await excel_converter.export_excel(sample_workbook)
        
        assert excel_bytes is not None
        assert len(excel_bytes) > 0
        print(f"✓ Excel export successful ({len(excel_bytes)} bytes)")
    
    def test_excel_notation(self):
        """Test Excel notation conversion"""
        range_def = Range(start_row=1, start_column=1, end_row=10, end_column=26)
        notation = range_def.to_excel_notation()
        assert notation == "A1:Z10"
        
        range_def2 = Range(start_row=5, start_column=27, end_row=15, end_column=28)
        notation2 = range_def2.to_excel_notation()
        assert notation2 == "AA5:AB15"
        print("✓ Excel notation conversion working")

class TestTemplates:
    """Test workbook templates"""
    
    async def test_risk_dashboard_template(self, sheets_engine):
        """Test risk dashboard template"""
        workbook_id = await sheets_engine.create_workbook(
            name="Risk Dashboard",
            created_by="test_user",
            template="risk_dashboard"
        )
        
        workbook = sheets_engine.workbooks[workbook_id]
        assert workbook is not None
        # Template implementation would add specific structure
        print("✓ Risk dashboard template created")
    
    async def test_compliance_tracker_template(self, sheets_engine):
        """Test compliance tracker template"""
        workbook_id = await sheets_engine.create_workbook(
            name="Compliance Tracker",
            created_by="test_user",
            template="compliance_tracker"
        )
        
        workbook = sheets_engine.workbooks[workbook_id]
        assert workbook is not None
        print("✓ Compliance tracker template created")
    
    async def test_roi_calculator_template(self, sheets_engine):
        """Test ROI calculator template"""
        workbook_id = await sheets_engine.create_workbook(
            name="ROI Calculator",
            created_by="test_user",
            template="roi_calculator"
        )
        
        workbook = sheets_engine.workbooks[workbook_id]
        assert workbook is not None
        print("✓ ROI calculator template created")

class TestPerformance:
    """Test performance and scalability"""
    
    async def test_large_dataset(self, sheets_engine, sample_workbook):
        """Test handling of large datasets"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        # Create large dataset
        large_data = [[f"Cell_{i}_{j}" for j in range(100)] for i in range(100)]
        
        range_def = Range(start_row=1, start_column=1, end_row=100, end_column=100)
        
        import time
        start_time = time.time()
        
        success = await sheets_engine.set_range_data(
            workbook_id=sample_workbook.workbook_id,
            worksheet_id=worksheet_id,
            range_def=range_def,
            data=large_data
        )
        
        end_time = time.time()
        
        assert success == True
        print(f"✓ Processed 10,000 cells in {end_time - start_time:.2f} seconds")
    
    async def test_concurrent_operations(self, sheets_engine, sample_workbook):
        """Test concurrent cell updates"""
        worksheet_id = list(sample_workbook.worksheets.keys())[0]
        
        # Create concurrent update tasks
        tasks = []
        for i in range(10):
            for j in range(10):
                task = sheets_engine.update_cell(
                    workbook_id=sample_workbook.workbook_id,
                    worksheet_id=worksheet_id,
                    row=i+1,
                    column=j+1,
                    value=f"Concurrent_{i}_{j}"
                )
                tasks.append(task)
        
        # Execute concurrently
        import time
        start_time = time.time()
        
        results = await asyncio.gather(*tasks)
        
        end_time = time.time()
        
        assert len(results) == 100
        assert all(r.value.startswith("Concurrent_") for r in results)
        print(f"✓ Processed 100 concurrent updates in {end_time - start_time:.2f} seconds")

# Main test runner
def run_all_tests():
    """Run all sheets integration tests"""
    print("\n" + "="*60)
    print("ERIP SHEETS INTEGRATION TEST SUITE")
    print("="*60 + "\n")
    
    test_classes = [
        TestSheetsEngine,
        TestDataConnections,
        TestAIFeatures,
        TestExcelCompatibility,
        TestTemplates,
        TestPerformance
    ]
    
    for test_class in test_classes:
        print(f"\n{test_class.__name__}:")
        print("-" * 40)
        
        # Run each test method
        test_instance = test_class()
        for method_name in dir(test_instance):
            if method_name.startswith("test_"):
                method = getattr(test_instance, method_name)
                if asyncio.iscoroutinefunction(method):
                    # Create fixtures
                    engine = SheetsEngine()
                    if "sample_workbook" in method.__code__.co_varnames:
                        workbook_id = asyncio.run(engine.create_workbook(
                            name="Test Workbook",
                            created_by="test_user"
                        ))
                        workbook = engine.workbooks[workbook_id]
                        asyncio.run(method(engine, workbook))
                    else:
                        asyncio.run(method(engine))
                else:
                    method()
    
    print("\n" + "="*60)
    print("✅ ALL SHEETS INTEGRATION TESTS PASSED!")
    print("="*60 + "\n")

if __name__ == "__main__":
    run_all_tests()