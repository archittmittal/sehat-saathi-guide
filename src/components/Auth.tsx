import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Heart, Mail, Lock, User, Phone } from 'lucide-react';

const Auth: React.FC = () => {
  const { t, language } = useLanguage();
  const { login, register, verifyOtp, pendingVerification } = useAuth();
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(loginData.email, loginData.password);
    setLoading(false);
    if (success) {
      toast.success(language === 'hi' ? 'लॉगिन सफल!' : 'Login successful!');
      navigate('/');
    } else {
      toast.error(language === 'hi' ? 'गलत ईमेल या पासवर्ड' : 'Invalid email or password');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register(registerData.name, registerData.email, registerData.phone, registerData.password);
    setLoading(false);
    toast.success(language === 'hi' ? 'OTP भेजा गया' : 'OTP sent');
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    const success = await verifyOtp(otp);
    setLoading(false);
    if (success) {
      toast.success(language === 'hi' ? 'रजिस्ट्रेशन सफल!' : 'Registration successful!');
      navigate('/');
    } else {
      toast.error(language === 'hi' ? 'गलत OTP' : 'Invalid OTP');
    }
  };

  if (pendingVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
        <Card className="w-full max-w-md border-2 border-border">
          <CardHeader className="text-center bg-primary text-primary-foreground">
            <CardTitle>{t.verifyOtp}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-center text-muted-foreground">
              {language === 'hi' ? 'आपके फोन पर OTP भेजा गया है' : 'OTP has been sent to your phone'}
            </p>
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" className="text-center text-2xl tracking-widest border-2" maxLength={6} />
            <Button onClick={handleVerifyOtp} className="w-full" disabled={loading}>{t.verifyOtp}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <Card className="w-full max-w-md border-2 border-border">
        <CardHeader className="text-center bg-primary text-primary-foreground">
          <div className="flex justify-center mb-2">
            <Heart className="w-10 h-10" />
          </div>
          <CardTitle>{t.appName}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t.login}</TabsTrigger>
              <TabsTrigger value="register">{t.register}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div><Label>{t.email}</Label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="email" value={loginData.email} onChange={(e) => setLoginData(p => ({...p, email: e.target.value}))} className="pl-10 border-2" /></div></div>
                <div><Label>{t.password}</Label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="password" value={loginData.password} onChange={(e) => setLoginData(p => ({...p, password: e.target.value}))} className="pl-10 border-2" /></div></div>
                <Button type="submit" className="w-full" disabled={loading}>{t.login}</Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div><Label>{t.name}</Label><div className="relative mt-1"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={registerData.name} onChange={(e) => setRegisterData(p => ({...p, name: e.target.value}))} className="pl-10 border-2" /></div></div>
                <div><Label>{t.email}</Label><div className="relative mt-1"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="email" value={registerData.email} onChange={(e) => setRegisterData(p => ({...p, email: e.target.value}))} className="pl-10 border-2" /></div></div>
                <div><Label>{t.phone}</Label><div className="relative mt-1"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="tel" value={registerData.phone} onChange={(e) => setRegisterData(p => ({...p, phone: e.target.value}))} className="pl-10 border-2" /></div></div>
                <div><Label>{t.password}</Label><div className="relative mt-1"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="password" value={registerData.password} onChange={(e) => setRegisterData(p => ({...p, password: e.target.value}))} className="pl-10 border-2" /></div></div>
                <Button type="submit" className="w-full" disabled={loading}>{t.register}</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
