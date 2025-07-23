/**
 * Trust Score Sharing System
 * 
 * Public profile pages, shareable URLs, and embeddable trust badges
 * for showcasing Trust Equity™ to prospects and partners.
 */

import React, { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  Share2, 
  Copy, 
  Eye, 
  EyeOff,
  Edit,
  Download,
  Code,
  Globe,
  Shield,
  Award,
  TrendingUp,
  Users,
  Calendar,
  ExternalLink
} from 'lucide-react'

interface TrustProfile {
  organizationId: string
  displayName: string
  industry: string
  trustScore: number
  tier: {
    level: string
    color: string
    badgeUrl: string
  }
  lastUpdated: Date
  publicProfile: boolean
  customizations: {
    displayName?: string
    description?: string
    logoUrl?: string
    website?: string
    brandColors?: {
      primary: string
      secondary: string
    }
  }
  metrics: {
    totalActivities: number
    frameworksCovered: number
    consecutiveDays: number
    peerValidations: number
  }
  achievements: Array<{
    title: string
    description: string
    achievedAt: Date
    badgeUrl: string
  }>
}

interface ShareableUrl {
  id: string
  url: string
  shortUrl: string
  createdAt: Date
  expiresAt?: Date
  accessCount: number
  isActive: boolean
  customizations: {
    title?: string
    description?: string
    hideDetails?: boolean
  }
}

