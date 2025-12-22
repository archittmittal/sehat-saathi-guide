import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
  const { t, language } = useLanguage();
  const { items, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto border-2 border-border text-center">
          <CardContent className="py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {t.emptyCart}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'hi'
                ? 'आपके कार्ट में कोई आइटम नहीं है'
                : 'Your cart has no items'}
            </p>
            <Button onClick={() => navigate('/store')} className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              {t.continueShopping}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {t.cart} ({itemCount})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border-2 border-border">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={language === 'hi' ? item.nameHi : item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {language === 'hi' ? item.nameHi : item.name}
                    </h3>
                    <p className="text-primary font-bold mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2 border-2 border-border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="border-2 border-border sticky top-24">
            <CardHeader className="bg-secondary">
              <CardTitle className="text-secondary-foreground">
                {language === 'hi' ? 'ऑर्डर सारांश' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>{language === 'hi' ? 'आइटम' : 'Items'}</span>
                <span>{itemCount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{language === 'hi' ? 'उप-कुल' : 'Subtotal'}</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{language === 'hi' ? 'डिलीवरी' : 'Delivery'}</span>
                <span className="text-primary">
                  {language === 'hi' ? 'मुफ्त' : 'FREE'}
                </span>
              </div>
              <div className="border-t-2 border-border pt-4">
                <div className="flex justify-between font-bold text-lg text-foreground">
                  <span>{t.total}</span>
                  <span>₹{total}</span>
                </div>
              </div>
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full gap-2"
                size="lg"
              >
                {t.checkout}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
