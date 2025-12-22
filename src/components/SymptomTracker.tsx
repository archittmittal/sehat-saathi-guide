import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Symptom } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Calendar, Clock, FileText } from 'lucide-react';

const SymptomTracker: React.FC = () => {
  const { t, language } = useLanguage();
  const [symptoms, setSymptoms] = useState<Symptom[]>(() => {
    const saved = localStorage.getItem('symptoms');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSymptom, setNewSymptom] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  const handleAdd = () => {
    const trimmedSymptom = newSymptom.trim();
    
    if (!trimmedSymptom) {
      setError(t.emptySymptomError);
      toast.error(t.emptySymptomError);
      return;
    }

    const now = new Date();
    const newSymptomData: Symptom = {
      id: Date.now().toString(),
      name: trimmedSymptom,
      description: newDescription.trim(),
      date: now.toLocaleDateString(language === 'en' ? 'en-IN' : 'hi-IN'),
      time: now.toLocaleTimeString(language === 'en' ? 'en-IN' : 'hi-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setSymptoms((prev) => [newSymptomData, ...prev]);
    setNewSymptom('');
    setNewDescription('');
    setError('');
    
    toast.success(language === 'hi' ? 'लक्षण जोड़ा गया! क्या कोई और लक्षण है?' : 'Symptom added! Any other symptoms?');
  };

  const handleDelete = (id: string) => {
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
    toast.success(language === 'hi' ? 'लक्षण हटा दिया गया' : 'Symptom removed');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 border-2 border-border shadow-md">
        <CardHeader className="bg-secondary">
          <CardTitle className="flex items-center gap-3 text-secondary-foreground">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary-foreground" />
            </div>
            {t.addSymptom}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Input
                value={newSymptom}
                onChange={(e) => {
                  setNewSymptom(e.target.value);
                  if (error) setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder={t.symptomName}
                className={`border-2 ${error ? 'border-destructive' : 'border-input'}`}
              />
              {error && (
                <p className="text-destructive text-sm mt-1">{error}</p>
              )}
            </div>
            
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder={t.symptomDescription}
              className="border-2 border-input min-h-[80px]"
            />
            
            <Button onClick={handleAdd} className="w-full gap-2" size="lg">
              <Plus className="w-5 h-5" />
              {t.addSymptom}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          {language === 'hi' ? 'आपके लक्षण' : 'Your Symptoms'}
        </h2>
        
        {symptoms.length === 0 ? (
          <Card className="border-2 border-dashed border-border">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t.noSymptoms}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {symptoms.map((symptom) => (
              <Card key={symptom.id} className="border-2 border-border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {symptom.name}
                      </h3>
                      {symptom.description && (
                        <p className="text-muted-foreground text-sm mb-3">
                          {symptom.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {symptom.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {symptom.time}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(symptom.id)}
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomTracker;
