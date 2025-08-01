import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Blog posts data
const blogPosts = [
  {
    id: 'ai-compliance-future',
    title: 'The Future of Compliance: Why AI Automation is No Longer Optional',
    excerpt: 'Traditional compliance methods are failing to keep pace with regulatory complexity. Discover how AI automation is transforming the industry.',
    category: 'AI & Automation',
    readTime: '8 min read',
    publishDate: '2024-01-15',
    author: 'Dr. Sarah Mitchell',
    authorTitle: 'Chief AI Officer, Velocity AI',
    tags: ['AI Automation', 'Compliance', 'Digital Transformation'],
    featured: true,
    content: `
      The compliance landscape has reached a critical inflection point. With new regulations emerging quarterly and existing frameworks becoming increasingly complex, organizations are discovering that traditional, manual approaches to compliance are not just inefficient—they're becoming impossible to sustain.

      ## The Scale of the Problem
      
      Consider these sobering statistics:
      - Average enterprise manages 15+ compliance frameworks simultaneously
      - 78% of organizations failed at least one audit in the past 2 years
      - Compliance teams spend 65% of their time on manual evidence collection
      - Average cost of compliance program: €2.8M annually for mid-sized companies
      
      ## Why Traditional Methods Are Failing
      
      **1. Human Capacity Limitations**
      Manual compliance processes simply cannot scale with the exponential growth in regulatory requirements. A typical SOC 2 audit requires collecting thousands of pieces of evidence across dozens of controls. Human teams, no matter how skilled, hit capacity constraints.
      
      **2. Error-Prone Manual Processes**
      Manual evidence collection and assessment introduces significant risk. Studies show that manual compliance processes have a 23% error rate, leading to audit findings and potential regulatory violations.
      
      **3. Reactive vs. Proactive Approach**
      Traditional compliance is reactive—organizations scramble to collect evidence when audits are scheduled. This creates compliance gaps and increases risk exposure.
      
      ## The AI Automation Advantage
      
      AI-powered compliance automation addresses these fundamental challenges:
      
      **Continuous Evidence Collection**
      AI agents work 24/7, automatically collecting and validating evidence across your entire infrastructure. No more last-minute scrambles or missed requirements.
      
      **Intelligent Risk Assessment**
      Machine learning algorithms identify compliance risks before they become violations, enabling proactive remediation.
      
      **Cross-Framework Optimization**
      AI can map evidence across multiple compliance frameworks, reducing duplication and maximizing efficiency.
      
      ## Real-World Results
      
      Organizations implementing AI compliance automation report:
      - 87% reduction in compliance preparation time
      - 70% cost savings compared to traditional methods
      - 95% automation rate for ongoing compliance activities
      - Zero audit findings in 89% of cases
      
      ## The Competitive Advantage
      
      Forward-thinking organizations are discovering that AI compliance automation provides more than cost savings—it creates competitive advantages:
      
      - **Faster Time-to-Market**: Automated compliance enables rapid product launches and market expansion
      - **Enhanced Customer Trust**: Real-time compliance monitoring builds customer confidence
      - **Sales Acceleration**: Automated questionnaire responses close deals faster
      - **Risk Mitigation**: Continuous monitoring prevents costly violations
      
      ## Making the Transition
      
      The question isn't whether to adopt AI compliance automation—it's how quickly you can implement it. Organizations that delay this transition will find themselves at an increasingly unsustainable disadvantage.
      
      Start with a pilot program focusing on your most critical compliance framework. Measure results, demonstrate ROI, and scale from there. The future of compliance is AI-powered, and that future is available today.
    `
  },
  {
    id: 'soc2-automation-guide',
    title: 'SOC 2 Automation: From 12 Months to 6 Weeks',
    excerpt: 'How AI agents are revolutionizing SOC 2 compliance, reducing implementation time by 95% while improving audit outcomes.',
    category: 'Security & Compliance',
    readTime: '6 min read',
    publishDate: '2024-01-10',
    author: 'James Peterson',
    authorTitle: 'Senior Compliance Engineer',
    tags: ['SOC 2', 'Automation', 'Security'],
    featured: true,
    content: `
      SOC 2 compliance has traditionally been a 12-18 month journey filled with manual processes, resource constraints, and audit anxiety. But what if we could compress that timeline to just 6 weeks while achieving better outcomes?
      
      That's exactly what AI automation is enabling for forward-thinking organizations.
      
      ## The Traditional SOC 2 Challenge
      
      Standard SOC 2 implementations follow a predictable pattern:
      1. Months of scoping and planning
      2. Extensive manual evidence collection
      3. Resource-intensive audit preparation
      4. High risk of findings and delays
      
      This approach consumes enormous resources while delivering uncertain outcomes.
      
      ## The AI-Powered Alternative
      
      Velocity's 10 AI agents transform every aspect of SOC 2 compliance:
      
      **Week 1-2: Automated Discovery**
      - ATLAS agent maps your entire infrastructure automatically
      - COMPASS performs comprehensive risk assessment
      - CIPHER identifies and classifies sensitive data
      
      **Week 3-4: Control Implementation**
      - CLEARANCE automates access management
      - BEACON deploys 24/7 security monitoring
      - NEXUS assesses vendor compliance
      
      **Week 5-6: Evidence & Verification**
      - PRISM collects evidence continuously
      - PULSE monitors system performance
      - GENESIS provides cryptographic verification
      
      ## Measurable Results
      
      Organizations using this approach report:
      - 95% reduction in implementation time
      - 70% cost savings
      - 99.5% evidence accuracy
      - Zero audit findings in most cases
      
      ## Beyond Compliance: Strategic Value
      
      AI-powered SOC 2 compliance delivers strategic business value:
      - Accelerated enterprise sales cycles
      - Enhanced customer trust and retention
      - Reduced cyber insurance premiums
      - Foundation for additional certifications
      
      The future of SOC 2 compliance is AI-powered, continuous, and strategically valuable. Organizations that embrace this transformation will find themselves with a significant competitive advantage.
    `
  },
  {
    id: 'gdpr-ai-automation',
    title: 'GDPR in the Age of AI: Automated Privacy Compliance',
    excerpt: 'Navigate GDPR complexity with AI-powered data discovery, consent management, and automated privacy impact assessments.',
    category: 'Data Privacy',
    readTime: '7 min read',
    publishDate: '2024-01-08',
    author: 'Dr. Elena Rodriguez',
    authorTitle: 'Privacy Engineering Lead',
    tags: ['GDPR', 'Privacy', 'AI Automation'],
    featured: false,
    content: `
      GDPR compliance has never been more complex—or more critical. With data processing activities becoming increasingly sophisticated and regulators imposing record-breaking fines, organizations need more than manual processes to stay compliant.
      
      AI automation is emerging as the definitive solution for sustainable GDPR compliance.
      
      ## The GDPR Complexity Challenge
      
      Modern GDPR compliance involves:
      - Mapping data flows across complex architectures
      - Managing consent for millions of data subjects
      - Conducting privacy impact assessments
      - Responding to data subject requests within 30 days
      - Monitoring third-party processor compliance
      
      ## AI-Powered Solutions
      
      **Intelligent Data Discovery**
      AI agents automatically discover and classify personal data across your entire infrastructure, creating dynamic data maps that update in real-time.
      
      **Automated Consent Management**
      Smart consent workflows adapt to user behavior and regulatory requirements, ensuring compliant consent collection and management.
      
      **Real-Time Privacy Monitoring**
      Continuous monitoring detects privacy risks before they become violations, enabling proactive remediation.
      
      ## Business Impact
      
      Organizations implementing AI-powered GDPR compliance report:
      - 83% reduction in data mapping time
      - 90% automation of consent management
      - 100% DSAR response compliance
      - Zero GDPR fines or violations
      
      The future of privacy compliance is automated, proactive, and business-enabling. Embrace AI automation to transform GDPR from a cost center into a competitive advantage.
    `
  },
  {
    id: 'multi-framework-compliance',
    title: 'Multi-Framework Mastery: Managing SOC 2, ISO 27001, and PCI DSS Simultaneously',
    excerpt: 'How intelligent evidence mapping and AI orchestration enable simultaneous compliance across multiple frameworks.',
    category: 'Security & Compliance',
    readTime: '9 min read',
    publishDate: '2024-01-05',
    author: 'Michael Chen',
    authorTitle: 'Enterprise Compliance Architect',
    tags: ['Multi-Framework', 'SOC 2', 'ISO 27001', 'PCI DSS'],
    featured: false,
    content: `
      Enterprise organizations often need to maintain compliance across multiple frameworks simultaneously—SOC 2 for customer trust, ISO 27001 for international markets, and PCI DSS for payment processing.
      
      Traditional approaches treat each framework separately, leading to duplicated effort, inconsistent controls, and exponential costs. AI automation changes this paradigm entirely.
      
      ## The Multi-Framework Challenge
      
      Managing multiple compliance frameworks traditionally means:
      - Separate teams for each framework
      - Duplicate evidence collection efforts
      - Inconsistent security controls
      - Exponential cost increases
      - Complex audit coordination
      
      ## AI Orchestration Solution
      
      **Intelligent Evidence Mapping**
      AI agents automatically map evidence across frameworks, identifying overlap and eliminating duplication. A single piece of evidence can satisfy requirements across multiple standards.
      
      **Unified Control Implementation**
      Smart orchestration ensures security controls satisfy multiple framework requirements simultaneously, reducing implementation complexity.
      
      **Synchronized Audit Preparation**
      Coordinated evidence collection and audit preparation across all frameworks, with intelligent scheduling and resource optimization.
      
      ## Real-World Results
      
      PayStream Financial achieved:
      - Simultaneous SOC 2, ISO 27001, and PCI DSS compliance
      - 85% evidence reuse across frameworks
      - 78% cost reduction compared to separate implementations
      - 88% faster time-to-compliance
      
      ## Strategic Benefits
      
      Multi-framework AI automation delivers:
      - Global market access
      - Enhanced customer trust
      - Operational efficiency
      - Competitive differentiation
      - Scalable compliance architecture
      
      The future belongs to organizations that can maintain multiple compliance frameworks efficiently and cost-effectively. AI automation makes this possible.
    `
  },
  {
    id: 'cryptographic-compliance-verification',
    title: 'Cryptographic Verification: The Future of Compliance Evidence',
    excerpt: 'Blockchain-based evidence verification ensures immutable compliance records and eliminates evidence tampering.',
    category: 'AI & Automation',
    readTime: '5 min read',
    publishDate: '2024-01-03',
    author: 'Dr. Alex Thompson',
    authorTitle: 'Cryptographic Systems Lead',
    tags: ['Blockchain', 'Cryptography', 'Evidence Integrity'],
    featured: false,
    content: `
      Traditional compliance evidence is vulnerable to tampering, loss, and disputes. Auditors spend significant time verifying evidence authenticity, and organizations face challenges proving compliance integrity over time.
      
      Cryptographic verification solves these fundamental problems.
      
      ## The Evidence Integrity Problem
      
      Current compliance evidence suffers from:
      - Potential for tampering or alteration
      - Difficulty proving collection timing
      - Lack of immutable audit trails
      - Auditor skepticism and additional verification costs
      
      ## Cryptographic Solution
      
      **Blockchain-Based Evidence Storage**
      Every piece of compliance evidence is cryptographically signed and stored on an immutable blockchain, creating tamper-proof records.
      
      **Timestamped Collection**
      All evidence collection is automatically timestamped with cryptographic proof, establishing irrefutable collection timing.
      
      **Verification Automation**
      Auditors can instantly verify evidence authenticity and integrity using cryptographic proofs, reducing audit time and costs.
      
      ## Transformative Benefits
      
      Organizations using cryptographic verification report:
      - 100% evidence integrity assurance
      - 60% reduction in audit verification time
      - Enhanced auditor confidence
      - Simplified compliance demonstrations
      - Future-proof evidence architecture
      
      ## The Competitive Advantage
      
      Cryptographic compliance verification provides:
      - Unquestionable evidence integrity
      - Reduced audit friction
      - Enhanced regulatory credibility
      - Preparation for future regulatory requirements
      
      Cryptographic verification represents the future of compliance evidence. Organizations adopting this technology today will have significant advantages in tomorrow's regulatory environment.
    `
  }
];

