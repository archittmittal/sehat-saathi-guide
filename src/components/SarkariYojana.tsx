import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { governmentSchemes } from '@/data/schemes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

const SarkariYojana: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t.governmentSchemes}
        </h1>
        <p className="text-muted-foreground">
          {language === 'hi'
            ? 'सरकारी स्वास्थ्य योजनाएं जो आपके लिए उपलब्ध हैं'
            : 'Government health schemes available for you'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {governmentSchemes.map((scheme) => (
          <Card
            key={scheme.id}
            className="border-2 border-border shadow-sm hover:shadow-lg transition-all"
          >
            <CardHeader className="bg-secondary">
              <CardTitle className="flex items-center gap-3 text-secondary-foreground">
                <span className="text-4xl">{scheme.icon}</span>
                <span className="text-lg">
                  {language === 'hi' ? scheme.nameHi : scheme.name}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-muted-foreground">
                {language === 'hi' ? scheme.descriptionHi : scheme.description}
              </p>
              
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {t.eligibility}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'hi' ? scheme.eligibilityHi : scheme.eligibility}
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2 border-2"
                onClick={() => window.open(scheme.link, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                {t.apply}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SarkariYojana;
