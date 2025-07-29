# ERIP Claude Code Implementation Prompt
## Comprehensive Platform Development Instructions

---

## CRITICAL: Resource Efficiency Architecture

### **Language-Specific Implementation (MANDATORY)**

Given tight resource constraints, optimal language selection is critical:

```typescript
interface ResourceOptimizedArchitecture {
  python_backend: {
    components: ["PRISM computational engine", "ML model serving", "Statistical analysis", "Monte Carlo simulations"];
    reasons: ["10x faster mathematical operations", "Native ML library support", "Memory efficient for large datasets"];
    libraries: ["NumPy", "SciPy", "Pandas", "QuantLib", "vLLM", "FastAPI"];
    deployment: "AWS Lambda (Python runtime) + EC2 for model serving";
  };
  
  typescript_frontend: {
    components: ["React UI components", "API routing", "Business logic", "Authentication"];
    reasons: ["Type safety", "Developer productivity", "Web ecosystem", "Real-time updates"];
    libraries: ["Vite", "React", "shadcn/ui", "Zustand", "Prisma"];
    deployment: "AWS Amplify + API Gateway";
  };
  
  performance_critical: {
    monte_carlo_simulations: "Python (100x faster than TypeScript)";
    ai_model_inference: "Python with optimized libraries (vLLM, transformers)";
    large_dataset_processing: "Python with Pandas/NumPy";
    financial_calculations: "Python with QuantLib";
    real_time_apis: "TypeScript with Express.js/Fastify";
  };
}
```

### **Resource Efficiency Rules (NON-NEGOTIABLE)**

```bash
# Rule: Use Python for ALL computational tasks
claude-code "CRITICAL: Implement ALL mathematical operations, ML inference, statistical analysis, and data processing in Python. Do NOT use TypeScript for Monte Carlo simulations, risk calculations, or AI model serving. This is mandatory for resource efficiency."

# Rule: Use TypeScript ONLY for web interfaces and API coordination
claude-code "CRITICAL: Use TypeScript ONLY for React components, API routing, database ORM operations, and user interfaces. Do NOT implement computational logic in TypeScript as it will be 10-100x slower and consume excessive resources."

# Rule: Optimize for minimal resource consumption
claude-code "CRITICAL: Given tight resource constraints, optimize every component for minimal CPU/memory usage. Use appropriate data structures, efficient algorithms, and proper caching. Monitor resource usage continuously."
```

---

## CRITICAL: Document Reference Requirements

**Before starting any implementation, you MUST:**

1. **Read and analyze ALL documents in `/Velocity-app/doc/`** directory
2. **Extract all requirements, specifications, and rules** from each document
3. **Create a complete implementation plan** based on document specifications
4. **Follow ALL rules and guidelines** specified in the documents without compromise
5. **Reference specific document sections** when making implementation decisions

---

## Primary Implementation Directive

**TASK**: Build the complete ERIP (Enterprise Risk Intelligence Platform) - a **category-defining, AI-native platform** that transforms how enterprises manage digital trust, security, and compliance.

**ERIP'S VAST SCOPE**: This is not an enhancement to existing tools - it's a **comprehensive ecosystem** that includes:
- **Complete regulatory intelligence** with AI-powered analysis
- **Strategic risk quantification** with financial modeling  
- **Executive decision automation** solving "Department of No" problems
- **Continuous monitoring and prediction** across entire enterprise
- **Policy automation and governance** with intelligent workflows
- **Advanced intelligence platform** with expert network integration
- **Value demonstration** with ROI tracking and business impact measurement
- **Strategic risk clearance** enabling risk-based business decisions

**POSITIONING**: ERIP creates an entirely new category - "AI-Powered Enterprise Risk Intelligence" - transforming risk management from technical compliance to strategic business advantage.

**TECHNOLOGY STACK**: 
- **Frontend**: Vite + React (lightweight, fast development)
- **Backend**: Hybrid Python/TypeScript (optimal performance per component)
- **Critical**: Use Python for mathematical operations, AI/ML, and data processing
- **Critical**: Use TypeScript only for web APIs and user interfaces

**RESOURCE CONSTRAINTS**: Implementation must be optimized for minimal resource usage while maintaining enterprise-grade functionality.

**SCOPE**: Implement ALL 8 components with full functionality as specified in the documentation, using optimal language choices for maximum efficiency.

---

## Implementation Requirements

### **Phase 1: Document Analysis & Architecture (First Priority)**