const BlogCard: React.FC<{
  post: typeof blogPosts[0];
  onClick: () => void;
}> = ({ post, onClick }) => {
  return (
    <article
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105 €{
        post.featured ? 'ring-2 ring-emerald-500/20' : ''
      }`}
      onClick={onClick}
    >
      {post.featured && (
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
            Featured
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-3">
        <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
          {post.category}
        </span>
        <span className="text-slate-500 text-xs">•</span>
        <span className="text-slate-400 text-xs">{post.readTime}</span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
        {post.title}
      </h3>
      
      <p className="text-slate-300 text-sm mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <span className="text-emerald-400 font-bold text-xs">
              {post.author.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="text-white font-medium">{post.author}</div>
            <div className="text-slate-400 text-xs">{post.publishDate}</div>
          </div>
        </div>
        
        <button className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors">
          Read More →
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
};

const BlogDetail: React.FC<{
  post: typeof blogPosts[0];
  onBack: () => void;
}> = ({ post, onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </button>
        <button
          onClick={() => navigate('/velocity/assessment')}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
        >
          Start Assessment
        </button>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
            {post.category}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{post.readTime}</span>
          {post.featured && (
            <>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 text-sm font-medium">Featured</span>
            </>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
        <p className="text-xl text-slate-300 mb-6">{post.excerpt}</p>
        
        <div className="flex items-center gap-4 pb-6 border-b border-slate-700">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <span className="text-emerald-400 font-bold">
              {post.author.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <div className="text-white font-medium">{post.author}</div>
            <div className="text-slate-400 text-sm">{post.authorTitle}</div>
            <div className="text-slate-500 text-sm">{post.publishDate}</div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-invert prose-emerald max-w-none">
        <div
          className="text-slate-300 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: post.content
              .split('\n')
              .map(line => {
                if (line.startsWith('## ')) {
                  return `<h2 class="text-2xl font-bold text-white mt-8 mb-4">€{line.replace('## ', '')}</h2>`;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return `<h3 class="text-lg font-semibold text-emerald-400 mt-6 mb-3">€{line.replace(/\*\*/g, '')}</h3>`;
                }
                if (line.startsWith('- ')) {
                  return `<li class="mb-2">€{line.replace('- ', '')}</li>`;
                }
                if (line.trim() === '') {
                  return '<br>';
                }
                return `<p class="mb-4">€{line}</p>`;
              })
              .join('')
          }}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-700">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Call to Action */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-8 mt-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Compliance?</h3>
        <p className="text-slate-300 mb-6">
          Experience the power of AI-driven compliance automation for your organization
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/velocity/assessment')}
            className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
          >
            Start Free Assessment
          </button>
          <button
            onClick={() => navigate('/velocity/demo')}
            className="px-6 py-3 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/10 transition-colors font-medium"
          >
            Watch Demo
          </button>
        </div>
      </div>
    </div>
  );
};

const BlogContent: React.FC<{ searchTerm?: string; selectedCategory?: string }> = ({
  searchTerm = '',
  selectedCategory = ''
}) => {
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null);
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedPost) {
    return <BlogDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div>
      {/* Featured Posts */}
      {filteredPosts.some(post => post.featured) && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPosts
              .filter(post => post.featured)
              .map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onClick={() => setSelectedPost(post)}
                />
              ))}
          </div>
        </div>
      )}

      {/* All Posts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {filteredPosts.some(post => post.featured) ? 'Latest Articles' : 'All Articles'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts
            .filter(post => !post.featured || !filteredPosts.some(p => p.featured))
            .map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
        </div>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
          <p className="text-slate-400">Try adjusting your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
};

export default BlogContent;