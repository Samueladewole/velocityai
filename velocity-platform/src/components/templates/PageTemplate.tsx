/**
 * ERIP Page Template
 * Standard page template for consistent layout and visual alignment
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Section,
  PageHeader,
  ButtonGroup
} from '@/components/ui/layout';

interface PageTemplateProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  backLink?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  centered?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  subtitle,
  badge,
  backLink,
  backLabel = 'Back',
  actions,
  children,
  centered = false,
  containerSize = 'xl'
}) => {
  const navigate = useNavigate();

  const headerActions = (
    <ButtonGroup align={centered ? 'center' : 'end'}>
      {backLink && (
        <Button
          variant="outline"
          onClick={() => navigate(backLink)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Button>
      )}
      {actions}
    </ButtonGroup>
  );

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="md" background="muted">
        <Container size={containerSize}>
          <PageHeader
            title={title}
            subtitle={subtitle}
            badge={badge}
            actions={headerActions}
            centered={centered}
          />
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size={containerSize}>
          {children}
        </Container>
      </Section>
    </div>
  );
};

interface FeaturePageTemplateProps extends PageTemplateProps {
  features?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
  metrics?: Array<{
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  }>;
}

/**
 * Feature page template with common sections
 */
export const FeaturePageTemplate: React.FC<FeaturePageTemplateProps> = ({
  features,
  metrics,
  children,
  ...pageProps
}) => {
  return (
    <PageTemplate {...pageProps}>
      {metrics && metrics.length > 0 && (
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-600">
                {metric.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {metric.value}
              </p>
              {metric.trend && (
                <p className={`mt-1 text-sm €{
                  metric.trend === 'up' ? 'text-green-600' :
                  metric.trend === 'down' ? 'text-red-600' :
                  'text-slate-600'
                }`}>
                  {metric.trend === 'up' ? '↑' :
                   metric.trend === 'down' ? '↓' : '→'}
                  {' '}vs last period
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {features && features.length > 0 && (
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <div className="mb-4 text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {children}
    </PageTemplate>
  );
};