```bash
# Step 1: Comprehensive Document Analysis
claude-code "Read and analyze every document in /Velocity-app/doc/ directory. Extract all requirements, technical specifications, component definitions, AI integration rules, testing requirements, and development guidelines. Create a comprehensive implementation roadmap that covers every aspect mentioned in the documents."

# Step 2: Vite-Based Architecture Design
claude-code "Design complete ERIP platform architecture using Vite + React + TypeScript. Include all 8 components (COMPASS, ATLAS, PRISM, PULSE, CIPHER, NEXUS, BEACON, CLEARANCE) with hybrid AI integration (Claude models + open source models). Follow all architectural specifications from the documents."

# Step 3: Project Structure Setup
claude-code "Create complete Vite project structure for ERIP platform following the exact specifications in the documents. Include all directories, configuration files, package.json with all dependencies, and initial component scaffolding for all 8 components."
```

### **Phase 2: Core Infrastructure Implementation**

```bash
# Step 4: Hybrid Architecture with Language-Specific Implementation
claude-code "Implement hybrid architecture with proper language separation:
- Frontend (TypeScript): Vite + React + shadcn/ui for all user interfaces
- API Layer (TypeScript): Express.js/Fastify for web APIs and routing
- Computational Backend (Python): FastAPI for mathematical operations, ML model serving, and data processing
- Database Layer: Prisma (TypeScript) for ORM, direct Python database connections for heavy operations
Follow the exact language requirements specified in the documents for maximum efficiency."

# Step 5: Python Computational Services Setup
claude-code "Create Python backend services for:
- PRISM Monte Carlo simulations (NumPy/SciPy)
- AI model serving (vLLM + FastAPI for advanced models)
- Statistical risk analysis (Pandas + scikit-learn)
- Financial modeling (QuantLib + custom algorithms)
- Data processing pipelines (Apache Airflow/Celery)
Use Python for ALL mathematical and ML operations as specified in documents."

# Step 6: TypeScript API & Frontend Layer
claude-code "Create TypeScript services for:
- Frontend React components and UI logic
- API routing and business logic
- Database ORM operations (Prisma)
- Authentication and session management
- Real-time WebSocket connections
Use TypeScript ONLY for web interfaces and API coordination, NOT for computational tasks."
```

### **Phase 3: Component Implementation (All 8 Components)**

```bash
# Step 7: COMPASS - Regulatory Intelligence Engine
claude-code "Implement complete COMPASS component as specified in the documents. Include AI-powered regulation analysis using Claude Sonnet 4, framework mapping, dynamic compliance tracking, implementation roadmapping, and evidence management. Use Mistral-7B for document classification and Llama-3.1-70B for batch processing as specified."

# Step 8: ATLAS - Security Assessment System
claude-code "Implement complete ATLAS component as specified in the documents. Include intelligent assessment workflows, comprehensive multi-cloud security analysis, control effectiveness monitoring, gap analysis automation, and third-party risk assessment. Integrate with various security tools as data sources, with native cloud security scanning capabilities."

# Step 9: PRISM - Risk Quantification Engine (PYTHON BACKEND + TYPESCRIPT FRONTEND)
claude-code "Implement PRISM with proper language separation:
- Python Backend: Monte Carlo simulations using NumPy/SciPy, FAIR methodology implementation, financial modeling with QuantLib, statistical analysis with Pandas, risk calculations using pure Python for maximum performance
- TypeScript Frontend: React dashboard components, API integration, data visualization with Recharts, executive reporting interface
- Integration: FastAPI (Python) ↔ Express.js (TypeScript) communication
Use Python for ALL mathematical operations as specified in documents for resource efficiency."

# Step 10: PULSE - Continuous Monitoring System (HYBRID IMPLEMENTATION)
claude-code "Implement PULSE with language-optimized architecture:
- Python Backend: Real-time data processing, predictive analytics using scikit-learn, anomaly detection algorithms, statistical trend analysis, performance-critical monitoring tasks
- TypeScript Frontend: Real-time dashboards, alert management UI, notification systems, user interaction components
Use Python for data processing, TypeScript for user interfaces as specified."

# Step 11: CIPHER - Policy Automation Engine (HYBRID IMPLEMENTATION)  
claude-code "Implement CIPHER with optimal language distribution:
- Python Backend: AI-powered policy generation using Claude API, Infrastructure-as-Code automation, compliance validation algorithms, version control logic
- TypeScript Frontend: Policy management interface, template library UI, approval workflow components, audit trail visualization
Use Python for automation logic, TypeScript for management interfaces."

# Step 12: NEXUS - Advanced Intelligence Platform
claude-code "Implement complete NEXUS component as specified in the documents. Include threat intelligence integration, industry benchmarking, regulatory forecasting, research integration (Semantic Scholar/Consensus APIs), and collaborative intelligence features."

# Step 13: BEACON - Value Demonstration Platform
claude-code "Implement complete BEACON component as specified in the documents. Include ROI measurement, business impact reporting, maturity assessment, benchmark comparisons, and automated success story generation."

# Step 14: CLEARANCE - Strategic Risk Clearance Platform
claude-code "Implement complete CLEARANCE component as specified in the documents. Include risk quantification engine, approval authority routing, risk vs opportunity analysis using the framework from the video transcript, decision workflow automation, and strategic decision intelligence. Solve the 'Department of No' problem as specified."
```

