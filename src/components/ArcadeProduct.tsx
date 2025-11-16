import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { SizeSelector } from './SizeSelector';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShoppingCart, Sparkles, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import arcadeTshirt from '@/assets/arcade-tshirt.jpg';

export const ArcadeProduct = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>('m');
  const productRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Image animation with scale and glow
      gsap.from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'back.out(1.7)',
        delay: 0.3,
      });

      // Features stagger animation
      gsap.from('.feature-item', {
        x: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.6,
      });

      // Floating animation for image
      gsap.to(imageRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Pulsing glow effect
      gsap.to('.neon-glow', {
        textShadow: '0 0 20px hsl(var(--neon-glow)), 0 0 40px hsl(var(--neon-glow)), 0 0 60px hsl(var(--neon-glow))',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, productRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    // Animate button
    gsap.to('.add-to-cart-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    toast({
      title: "🎮 PLAYER READY!",
      description: `Size ${selectedSize.toUpperCase()} added to cart - Game On!`,
      duration: 3000,
    });
  };

  return (
    <div ref={productRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-primary/30 pixel-corners" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-secondary/30 pixel-corners" />
        <div className="absolute top-1/2 right-20 w-16 h-16 border-4 border-accent/30 pixel-corners" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold neon-glow uppercase tracking-wider">{t('brandName')}</span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Product Image */}
          <div ref={imageRef} className="relative">
            <div className="neon-border pixel-corners bg-card/50 p-8 backdrop-blur-sm">
              <img
                src={arcadeTshirt}
                alt="Arcade T-Shirt"
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute -top-4 -right-4 bg-secondary text-secondary-foreground px-6 py-2 font-bold text-xl neon-border pixel-corners">
                NEW!
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 ref={titleRef} className="text-6xl font-bold neon-glow uppercase tracking-wider mb-2">
                {t('title')}
              </h1>
              <p className="text-secondary text-2xl font-bold uppercase tracking-wide">
                {t('subtitle')}
              </p>
            </div>

            <div className="neon-border pixel-corners bg-card/50 p-6 backdrop-blur-sm">
              <p className="text-foreground/90 text-lg leading-relaxed">
                {t('description')}
              </p>
            </div>

            {/* Features */}
            <div ref={featuresRef} className="grid grid-cols-3 gap-4">
              {Object.entries(t('features', { returnObjects: true }) as Record<string, string>).map(([key, value]) => (
                <div
                  key={key}
                  className="feature-item neon-border pixel-corners bg-muted p-4 text-center"
                >
                  <Star className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-sm font-bold uppercase text-foreground">{value}</p>
                </div>
              ))}
            </div>

            {/* Size Selector */}
            <SizeSelector onSizeSelect={setSelectedSize} />

            {/* Price & Add to Cart */}
            <div className="neon-border pixel-corners bg-card/50 p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-5xl font-bold text-accent neon-glow">
                  {t('price')}
                </span>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="add-to-cart-btn arcade-button bg-secondary text-secondary-foreground hover:bg-secondary/90 px-12 py-6 text-2xl font-bold uppercase tracking-wider"
                >
                  <ShoppingCart className="mr-2 w-6 h-6" />
                  {t('addToCart')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer decoration */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
    </div>
  );
};
