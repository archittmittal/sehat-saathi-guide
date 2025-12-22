import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.welcomeMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Basic symptom-based responses in Hindi
    if (lowerMessage.includes('बुखार') || lowerMessage.includes('fever')) {
      return language === 'hi'
        ? 'बुखार कितने दिनों से है? और क्या कोई और तकलीफ भी है जैसे सर्दी, खांसी, या शरीर में दर्द?'
        : 'How many days have you had fever? Do you have any other problems like cold, cough, or body pain?';
    }
    
    if (lowerMessage.includes('पेट') || lowerMessage.includes('stomach') || lowerMessage.includes('दर्द')) {
      return language === 'hi'
        ? 'पेट में दर्द कहां है? क्या खाने के बाद बढ़ता है? उल्टी या दस्त हो रहे हैं क्या?'
        : 'Where is the stomach pain? Does it increase after eating? Do you have vomiting or loose motions?';
    }
    
    if (lowerMessage.includes('सर्दी') || lowerMessage.includes('cold') || lowerMessage.includes('खांसी') || lowerMessage.includes('cough')) {
      return language === 'hi'
        ? 'खांसी में बलगम आता है क्या? सांस लेने में दिक्कत तो नहीं? कितने दिनों से है?'
        : 'Do you have phlegm with cough? Any difficulty breathing? How many days have you had this?';
    }

    if (lowerMessage.includes('सिर') || lowerMessage.includes('head') || lowerMessage.includes('headache')) {
      return language === 'hi'
        ? 'सिर में दर्द कब से है? क्या रोशनी से दिक्कत होती है? उल्टी जैसा लगता है क्या?'
        : 'How long have you had headache? Does light bother you? Do you feel like vomiting?';
    }

    if (lowerMessage.includes('चक्कर') || lowerMessage.includes('dizzy')) {
      return language === 'hi'
        ? 'चक्कर कब आते हैं - खड़े होने पर या हमेशा? खाना ठीक से खा रहे हैं? पानी कम तो नहीं पी रहे?'
        : 'When do you feel dizzy - when standing or always? Are you eating properly? Drinking enough water?';
    }

    if (lowerMessage.includes('गंभीर') || lowerMessage.includes('serious') || lowerMessage.includes('बहुत') || lowerMessage.includes('तेज')) {
      return language === 'hi'
        ? '⚠️ आपकी स्थिति गंभीर लग रही है। कृपया देर न करें, तुरंत डॉक्टर को दिखाएं या नजदीकी अस्पताल जाएं।'
        : '⚠️ Your condition seems serious. Please do not delay, see a doctor immediately or go to the nearest hospital.';
    }

    if (lowerMessage.includes('ठीक') || lowerMessage.includes('हल्का') || lowerMessage.includes('कम') || lowerMessage.includes('better') || lowerMessage.includes('mild')) {
      return language === 'hi'
        ? '✅ अगर तकलीफ हल्की है, तो आप घर पर आराम करें, पानी पिएं, और हल्का खाना खाएं। अगर 2-3 दिन में ठीक न हो, तो डॉक्टर को दिखाएं।'
        : '✅ If the problem is mild, rest at home, drink water, and eat light food. If not better in 2-3 days, see a doctor.';
    }

    // Default response
    return language === 'hi'
      ? 'मैं समझ रहा हूं। कृपया थोड़ा और बताएं - यह तकलीफ कब से है और कितनी तेज है?'
      : 'I understand. Please tell me more - how long have you had this problem and how severe is it?';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto border-2 border-border shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            {t.aiAssistant}
          </CardTitle>
        </CardHeader>
        
        <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-secondary'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-secondary p-3 rounded-lg">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <CardContent className="border-t-2 border-border p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.askHealth}
              className="border-2 border-input"
            />
            <Button onClick={handleSend} size="icon" className="flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
