import React from 'react';
import { Card, CardContent, CardHeader } from './card';
import { cn } from '@/lib/utils';

interface AlignedCardProps {
  children: React.ReactNode;
  className?: string;
}

interface AlignedCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface AlignedCardContentProps {
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export const AlignedCard: React.FC<AlignedCardProps> = ({ children, className }) => {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      {children}
    </Card>
  );
};

export const AlignedCardHeader: React.FC<AlignedCardHeaderProps> = ({ children, className }) => {
  return (
    <CardHeader className={cn("pb-4", className)}>
      {children}
    </CardHeader>
  );
};

export const AlignedCardContent: React.FC<AlignedCardContentProps> = ({ 
  children, 
  className,
  footer 
}) => {
  return (
    <CardContent className={cn("pt-0 flex-grow flex flex-col pb-6", className)}>
      <div className="flex-grow">
        {children}
      </div>
      {footer && (
        <div className="mt-auto pt-4">
          {footer}
        </div>
      )}
    </CardContent>
  );
};