### **Phase 4: Integration & Advanced Features**

```bash
# Step 15: Cross-Component Integration
claude-code "Implement complete integration between all 8 ERIP components as specified in the documents. Create unified data flows, shared APIs, cross-component analytics, and integrated reporting. Ensure CLEARANCE can use PRISM risk quantification and COMPASS regulatory context."

# Step 16: Risk Appetite Framework Automation
claude-code "Implement the complete risk appetite framework automation as specified in the documents. Include crown jewels identification, loss event scenario generation, magnitude/probability thresholds, decision boundaries, early warning indicators, and board reporting automation."

# Step 17: Executive Dashboard System
claude-code "Implement comprehensive executive dashboard system as specified in the documents. Include real-time risk visualization, financial impact reporting, compliance status tracking, decision pipeline monitoring, and board-ready presentations."

# Step 18: Expert Network Integration
claude-code "Implement expert network integration as specified in the documents. Include verified expert management, on-demand consultation, peer collaboration, quality assurance workflows, and knowledge sharing systems."
```

### **Phase 5: Testing & Quality Assurance**

```bash
# Step 19: Hybrid Testing Suite (Language-Specific)
claude-code "Implement comprehensive testing with language optimization:
- Python Testing: pytest for computational components, performance benchmarks for Monte Carlo simulations, memory usage testing for ML models, accuracy validation for mathematical operations
- TypeScript Testing: Jest + React Testing Library for frontend, API integration tests, WebSocket connection tests
- Integration Testing: Python ↔ TypeScript communication, end-to-end workflows, performance under load
- Resource Testing: Memory usage optimization, CPU efficiency benchmarks, cost monitoring
Achieve 90%+ coverage while maintaining resource efficiency."

# Step 20: AI Model Quality Assurance
claude-code "Implement AI model quality assurance system as specified in the documents. Include cross-model validation, expert validation workflows, accuracy monitoring, cost tracking, and continuous improvement mechanisms."

# Step 21: Performance Optimization
claude-code "Implement performance optimization following all specifications in the documents. Include page load optimization (<3 seconds), API response optimization (<2 seconds), database query optimization, AI processing optimization, and scaling preparation."
```

### **Phase 6: Deployment & Operations**

```bash
# Step 22: Hybrid AWS Deployment Pipeline (Resource-Optimized)
claude-code "Implement resource-efficient AWS deployment:
- Python Services: AWS Lambda functions for computational tasks, EC2 with GPU for AI model serving, ECS for long-running Python processes
- TypeScript Services: AWS Amplify for frontend, API Gateway + Lambda for web APIs, CloudFront for static assets
- Database: RDS PostgreSQL with read replicas, DynamoDB for high-frequency data
- Optimization: Auto-scaling based on CPU/memory usage, spot instances for batch processing, efficient container images
Deploy with minimal resource footprint while maintaining performance."

# Step 23: Monitoring & Analytics
claude-code "Implement comprehensive monitoring and analytics system as specified in the documents. Include real-time performance monitoring, cost tracking, user analytics, AI model performance monitoring, and business metrics tracking."

# Step 24: Documentation & Training
claude-code "Generate complete documentation as specified in the documents. Include API documentation, user guides, deployment instructions, troubleshooting guides, and training materials for all components and features."
```

---

## Specific Implementation Rules

