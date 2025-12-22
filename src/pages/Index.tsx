import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Activity, Lightbulb, Store, MessageCircle, Building, MapPin } from 'lucide-react';

const Index: React.FC = () => {
  const { t, language } = useLanguage();

  const features = [
    { path: '/symptoms', icon: Activity, label: t.symptomTracker, color: 'bg-chart-1' },
    { path: '/tips', icon: Lightbulb, label: t.healthTips, color: 'bg-chart-2' },
    { path: '/store', icon: Store, label: t.medicineStore, color: 'bg-chart-3' },
    { path: '/assistant', icon: MessageCircle, label: t.aiAssistant, color: 'bg-chart-4' },
    { path: '/schemes', icon: Building, label: t.sarkariYojana, color: 'bg-chart-5' },
    { path: '/nearby', icon: MapPin, label: t.nearbyHospitals, color: 'bg-primary' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 animate-float" />
          </div>
          <h1 className="text-4xl font-bold mb-4">{t.appName}</h1>
          <p className="text-xl opacity-90 max-w-md mx-auto">
            {language === 'hi' ? 'आपका स्वास्थ्य, हमारी प्राथमिकता' : 'Your health, our priority'}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <Link key={feature.path} to={feature.path}>
              <Card className="border-2 border-border hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">{feature.label}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