export const TrustScoreSharing: React.FC<{
  organizationId: string
}> = ({ organizationId }) => {
  const [profile, setProfile] = useState<TrustProfile | null>(null)
  const [shareableUrls, setShareableUrls] = useState<ShareableUrl[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'public' | 'sharing' | 'embed'>('public')
  const [showCustomization, setShowCustomization] = useState(false)

  useEffect(() => {
    loadSharingData()
  }, [organizationId])

  const loadSharingData = async () => {
    try {
      setIsLoading(true)
      
      const [profileRes, urlsRes] = await Promise.all([
        fetch(`/api/trust-score/organizations/${organizationId}/profile`),
        fetch(`/api/trust-score/organizations/${organizationId}/share-urls`)
      ])

      const [profileData, urlsData] = await Promise.all([
        profileRes.json(),
        urlsRes.json()
      ])

      setProfile(profileData)
      setShareableUrls(urlsData.urls || [])
      
    } catch (error) {
      console.error('Failed to load sharing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePublicProfile = async () => {
    if (!profile) return

    try {
      const response = await fetch(`/api/trust-score/organizations/${organizationId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicProfile: !profile.publicProfile
        })
      })

      const updatedProfile = await response.json()
      setProfile(updatedProfile)

    } catch (error) {
      console.error('Failed to toggle public profile:', error)
    }
  }

  const createShareableUrl = async (customizations: any = {}) => {
    try {
      const response = await fetch(`/api/trust-score/organizations/${organizationId}/share-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expiresIn: 30 * 24 * 60 * 60, // 30 days
          customizations,
          createdBy: 'user' // Would come from auth context
        })
      })

      const result = await response.json()
      
      if (result.success) {
        await loadSharingData() // Refresh the list
        await navigator.clipboard.writeText(result.url)
        // Show success notification
        alert('Shareable link created and copied to clipboard!')
      }

    } catch (error) {
      console.error('Failed to create shareable URL:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Show success notification
      alert('Copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const generateEmbedCode = (type: 'badge' | 'score' | 'profile') => {
    const baseUrl = window.location.origin
    
    switch (type) {
      case 'badge':
        return `<img src="${baseUrl}/api/trust-score/badge/${organizationId}/svg?style=minimal" alt="Trust Score Badge" />`
      
      case 'score':
        return `<div id="trust-score-${organizationId}"></div>
<script src="${baseUrl}/api/trust-score/badge/${organizationId}/embed.js"></script>`
      
      case 'profile':
        return `<iframe src="${baseUrl}/public/${organizationId}" width="400" height="300" frameborder="0"></iframe>`
      
      default:
        return ''
    }
  }

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <Card className="h-64 animate-pulse bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trust Score Sharing</h1>
          <p className="text-gray-600 mt-1">Share your Trust Equity™ with the world</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'public', label: 'Public Profile', icon: Globe },
            { key: 'sharing', label: 'Shareable Links', icon: Share2 },
            { key: 'embed', label: 'Embed & Badges', icon: Code }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Public Profile Tab */}
      {activeTab === 'public' && (
        <div className="space-y-6">
          {/* Profile Status */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Public Profile Status</h2>
              <Button
                onClick={togglePublicProfile}
                variant={profile.publicProfile ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                {profile.publicProfile ? <Eye size={16} /> : <EyeOff size={16} />}
                {profile.publicProfile ? 'Public' : 'Private'}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Profile Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Display Name</span>
                    <span className="font-medium">{profile.displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Industry</span>
                    <span className="font-medium">{profile.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trust Score</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{profile.trustScore}</span>
                      <Badge 
                        style={{ backgroundColor: profile.tier.color, color: 'white' }}
                      >
                        {profile.tier.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Public URL</span>
                    <a 
                      href={`/public/${organizationId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      View Profile <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Trust Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{profile.metrics.totalActivities}</div>
                    <div className="text-xs text-gray-600">Activities</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{profile.metrics.frameworksCovered}</div>
                    <div className="text-xs text-gray-600">Frameworks</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{profile.metrics.consecutiveDays}</div>
                    <div className="text-xs text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{profile.metrics.peerValidations}</div>
                    <div className="text-xs text-gray-600">Validations</div>
                  </div>
                </div>
              </div>
            </div>

            {!profile.publicProfile && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <EyeOff size={16} />
                  <span className="font-medium">Profile is Private</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Enable public profile to share your Trust Score with prospects and partners.
                </p>
              </div>
            )}
          </Card>

          {/* Preview */}
          {profile.publicProfile && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Public Profile Preview</h2>
                <Button variant="outline" size="sm">
                  <Edit size={16} className="mr-2" />
                  Customize
                </Button>
              </div>

              <div className="border rounded-lg p-6 bg-white">
                <PublicProfilePreview profile={profile} />
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Shareable Links Tab */}
      {activeTab === 'sharing' && (
        <div className="space-y-6">
          {/* Create New Link */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Create Shareable Link</h2>
              <Button onClick={() => createShareableUrl()}>
                <Share2 size={16} className="mr-2" />
                Create Link
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                onClick={() => createShareableUrl({ title: 'Sales Proposal Trust Score' })}
                className="h-20 flex-col gap-2"
              >
                <Users size={20} />
                <span className="text-sm">For Sales</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => createShareableUrl({ title: 'Partnership Trust Verification' })}
                className="h-20 flex-col gap-2"
              >
                <Shield size={20} />
                <span className="text-sm">For Partners</span>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => createShareableUrl({ title: 'Compliance Trust Report', hideDetails: false })}
                className="h-20 flex-col gap-2"
              >
                <Award size={20} />
                <span className="text-sm">For Auditors</span>
              </Button>
            </div>
          </Card>

          {/* Active Links */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active Shareable Links</h2>
            
            {shareableUrls.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Share2 size={32} className="mx-auto mb-2 opacity-50" />
                <div>No shareable links created</div>
                <div className="text-sm">Create your first link to start sharing your Trust Score</div>
              </div>
            ) : (
              <div className="space-y-4">
                {shareableUrls.map((url) => (
                  <div key={url.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium">
                          {url.customizations.title || 'Trust Score Share'}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {url.url}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {url.accessCount} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Created {new Date(url.createdAt).toLocaleDateString()}
                          </span>
                          {url.expiresAt && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              Expires {new Date(url.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(url.url)}
                        >
                          <Copy size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(url.shortUrl)}
                        >
                          Short URL
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Embed & Badges Tab */}
      {activeTab === 'embed' && (
        <div className="space-y-6">
          {/* Trust Badge */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Trust Score Badge</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50 text-center">
                  <img 
                    src={`/api/trust-score/badge/${organizationId}/svg?style=minimal`}
                    alt="Trust Score Badge"
                    className="mx-auto"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Embed Code</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg text-sm font-mono">
                  <code>{generateEmbedCode('badge')}</code>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(generateEmbedCode('badge'))}
                >
                  <Copy size={16} className="mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>
          </Card>

          {/* Interactive Widget */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Interactive Widget</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Preview</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: profile.tier.color }}>
                      {profile.trustScore}
                    </div>
                    <div className="text-sm text-gray-600">Trust Score</div>
                    <Badge 
                      style={{ backgroundColor: profile.tier.color, color: 'white' }}
                      className="mt-2"
                    >
                      {profile.tier.level}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">JavaScript Embed</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg text-sm font-mono">
                  <code>{generateEmbedCode('score')}</code>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(generateEmbedCode('score'))}
                >
                  <Copy size={16} className="mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>
          </Card>

          {/* Full Profile Embed */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Full Profile Embed</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Preview</h3>
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <iframe 
                    src={`/public/${organizationId}`}
                    width="100%" 
                    height="300" 
                    frameBorder="0"
                    title="Trust Profile Embed Preview"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">iFrame Embed</h3>
                <div className="bg-gray-900 text-white p-4 rounded-lg text-sm font-mono">
                  <code>{generateEmbedCode('profile')}</code>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => copyToClipboard(generateEmbedCode('profile'))}
                >
                  <Copy size={16} className="mr-2" />
                  Copy Code
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// Public Profile Preview Component
const PublicProfilePreview: React.FC<{ profile: TrustProfile }> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        {profile.customizations.logoUrl && (
          <img 
            src={profile.customizations.logoUrl} 
            alt={profile.displayName}
            className="w-16 h-16 mx-auto mb-4 rounded-full"
          />
        )}
        <h1 className="text-2xl font-bold">{profile.displayName}</h1>
        <p className="text-gray-600">{profile.industry}</p>
        {profile.customizations.description && (
          <p className="text-gray-700 mt-2">{profile.customizations.description}</p>
        )}
      </div>

      {/* Trust Score */}
      <div className="text-center">
        <div className="text-5xl font-bold mb-2" style={{ color: profile.tier.color }}>
          {profile.trustScore}
        </div>
        <Badge 
          style={{ backgroundColor: profile.tier.color, color: 'white' }}
          className="text-lg px-4 py-2"
        >
          {profile.tier.level}
        </Badge>
        <p className="text-sm text-gray-600 mt-2">
          Last updated {new Date(profile.lastUpdated).toLocaleDateString()}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{profile.metrics.totalActivities}</div>
          <div className="text-sm text-gray-600">Trust Activities</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{profile.metrics.frameworksCovered}</div>
          <div className="text-sm text-gray-600">Frameworks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{profile.metrics.consecutiveDays}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{profile.metrics.peerValidations}</div>
          <div className="text-sm text-gray-600">Peer Reviews</div>
        </div>
      </div>

      {/* Achievements */}
      {profile.achievements.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profile.achievements.slice(0, 4).map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img src={achievement.badgeUrl} alt={achievement.title} className="w-8 h-8" />
                <div>
                  <div className="font-medium text-sm">{achievement.title}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(achievement.achievedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      {profile.customizations.website && (
        <div className="text-center pt-4 border-t">
          <a 
            href={profile.customizations.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
          >
            <Globe size={16} />
            Visit Website
          </a>
        </div>
      )}
    </div>
  )
}

export default TrustScoreSharing