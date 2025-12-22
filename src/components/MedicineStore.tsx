import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { medicines, categories } from '@/data/medicines';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, ShoppingCart, Star, Tag } from 'lucide-react';

const MedicineStore: React.FC = () => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.nameHi.includes(searchQuery);
    const matchesCategory =
      selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (medicine: typeof medicines[0]) => {
    addToCart({
      id: medicine.id,
      name: medicine.name,
      nameHi: medicine.nameHi,
      price: medicine.price,
      image: medicine.image,
    });
    toast.success(
      language === 'hi'
        ? `${medicine.nameHi} कार्ट में जोड़ा गया`
        : `${medicine.name} added to cart`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t.medicineStore}
        </h1>
        <p className="text-muted-foreground">
          {language === 'hi'
            ? 'सस्ती और अच्छी गुणवत्ता की दवाइयां'
            : 'Affordable quality medicines'}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.search}
          className="pl-10 border-2 border-input h-12"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="border-2"
          >
            {language === 'hi' ? category.nameHi : category.name}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMedicines.map((medicine) => (
          <Card
            key={medicine.id}
            className="border-2 border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <div className="relative aspect-square bg-muted">
              <img
                src={medicine.image}
                alt={language === 'hi' ? medicine.nameHi : medicine.name}
                className="w-full h-full object-cover"
              />
              {medicine.originalPrice > medicine.price && (
                <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
                  <Tag className="w-3 h-3 mr-1" />
                  {Math.round(((medicine.originalPrice - medicine.price) / medicine.originalPrice) * 100)}% OFF
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                {language === 'hi' ? medicine.nameHi : medicine.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {language === 'hi' ? medicine.descriptionHi : medicine.description}
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-warning fill-current" />
                <span className="text-sm text-muted-foreground">{medicine.rating}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-foreground">
                    ₹{medicine.price}
                  </span>
                  {medicine.originalPrice > medicine.price && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ₹{medicine.originalPrice}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(medicine)}
                  className="gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {language === 'hi' ? 'जोड़ें' : 'Add'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {language === 'hi' ? 'कोई दवाई नहीं मिली' : 'No medicines found'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MedicineStore;
