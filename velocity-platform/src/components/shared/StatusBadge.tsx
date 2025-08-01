import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
      case 'compliant':
      case 'production':
      case 'implemented':
      case 'fully_compliant':
        return 'text-green-600 bg-green-50';
      case 'processing':
      case 'review':
      case 'needs_review':
      case 'testing':
      case 'pending':
      case 'partial':
        return 'text-blue-600 bg-blue-50';
      case 'development':
      case 'draft':
        return 'text-yellow-600 bg-yellow-50';
      case 'overdue':
      case 'rejected':
      case 'non_compliant':
      case 'deprecated':
      case 'failed':
      case 'not_implemented':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Badge className={`€{getStatusColor(status)} €{className}`}>
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};