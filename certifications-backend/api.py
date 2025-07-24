#!/usr/bin/env python3
"""
Flask API for Certification Management
Provides RESTful endpoints for certification assessments and automation
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from certification_manager import (
    CertificationManager, 
    create_certification_assessment,
    update_control_assessment
)
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize certification manager
manager = CertificationManager()


@app.route('/api/certifications', methods=['GET'])
def get_certifications():
    """Get available certification frameworks"""
    frameworks = []
    for cert_id, framework in manager.frameworks.items():
        frameworks.append({
            'id': cert_id,
            'name': framework['name'],
            'fullName': framework['full_name'],
            'industry': framework['industry'],
            'version': framework['version'],
            'domainCount': len(framework['domains']),
            'controlCount': sum(len(d['controls']) for d in framework['domains'].values())
        })
    return jsonify({'certifications': frameworks})


@app.route('/api/certifications/<cert_type>', methods=['GET'])
def get_certification_details(cert_type):
    """Get detailed information about a specific certification"""
    framework = manager.frameworks.get(cert_type)
    if not framework:
        return jsonify({'error': 'Certification not found'}), 404
    
    # Convert framework to JSON-serializable format
    details = {
        'id': cert_type,
        'name': framework['name'],
        'fullName': framework['full_name'],
        'industry': framework['industry'],
        'version': framework['version'],
        'domains': []
    }
    
    for domain_key, domain in framework['domains'].items():
        domain_data = {
            'id': domain_key,
            'name': domain['name'],
            'weight': domain['weight'],
            'controls': []
        }
        
        for control in domain['controls']:
            domain_data['controls'].append({
                'id': control.id,
                'name': control.name,
                'description': control.description,
                'category': control.category,
                'requirementLevel': control.requirement_level,
                'status': control.status.value,
                'evidenceRequired': control.evidence_required,
                'automationAvailable': control.automation_available,
                'trustImpact': control.trust_impact
            })
        
        details['domains'].append(domain_data)
    
    return jsonify(details)


@app.route('/api/assessments', methods=['POST'])
def create_assessment():
    """Create a new certification assessment"""
    data = request.get_json()
    
    if not all(k in data for k in ['orgName', 'industry', 'certificationType']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    result = create_certification_assessment(
        org_name=data['orgName'],
        industry=data['industry'],
        certification_type=data['certificationType']
    )
    
    return jsonify(result)


@app.route('/api/assessments/<int:cert_id>/gap-analysis', methods=['GET'])
def get_gap_analysis(cert_id):
    """Get gap analysis for a certification"""
    cursor = manager.conn.cursor()
    
    # Get certification type
    cursor.execute('''
        SELECT c.certification_type, c.org_id 
        FROM certifications c 
        WHERE c.id = ?
    ''', (cert_id,))
    
    result = cursor.fetchone()
    if not result:
        return jsonify({'error': 'Certification not found'}), 404
    
    cert_type, org_id = result
    gap_analysis = manager.generate_gap_analysis(org_id, cert_type)
    
    return jsonify(gap_analysis)


@app.route('/api/assessments/<int:cert_id>/roadmap', methods=['GET'])
def get_roadmap(cert_id):
    """Get implementation roadmap for a certification"""
    target_date = request.args.get('targetDate')
    if not target_date:
        target_date = (datetime.now() + timedelta(days=180)).strftime("%Y-%m-%d")
    
    cursor = manager.conn.cursor()
    
    # Get certification info
    cursor.execute('''
        SELECT c.certification_type, c.org_id 
        FROM certifications c 
        WHERE c.id = ?
    ''', (cert_id,))
    
    result = cursor.fetchone()
    if not result:
        return jsonify({'error': 'Certification not found'}), 404
    
    cert_type, org_id = result
    roadmap = manager.create_certification_roadmap(org_id, cert_type, target_date)
    
    return jsonify(roadmap)


@app.route('/api/assessments/<int:cert_id>/controls/<control_id>', methods=['PUT'])
def update_control(cert_id, control_id):
    """Update control assessment status"""
    data = request.get_json()
    
    result = update_control_assessment(
        cert_id=cert_id,
        control_id=control_id,
        status=data.get('status'),
        evidence_path=data.get('evidencePath'),
        notes=data.get('notes')
    )
    
    return jsonify(result)


@app.route('/api/assessments/<int:cert_id>/trust-score', methods=['GET'])
def get_trust_score(cert_id):
    """Calculate current Trust Equity score for certification"""
    cursor = manager.conn.cursor()
    
    # Get certification type
    cursor.execute('SELECT certification_type FROM certifications WHERE id = ?', (cert_id,))
    cert_type = cursor.fetchone()
    if not cert_type:
        return jsonify({'error': 'Certification not found'}), 404
    
    cert_type = cert_type[0]
    
    # Get all control assessments
    cursor.execute('SELECT * FROM control_assessments WHERE cert_id = ?', (cert_id,))
    assessments = [
        {
            "control_id": row[2],
            "status": row[3],
            "automation_used": bool(row[8])
        }
        for row in cursor.fetchall()
    ]
    
    trust_score = manager.calculate_trust_equity_score(cert_type, assessments)
    
    # Get compliance score
    framework = manager.frameworks.get(cert_type)
    total_controls = sum(len(d['controls']) for d in framework['domains'].values())
    implemented_controls = sum(1 for a in assessments if a['status'] in ['fully_implemented', 'not_applicable'])
    compliance_score = (implemented_controls / total_controls * 100) if total_controls > 0 else 0
    
    return jsonify({
        'certificationId': cert_id,
        'certificationType': cert_type,
        'trustEquityScore': round(trust_score, 1),
        'complianceScore': round(compliance_score, 1),
        'controlsAssessed': len(assessments),
        'totalControls': total_controls
    })


@app.route('/api/assessments/<int:cert_id>/export', methods=['GET'])
def export_assessment(cert_id):
    """Export certification assessment data"""
    format_type = request.args.get('format', 'json')
    
    export_data = manager.export_certification_data(cert_id, format_type)
    
    if format_type == 'csv':
        return export_data, 200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': f'attachment; filename=certification_{cert_id}.csv'
        }
    else:
        return export_data, 200, {'Content-Type': 'application/json'}


@app.route('/api/automation/opportunities', methods=['GET'])
def get_automation_opportunities():
    """Get automation opportunities across all certifications"""
    opportunities = []
    
    for cert_type, framework in manager.frameworks.items():
        cert_opportunities = {
            'certification': cert_type,
            'automationPotential': 0,
            'controls': []
        }
        
        total_controls = 0
        automated_controls = 0
        
        for domain in framework['domains'].values():
            for control in domain['controls']:
                total_controls += 1
                if control.automation_available:
                    automated_controls += 1
                    if control.status.value != 'fully_implemented':
                        cert_opportunities['controls'].append({
                            'controlId': control.id,
                            'controlName': control.name,
                            'category': control.category,
                            'trustImpact': control.trust_impact,
                            'estimatedSavings': manager._estimate_implementation_effort(control) * 0.3
                        })
        
        cert_opportunities['automationPotential'] = (
            automated_controls / total_controls * 100
        ) if total_controls > 0 else 0
        
        opportunities.append(cert_opportunities)
    
    return jsonify({'opportunities': opportunities})


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'certificationsLoaded': len(manager.frameworks)
    })


if __name__ == '__main__':
    # Run Flask app
    app.run(debug=True, port=5001)