### **Technology Requirements (CRITICAL - Language-Specific)**
- **Frontend**: Vite + React 18 + TypeScript (MANDATORY - NOT Next.js)
- **Backend API Layer**: TypeScript/Node.js for web APIs and routing
- **Computational Backend**: Python for mathematical operations, AI/ML, and data processing
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand for global state
- **Database**: Prisma + PostgreSQL for primary data
- **AI Integration**: Python for model serving, TypeScript for API integration
- **Testing**: Jest + React Testing Library + Playwright (Frontend), pytest (Python)
- **Deployment**: AWS with serverless architecture (Lambda functions in appropriate languages)

### **AI Integration Rules (CRITICAL)**
```typescript
// MANDATORY: Follow exact AI model routing as specified
interface AIModelRouting {
  tier_1_premium: {
    models: ["Claude Sonnet 4", "Claude Opus 4"];
    use_cases: ["Complex analysis", "Strategic insights"];
    cost_limit: "<20% of total AI usage";
  };
  
  tier_2_standard: {
    models: ["Claude Haiku 4", "GPT-3.5 Turbo"];
    use_cases: ["Standard operations", "Report generation"];
    cost_limit: "<30% of total AI usage";
  };
  
  tier_3_efficient: {
    models: ["Llama-3.1-70B", "Mistral-7B", "Phi-3-Mini"];
    use_cases: ["Batch processing", "Classification"];
    cost_limit: ">50% of total AI usage";
  };
}
```

### **Resource-Optimized Performance Standards**
- **Python Backend**: Monte Carlo simulations <30 seconds for 10K iterations
- **TypeScript Frontend**: Page loads <2 seconds, API responses <1 second  
- **Memory Usage**: <2GB RAM for standard operations, <8GB for ML inference
- **CPU Efficiency**: <50% CPU utilization during normal operations
- **Cost Optimization**: Total infrastructure <$500/month for MVP deployment
- **AI Processing**: Batch operations during off-peak hours for cost savings

### **Component Integration Rules**
- **COMPASS** → **ATLAS**: Regulatory requirements inform security assessments
- **ATLAS** → **PRISM**: Security findings feed risk quantification
- **PRISM** → **CLEARANCE**: Risk quantification enables decision routing
- **PULSE** → All Components: Real-time monitoring for all systems
- **BEACON** → All Components: Value measurement across platform

---

## Success Criteria

### **Functional Requirements**
- [ ] All 8 components fully implemented and functional
- [ ] Hybrid AI integration with cost optimization working
- [ ] Risk appetite framework automation complete
- [ ] Cross-component integration and data flow functional
- [ ] Executive reporting and dashboard system operational

### **Quality Requirements**
- [ ] 90%+ test coverage across all components
- [ ] Sub-3 second page load times
- [ ] Sub-2 second API response times
- [ ] SOC 2 compliance implemented
- [ ] AI accuracy >95% validated by expert review

### **Business Requirements**
- [ ] "Department of No" problem solved through CLEARANCE
- [ ] Complete decision intelligence from regulatory to ROI
- [ ] Executive-level financial reporting functional
- [ ] Expert network integration operational
- [ ] Competitive advantages clearly implemented

---

## Implementation Verification

After each major phase, verify implementation against document specifications:

```bash
# Verification Commands
claude-code "Review current implementation against ALL specifications in /Velocity-app/doc/. Identify any missing features, incomplete implementations, or deviations from the documented requirements. Provide detailed gap analysis and remediation plan."

claude-code "Test all implemented features against the success criteria specified in the documents. Verify AI integration accuracy, performance benchmarks, security compliance, and business functionality. Generate comprehensive test report."

claude-code "Validate that the implementation solves the core business problems specified in the documents: Department of No transformation, risk appetite automation, executive decision intelligence, and competitive positioning."
```

---

## FINAL MANDATE

**This is not a partial implementation request. Build the COMPLETE ERIP platform exactly as specified in the documents. Every component, every feature, every integration, every optimization. Follow every rule, meet every requirement, implement every specification.**

**The goal is a production-ready platform that transforms enterprise risk intelligence through AI automation, solving real business problems while maintaining enterprise-grade quality and security.**

**Success means delivering the category-defining platform described in the documents - nothing less.**

---

## Execution Order

1. **READ ALL DOCUMENTS FIRST** - Extract every requirement
2. **Plan complete architecture** - Design everything before coding
3. **Implement systematically** - Build each component fully
4. **Test comprehensively** - Validate every feature
5. **Integrate seamlessly** - Ensure everything works together
6. **Optimize relentlessly** - Meet all performance requirements
7. **Validate completely** - Verify against all document specifications

**Begin implementation NOW. Build the future of enterprise risk intelligence.**