import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  BarChart3, 
  TrendingUp, 
  Target, 
  DollarSign, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Award,
  Eye,
  Calculator,
  Activity,
  Globe,
  Users,
  Rocket,
  Building
} from 'lucide-react';
import { PublicHeader } from '../../components/common/PublicHeader';

const QIE: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'benchmarks' | 'roi'>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-12">
            {/* QIE Overview */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Quantified Impact Engine
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Measure, track, and demonstrate the quantifiable business impact of your compliance investments with AI-powered analytics and industry benchmarking.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-emerald-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">ROI Measurement</h3>
                      <p className="text-slate-600 text-sm">Precise calculation of compliance investment returns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Industry Benchmarking</h3>
                      <p className="text-slate-600 text-sm">Compare your performance against industry peers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Impact Analytics</h3>
                      <p className="text-slate-600 text-sm">Quantify business impact of compliance improvements</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">QIE Impact Metrics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">€2.5M</div>
                    <div className="text-sm text-slate-600">Avg Cost Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">450%</div>
                    <div className="text-sm text-slate-600">Avg ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">18 Weeks</div>
                    <div className="text-sm text-slate-600">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">83%</div>
                    <div className="text-sm text-slate-600">Efficiency Gain</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Categories */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Quantified Impact Categories
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <DollarSign className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Cost Reduction</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Reduced audit preparation costs</li>
                    <li>• Eliminated manual compliance work</li>
                    <li>• Decreased consultant dependencies</li>
                    <li>• Lower insurance premiums</li>
                    <li>• Reduced breach risk exposure</li>
                  </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <Clock className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Time Savings</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Faster audit readiness</li>
                    <li>• Automated evidence collection</li>
                    <li>• Streamlined reporting processes</li>
                    <li>• Reduced compliance meetings</li>
                    <li>• Accelerated certification timelines</li>
                  </ul>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <TrendingUp className="w-8 h-8 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Business Value</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Increased customer trust</li>
                    <li>• Enhanced competitive advantage</li>
                    <li>• Improved sales cycle efficiency</li>
                    <li>• Better risk management</li>
                    <li>• Accelerated market expansion</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Success Stories */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Real Impact Stories
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-emerald-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-bold text-slate-900">Enterprise SaaS Company</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Annual Savings:</span>
                      <span className="font-bold text-emerald-600">€420,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Time Reduced:</span>
                      <span className="font-bold text-blue-600">24 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">ROI:</span>
                      <span className="font-bold text-purple-600">340%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Rocket className="w-6 h-6 text-blue-600" />
                    <h4 className="font-bold text-slate-900">Fintech Startup</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Annual Savings:</span>
                      <span className="font-bold text-emerald-600">€180,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Time Reduced:</span>
                      <span className="font-bold text-blue-600">16 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">ROI:</span>
                      <span className="font-bold text-purple-600">520%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Comprehensive Impact Metrics</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Track and measure every aspect of your compliance investment with detailed metrics and KPIs that matter to your business.
              </p>
            </div>

            {/* Metric Categories */}
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="p-3 bg-emerald-100 rounded-lg w-fit mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-4">Financial Metrics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Cost Avoidance</span>
                    <span className="font-medium text-emerald-600">€1.2M</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit Savings</span>
                    <span className="font-medium text-emerald-600">€340K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consulting Reduction</span>
                    <span className="font-medium text-emerald-600">€280K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Mitigation</span>
                    <span className="font-medium text-emerald-600">€890K</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-4">Time Metrics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Audit Prep Time</span>
                    <span className="font-medium text-blue-600">-85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evidence Collection</span>
                    <span className="font-medium text-blue-600">-92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Report Generation</span>
                    <span className="font-medium text-blue-600">-78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance Reviews</span>
                    <span className="font-medium text-blue-600">-67%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-4">Quality Metrics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Audit Pass Rate</span>
                    <span className="font-medium text-purple-600">96.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Control Effectiveness</span>
                    <span className="font-medium text-purple-600">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Evidence Quality</span>
                    <span className="font-medium text-purple-600">98.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance Coverage</span>
                    <span className="font-medium text-purple-600">97.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                <div className="p-3 bg-amber-100 rounded-lg w-fit mx-auto mb-4">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-4">Team Metrics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Team Productivity</span>
                    <span className="font-medium text-amber-600">+340%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stress Reduction</span>
                    <span className="font-medium text-amber-600">-76%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Focus on Strategy</span>
                    <span className="font-medium text-amber-600">+89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job Satisfaction</span>
                    <span className="font-medium text-amber-600">+94%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Impact Dashboard */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Impact Dashboard Overview
              </h3>
              
              {/* Mock Dashboard */}
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-semibold text-slate-900 mb-4">Cost Impact Trend</h4>
                    <div className="h-32 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <div className="text-sm text-slate-600">📈 Savings Growth</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-semibold text-slate-900 mb-4">Time Savings Breakdown</h4>
                    <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm text-slate-600">⏱️ Efficiency Gains</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-semibold text-slate-900 mb-4">ROI Projection</h4>
                    <div className="h-32 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm text-slate-600">💰 Return Analysis</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Performance Indicators */}
                <div className="grid lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Monthly Savings', value: '€45K', change: '+12%', color: 'emerald' },
                    { label: 'Time Saved', value: '120 hrs', change: '+8%', color: 'blue' },
                    { label: 'ROI %', value: '450%', change: '+15%', color: 'purple' },
                    { label: 'Efficiency', value: '94%', change: '+3%', color: 'amber' },
                    { label: 'Quality Score', value: '96.8', change: '+2%', color: 'green' },
                    { label: 'Team Velocity', value: '340%', change: '+25%', color: 'indigo' }
                  ].map((kpi, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border text-center">
                      <div className="text-lg font-bold text-slate-900">{kpi.value}</div>
                      <div className="text-xs text-slate-600 mb-1">{kpi.label}</div>
                      <div className={`text-xs font-medium text-€{kpi.color}-600`}>{kpi.change}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'benchmarks':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Industry Benchmarking</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Compare your compliance performance against industry peers and best practices to identify optimization opportunities.
              </p>
            </div>

            {/* Benchmark Categories */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Industry Comparison</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600">Your Performance</span>
                      <span className="text-sm font-medium text-emerald-600">87.5</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width: '87.5%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600">Industry Average</span>
                      <span className="text-sm font-medium text-slate-600">72.3</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-slate-400 h-2 rounded-full" style={{width: '72.3%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-600">Top Quartile</span>
                      <span className="text-sm font-medium text-blue-600">91.2</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '91.2%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Performance Ranking</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="text-sm font-medium">Cost Efficiency</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600">Top 5%</span>
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Automation Level</span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">Top 10%</span>
                      <Award className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Audit Success</span>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-600">Top 3%</span>
                      <Award className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Optimization Targets</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Evidence Quality</span>
                      <span className="text-xs text-slate-500">Goal: 95%</span>
                    </div>
                    <div className="text-sm text-emerald-600">+2.3% to reach target</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Response Time</span>
                      <span className="text-xs text-slate-500">Goal: &lt;24hrs</span>
                    </div>
                    <div className="text-sm text-blue-600">-4hrs to reach target</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Coverage Depth</span>
                      <span className="text-xs text-slate-500">Goal: 98%</span>
                    </div>
                    <div className="text-sm text-purple-600">Already exceeded! 🎉</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Benchmarking */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                Comprehensive Benchmark Analysis
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-6">Framework Performance vs Industry</h4>
                  <div className="space-y-4">
                    {[
                      { framework: 'SOC 2', your: 91.2, industry: 78.5, top: 94.1 },
                      { framework: 'ISO 27001', your: 88.7, industry: 75.2, top: 92.3 },
                      { framework: 'GDPR', your: 93.4, industry: 81.7, top: 96.8 },
                      { framework: 'HIPAA', your: 86.9, industry: 73.4, top: 89.7 }
                    ].map((item, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-slate-900">{item.framework}</span>
                          <span className="text-sm text-emerald-600">+{(item.your - item.industry).toFixed(1)} vs industry</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-600 w-16">You</span>
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{width: `€{item.your}%`}}></div>
                            </div>
                            <span className="text-xs font-medium w-12">{item.your}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-600 w-16">Industry</span>
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div className="bg-slate-400 h-2 rounded-full" style={{width: `€{item.industry}%`}}></div>
                            </div>
                            <span className="text-xs font-medium w-12">{item.industry}%</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-600 w-16">Top 10%</span>
                            <div className="flex-1 bg-slate-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: `€{item.top}%`}}></div>
                            </div>
                            <span className="text-xs font-medium w-12">{item.top}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-6">Key Performance Indicators</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h5 className="font-semibold text-slate-900 mb-2">Cost Per Control</h5>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Your Cost: €245</span>
                        <span className="text-emerald-600">67% below industry</span>
                      </div>
                      <div className="text-xs text-slate-600">Industry Average: €742</div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-slate-900 mb-2">Time to Audit Ready</h5>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Your Time: 6 weeks</span>
                        <span className="text-blue-600">75% faster than industry</span>
                      </div>
                      <div className="text-xs text-slate-600">Industry Average: 24 weeks</div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h5 className="font-semibold text-slate-900 mb-2">Automation Percentage</h5>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Your Level: 95%</span>
                        <span className="text-purple-600">6x higher than industry</span>
                      </div>
                      <div className="text-xs text-slate-600">Industry Average: 15%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'roi':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">ROI Analysis & Projections</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Comprehensive return on investment analysis with predictive modeling and scenario planning for your compliance investments.
              </p>
            </div>

            {/* ROI Overview */}
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white text-center">
                <h3 className="font-bold mb-2">Total ROI</h3>
                <div className="text-3xl font-bold mb-2">450%</div>
                <div className="text-sm opacity-90">Over 3 years</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
                <h3 className="font-bold mb-2">Payback Period</h3>
                <div className="text-3xl font-bold mb-2">8.2</div>
                <div className="text-sm opacity-90">Months</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
                <h3 className="font-bold mb-2">Net Savings</h3>
                <div className="text-3xl font-bold mb-2">€2.1M</div>
                <div className="text-sm opacity-90">Annual</div>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white text-center">
                <h3 className="font-bold mb-2">Cost Avoidance</h3>
                <div className="text-3xl font-bold mb-2">€850K</div>
                <div className="text-sm opacity-90">Risk mitigation</div>
              </div>
            </div>

            {/* ROI Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                ROI Calculation Breakdown
              </h3>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">Investment Costs</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                      <span>Velocity Platform (Annual)</span>
                      <span className="font-medium">€120,000</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                      <span>Implementation & Training</span>
                      <span className="font-medium">€45,000</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded-lg">
                      <span>Integration Setup</span>
                      <span className="font-medium">€25,000</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Investment</span>
                      <span className="text-red-600">€190,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">Returns & Savings</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-emerald-50 rounded-lg">
                      <span>Audit Cost Reduction</span>
                      <span className="font-medium">€420,000</span>
                    </div>
                    <div className="flex justify-between p-3 bg-emerald-50 rounded-lg">
                      <span>Staff Time Savings</span>
                      <span className="font-medium">€680,000</span>
                    </div>
                    <div className="flex justify-between p-3 bg-emerald-50 rounded-lg">
                      <span>Consultant Elimination</span>
                      <span className="font-medium">€320,000</span>
                    </div>
                    <div className="flex justify-between p-3 bg-emerald-50 rounded-lg">
                      <span>Risk Mitigation Value</span>
                      <span className="font-medium">€450,000</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Returns</span>
                      <span className="text-emerald-600">€1,870,000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
                <div className="text-center">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Net ROI Calculation</h4>
                  <div className="text-sm text-slate-600 mb-4">
                    ROI = (Returns - Investment) / Investment × 100
                  </div>
                  <div className="text-sm text-slate-600 mb-2">
                    ROI = (€1,870,000 - €190,000) / €190,000 × 100
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">= 884% ROI</div>
                </div>
              </div>
            </div>

            {/* ROI Projections */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">3-Year ROI Projection</h3>
                
                <div className="space-y-4">
                  {[
                    { year: 'Year 1', investment: 190000, returns: 850000, roi: 347 },
                    { year: 'Year 2', investment: 120000, returns: 1200000, roi: 900 },
                    { year: 'Year 3', investment: 120000, returns: 1350000, roi: 1025 }
                  ].map((item, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900">{item.year}</span>
                        <span className="font-bold text-emerald-600">{item.roi}% ROI</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Investment: </span>
                          <span className="font-medium">€{(item.investment / 1000)}K</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Returns: </span>
                          <span className="font-medium">€{(item.returns / 1000)}K</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-center">
                      <div className="font-bold text-slate-900">Cumulative 3-Year ROI</div>
                      <div className="text-2xl font-bold text-emerald-600">758%</div>
                      <div className="text-sm text-slate-600">Total Net Benefit: €3.97M</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Scenario Analysis</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-2">Best Case Scenario</h4>
                    <div className="text-sm text-slate-600 mb-2">Optimal implementation, high adoption</div>
                    <div className="flex justify-between">
                      <span>3-Year ROI:</span>
                      <span className="font-bold text-emerald-600">1,245%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Expected Scenario</h4>
                    <div className="text-sm text-slate-600 mb-2">Standard implementation timeline</div>
                    <div className="flex justify-between">
                      <span>3-Year ROI:</span>
                      <span className="font-bold text-blue-600">758%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">Conservative Scenario</h4>
                    <div className="text-sm text-slate-600 mb-2">Slower adoption, partial benefits</div>
                    <div className="flex justify-between">
                      <span>3-Year ROI:</span>
                      <span className="font-bold text-amber-600">425%</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Break-Even Analysis</h4>
                    <div className="text-sm text-slate-600">
                      Even in the most conservative scenario, you break even in just <span className="font-bold text-slate-900">11.2 months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Calculator CTA */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Calculate Your Custom ROI</h3>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Get a personalized ROI analysis based on your specific situation, industry, and compliance requirements.
              </p>
              <button
                onClick={() => navigate('/calculators/roi')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Launch ROI Calculator
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 pt-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-amber-500 rounded-full mr-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <span className="text-amber-400 font-semibold text-lg">Quantified Impact Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Measure & Prove
              <span className="block text-amber-400">Compliance ROI</span>
            </h1>
            
            <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
              Quantify the business impact of your compliance investments with AI-powered analytics, 
              industry benchmarking, and comprehensive ROI tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => navigate('/calculators/roi')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculate Your ROI
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('/velocity/demo')}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-300 text-slate-200 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
              >
                <Eye className="w-5 h-5" />
                View QIE Demo
              </button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400 mb-2">450%</div>
                <div className="text-sm text-slate-300">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">€2.1M</div>
                <div className="text-sm text-slate-300">Annual Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">8.2</div>
                <div className="text-sm text-slate-300">Months Payback</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">83%</div>
                <div className="text-sm text-slate-300">Efficiency Gain</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: Zap },
            { id: 'metrics', label: 'Impact Metrics', icon: BarChart3 },
            { id: 'benchmarks', label: 'Benchmarks', icon: Award },
            { id: 'roi', label: 'ROI Analysis', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 €{
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-2xl p-12 border border-amber-500/20">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Quantify Your Impact?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Start measuring and proving the business value of your compliance investments with our Quantified Impact Engine.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/calculators/roi')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Calculate ROI
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => navigate('/velocity/assessment')}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-400 text-slate-300 font-semibold rounded-lg hover:border-white hover:text-white transition-colors"
            >
              <Target className="w-5 h-5" />
              Free Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QIE;