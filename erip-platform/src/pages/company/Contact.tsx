import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, User } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">ERIP Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-700">
                <User className="h-10 w-10 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Samuel A. Adewole</h2>
                <p className="text-lg text-slate-600">Founder & CEO, ERIP</p>
              </div>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <a 
                    href="mailto:samuel@digitalsecurityinsights.com"
                    className="text-lg text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    samuel@digitalsecurityinsights.com
                  </a>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <a 
                    href="tel:+46735457681"
                    className="text-lg text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    +46 735 457 681
                  </a>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t">
                <p className="text-slate-600">
                  Building the future of Enterprise Risk Intelligence Platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};