/**
 * ERIP Expert Network MVP
 * 
 * Connect customers with compliance experts for:
 * - Expert consultations and guidance
 * - Framework-specific advice
 * - Compliance validation and review
 * - Strategic planning sessions
 * - Emergency compliance support
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users,
  Star,
  MessageCircle,
  Calendar,
  Clock,
  Award,
  Shield,
  BookOpen,
  Video,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  MapPin,
  DollarSign,
  TrendingUp,
  Briefcase,
  Globe,
  Zap,
  Heart,
  User,
  Send,
  FileText,
  PlayCircle,
  Download
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

interface Expert {
  id: string
  name: string
  title: string
  company: string
  specializations: string[]
  frameworks: string[]
  experience: number
  rating: number
  reviewCount: number
  hourlyRate: number
  availability: 'available' | 'busy' | 'offline'
  location: string
  timezone: string
  languages: string[]
  bio: string
  avatar: string
  certifications: string[]
  successStories: number
  responseTime: string
  isVerified: boolean
  isFavorite?: boolean
}

interface Consultation {
  id: string
  expertId: string
  expertName: string
  title: string
  description: string
  framework: string
  duration: number
  status: 'scheduled' | 'completed' | 'in-progress' | 'cancelled'
  scheduledDate: string
  price: number
  rating?: number
  notes?: string
}

interface ExpertRequest {
  framework: string
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  budget: string
  timeline: string
  description: string
  preferredFormat: 'video' | 'phone' | 'email' | 'in-person'
}

const SAMPLE_EXPERTS: Expert[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Principal Security Consultant',
    company: 'Deloitte',
    specializations: ['SOC 2', 'ISO 27001', 'Risk Management'],
    frameworks: ['SOC 2', 'ISO 27001', 'NIST CSF', 'PCI DSS'],
    experience: 12,
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 450,
    availability: 'available',
    location: 'San Francisco, CA',
    timezone: 'PST',
    languages: ['English', 'Mandarin'],
    bio: 'Former CISO with 12+ years experience helping organizations achieve compliance. Specialized in SOC 2 and ISO 27001 implementations.',
    avatar: '/avatars/sarah-chen.jpg',
    certifications: ['CISSP', 'CISA', 'Lead Auditor ISO 27001'],
    successStories: 89,
    responseTime: '< 2 hours',
    isVerified: true
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'GDPR Compliance Director',
    company: 'Privacy International',
    specializations: ['GDPR', 'CCPA', 'Privacy Law'],
    frameworks: ['GDPR', 'CCPA', 'PIPEDA', 'Privacy by Design'],
    experience: 8,
    rating: 4.8,
    reviewCount: 93,
    hourlyRate: 380,
    availability: 'busy',
    location: 'London, UK',
    timezone: 'GMT',
    languages: ['English', 'Spanish', 'French'],
    bio: 'Privacy lawyer and compliance expert specializing in EU and US privacy regulations. Helped 200+ companies achieve GDPR compliance.',
    avatar: '/avatars/michael-rodriguez.jpg',
    certifications: ['CIPP/E', 'CIPM', 'FIP'],
    successStories: 156,
    responseTime: '< 4 hours',
    isVerified: true,
    isFavorite: true
  },
  {
    id: '3',
    name: 'Jennifer Kim',
    title: 'Healthcare Compliance Specialist',
    company: 'HHS Advisory',
    specializations: ['HIPAA', 'Healthcare Security', 'Risk Assessment'],
    frameworks: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11'],
    experience: 10,
    rating: 4.9,
    reviewCount: 74,
    hourlyRate: 425,
    availability: 'available',
    location: 'Boston, MA',
    timezone: 'EST',
    languages: ['English', 'Korean'],
    bio: 'Former HHS compliance officer with deep expertise in healthcare privacy and security regulations.',
    avatar: '/avatars/jennifer-kim.jpg',
    certifications: ['CHPS', 'HCISPP', 'CISSP'],
    successStories: 67,
    responseTime: '< 1 hour',
    isVerified: true
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'Financial Services Compliance Lead',
    company: 'PwC',
    specializations: ['PCI DSS', 'Financial Regulations', 'Audit'],
    frameworks: ['PCI DSS', 'SOX', 'FFIEC', 'Basel III'],
    experience: 15,
    rating: 4.7,
    reviewCount: 156,
    hourlyRate: 520,
    availability: 'offline',
    location: 'New York, NY',
    timezone: 'EST',
    languages: ['English'],
    bio: 'Senior financial services compliance expert with Big 4 experience. Led compliance programs for major banks and fintech companies.',
    avatar: '/avatars/david-thompson.jpg',
    certifications: ['CISA', 'PCI QSA', 'CPA'],
    successStories: 203,
    responseTime: '< 6 hours',
    isVerified: true
  },
  {
    id: '5',
    name: 'Priya Patel',
    title: 'Cloud Security Architect',
    company: 'AWS',
    specializations: ['Cloud Security', 'FedRAMP', 'Government Compliance'],
    frameworks: ['FedRAMP', 'FISMA', 'NIST 800-53', 'AWS Security'],
    experience: 9,
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 475,
    availability: 'available',
    location: 'Seattle, WA',
    timezone: 'PST',
    languages: ['English', 'Hindi', 'Gujarati'],
    bio: 'Cloud security specialist with extensive FedRAMP and government compliance experience. Currently AWS Solutions Architect.',
    avatar: '/avatars/priya-patel.jpg',
    certifications: ['AWS Security Specialty', 'CISSP', 'FedRAMP PMO'],
    successStories: 45,
    responseTime: '< 3 hours',
    isVerified: true
  },
  {
    id: '6',
    name: 'Robert Wagner',
    title: 'Cybersecurity Consultant',
    company: 'Independent',
    specializations: ['Penetration Testing', 'Vulnerability Assessment', 'Incident Response'],
    frameworks: ['NIST CSF', 'ISO 27001', 'COBIT'],
    experience: 18,
    rating: 4.6,
    reviewCount: 201,
    hourlyRate: 350,
    availability: 'available',
    location: 'Austin, TX',
    timezone: 'CST',
    languages: ['English', 'German'],
    bio: 'Veteran cybersecurity consultant with 18+ years in the field. Former military cyber operations specialist.',
    avatar: '/avatars/robert-wagner.jpg',
    certifications: ['OSCP', 'CEH', 'GCIH', 'CISSP'],
    successStories: 312,
    responseTime: '< 4 hours',
    isVerified: true
  }
]

const SAMPLE_CONSULTATIONS: Consultation[] = [
  {
    id: '1',
    expertId: '1',
    expertName: 'Dr. Sarah Chen',
    title: 'SOC 2 Type II Readiness Assessment',
    description: 'Comprehensive review of current security controls and gap analysis for SOC 2 Type II certification',
    framework: 'SOC 2',
    duration: 90,
    status: 'scheduled',
    scheduledDate: '2025-01-25T14:00:00Z',
    price: 675
  },
  {
    id: '2',
    expertId: '2',
    expertName: 'Michael Rodriguez',
    title: 'GDPR Data Mapping Workshop',
    description: 'Interactive session to map personal data flows and establish privacy impact assessment framework',
    framework: 'GDPR',
    duration: 120,
    status: 'completed',
    scheduledDate: '2025-01-20T10:00:00Z',
    price: 760,
    rating: 5,
    notes: 'Excellent session. Michael provided clear actionable guidance and templates.'
  },
  {
    id: '3',
    expertId: '3',
    expertName: 'Jennifer Kim',
    title: 'HIPAA Risk Assessment Review',
    description: 'Review of conducted risk assessment and recommendations for remediation prioritization',
    framework: 'HIPAA',
    duration: 60,
    status: 'in-progress',
    scheduledDate: '2025-01-23T15:30:00Z',
    price: 425
  }
]

export const ExpertNetwork: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>(SAMPLE_EXPERTS)
  const [consultations, setConsultations] = useState<Consultation[]>(SAMPLE_CONSULTATIONS)
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null)
  const [activeTab, setActiveTab] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [frameworkFilter, setFrameworkFilter] = useState<string>('all')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')
  const [expertRequest, setExpertRequest] = useState<ExpertRequest>({
    framework: '',
    urgency: 'medium',
    budget: '',
    timeline: '',
    description: '',
    preferredFormat: 'video'
  })
  const [showBookingModal, setShowBookingModal] = useState(false)
  const { toast } = useToast()

  const allFrameworks = Array.from(new Set(experts.flatMap(e => e.frameworks)))
  
  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         expert.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFramework = frameworkFilter === 'all' || expert.frameworks.includes(frameworkFilter)
    const matchesAvailability = availabilityFilter === 'all' || expert.availability === availabilityFilter
    return matchesSearch && matchesFramework && matchesAvailability
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-50 border-green-200'
      case 'busy': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'offline': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleBookConsultation = () => {
    if (!selectedExpert) return
    
    const newConsultation: Consultation = {
      id: (consultations.length + 1).toString(),
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      title: `${expertRequest.framework} Consultation`,
      description: expertRequest.description,
      framework: expertRequest.framework,
      duration: 60,
      status: 'scheduled',
      scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      price: selectedExpert.hourlyRate
    }

    setConsultations(prev => [newConsultation, ...prev])
    setShowBookingModal(false)
    setSelectedExpert(null)
    
    toast({
      title: 'Consultation Booked',
      description: `Your consultation with ${selectedExpert.name} has been scheduled.`
    })
  }

  const toggleFavorite = (expertId: string) => {
    setExperts(prev => 
      prev.map(expert => 
        expert.id === expertId 
          ? { ...expert, isFavorite: !expert.isFavorite }
          : expert
      )
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Expert Network</h1>
          <p className="text-slate-600">
            Connect with certified compliance experts for guidance, validation, and strategic planning
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{experts.length}</div>
                  <div className="text-sm text-slate-600">Expert Partners</div>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{experts.filter(e => e.availability === 'available').length}</div>
                  <div className="text-sm text-slate-600">Available Now</div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{allFrameworks.length}</div>
                  <div className="text-sm text-slate-600">Frameworks Covered</div>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">4.8</div>
                  <div className="text-sm text-slate-600">Avg Expert Rating</div>
                </div>
                <Star className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Experts</TabsTrigger>
            <TabsTrigger value="consultations">My Consultations</TabsTrigger>
            <TabsTrigger value="request">Request Expert</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search experts by name, company, or specialization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={frameworkFilter}
                  onChange={(e) => setFrameworkFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Frameworks</option>
                  {allFrameworks.map(framework => (
                    <option key={framework} value={framework}>{framework}</option>
                  ))}
                </select>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>

            {/* Expert Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredExperts.map((expert) => (
                <Card key={expert.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <User className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{expert.name}</CardTitle>
                            {expert.isVerified && (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFavorite(expert.id)}
                              className="p-1"
                            >
                              <Heart 
                                className={cn(
                                  "h-4 w-4",
                                  expert.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                                )} 
                              />
                            </Button>
                          </div>
                          <p className="text-sm text-slate-600">{expert.title}</p>
                          <p className="text-sm text-slate-500">{expert.company}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{expert.rating}</span>
                            </div>
                            <span className="text-sm text-slate-500">({expert.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={cn("text-xs border", getAvailabilityColor(expert.availability))}>
                        {expert.availability}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600">{expert.bio}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Experience:</span>
                          <span className="font-medium">{expert.experience} years</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Rate:</span>
                          <span className="font-medium">{formatCurrency(expert.hourlyRate)}/hour</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Response time:</span>
                          <span className="font-medium">{expert.responseTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Location:</span>
                          <span className="font-medium">{expert.location}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Specializations</h4>
                        <div className="flex flex-wrap gap-1">
                          {expert.specializations.map(spec => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Frameworks</h4>
                        <div className="flex flex-wrap gap-1">
                          {expert.frameworks.map(framework => (
                            <Badge key={framework} variant="outline" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedExpert(expert)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedExpert(expert)
                            setShowBookingModal(true)
                          }}
                          disabled={expert.availability === 'offline'}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">My Consultations</h2>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New
              </Button>
            </div>

            <div className="space-y-4">
              {consultations.map((consultation) => (
                <Card key={consultation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{consultation.title}</h3>
                          <Badge 
                            className={cn(
                              "text-xs",
                              consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                              consultation.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              consultation.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            )}
                          >
                            {consultation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{consultation.description}</p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Expert:</span>
                            <div className="font-medium">{consultation.expertName}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Framework:</span>
                            <div className="font-medium">{consultation.framework}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Duration:</span>
                            <div className="font-medium">{consultation.duration} min</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Price:</span>
                            <div className="font-medium">{formatCurrency(consultation.price)}</div>
                          </div>
                        </div>
                        {consultation.rating && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-slate-500">Your rating:</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={cn(
                                    "h-4 w-4",
                                    i < consultation.rating! ? "text-yellow-500 fill-current" : "text-gray-300"
                                  )} 
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {consultation.notes && (
                          <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm">{consultation.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {consultation.status === 'scheduled' && (
                          <>
                            <Button size="sm">
                              <Video className="h-4 w-4 mr-2" />
                              Join Call
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Reschedule
                            </Button>
                          </>
                        )}
                        {consultation.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download Notes
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="request" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request an Expert</CardTitle>
                <CardDescription>
                  Can't find the right expert? Submit a request and we'll match you with the perfect specialist.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="framework">Framework/Topic *</Label>
                    <Input
                      id="framework"
                      value={expertRequest.framework}
                      onChange={(e) => setExpertRequest(prev => ({ ...prev, framework: e.target.value }))}
                      placeholder="e.g., SOC 2, GDPR, ISO 27001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="urgency">Urgency *</Label>
                    <select
                      value={expertRequest.urgency}
                      onChange={(e) => setExpertRequest(prev => ({ ...prev, urgency: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low - Within 2 weeks</option>
                      <option value="medium">Medium - Within 1 week</option>
                      <option value="high">High - Within 2 days</option>
                      <option value="emergency">Emergency - Within 24 hours</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget Range *</Label>
                    <select
                      value={expertRequest.budget}
                      onChange={(e) => setExpertRequest(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-500">Under $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2500">$1,000 - $2,500</option>
                      <option value="2500-5000">$2,500 - $5,000</option>
                      <option value="over-5000">Over $5,000</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="format">Preferred Format *</Label>
                    <select
                      value={expertRequest.preferredFormat}
                      onChange={(e) => setExpertRequest(prev => ({ ...prev, preferredFormat: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="video">Video Call</option>
                      <option value="phone">Phone Call</option>
                      <option value="email">Email Consultation</option>
                      <option value="in-person">In-Person Meeting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="timeline">Timeline *</Label>
                  <Input
                    id="timeline"
                    value={expertRequest.timeline}
                    onChange={(e) => setExpertRequest(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="e.g., Need to complete by Q2 2025"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={expertRequest.description}
                    onChange={(e) => setExpertRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your specific needs, current situation, and what you hope to achieve..."
                    rows={5}
                  />
                </div>

                <Button className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Knowledge Base
                  </CardTitle>
                  <CardDescription>
                    Self-service resources and expert guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">SOC 2 Implementation Guide</h4>
                        <p className="text-sm text-slate-600">Step-by-step framework implementation</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">GDPR Compliance Checklist</h4>
                        <p className="text-sm text-slate-600">Complete privacy regulation checklist</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Risk Assessment Templates</h4>
                        <p className="text-sm text-slate-600">Industry-specific assessment templates</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" />
                    Expert Webinars
                  </CardTitle>
                  <CardDescription>
                    On-demand sessions from compliance experts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">SOC 2 in 2025: What's Changed</h4>
                        <p className="text-sm text-slate-600">Dr. Sarah Chen • 45 min</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">GDPR After 5 Years: Lessons Learned</h4>
                        <p className="text-sm text-slate-600">Michael Rodriguez • 38 min</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Cloud Security Best Practices</h4>
                        <p className="text-sm text-slate-600">Priya Patel • 52 min</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Booking Modal */}
        {showBookingModal && selectedExpert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Book Consultation with {selectedExpert.name}</CardTitle>
                <CardDescription>
                  Schedule a consultation to get expert guidance on your compliance needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="consultation-framework">Framework/Topic *</Label>
                    <select
                      value={expertRequest.framework}
                      onChange={(e) => setExpertRequest(prev => ({ ...prev, framework: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select framework</option>
                      {selectedExpert.frameworks.map(framework => (
                        <option key={framework} value={framework}>{framework}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="30">30 minutes - {formatCurrency(selectedExpert.hourlyRate * 0.5)}</option>
                      <option value="60">60 minutes - {formatCurrency(selectedExpert.hourlyRate)}</option>
                      <option value="90">90 minutes - {formatCurrency(selectedExpert.hourlyRate * 1.5)}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="consultation-description">What would you like to discuss? *</Label>
                  <Textarea
                    id="consultation-description"
                    value={expertRequest.description}
                    onChange={(e) => setExpertRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your specific questions or challenges..."
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleBookConsultation}
                    className="flex-1"
                    disabled={!expertRequest.framework || !expertRequest.description}
                  >
                    Book Consultation
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExpertNetwork