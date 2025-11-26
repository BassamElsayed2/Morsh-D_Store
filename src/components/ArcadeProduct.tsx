import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { SizeSelector } from "./SizeSelector";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CartDrawer } from "./CartDrawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ShoppingCart, Sparkles, Star, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import arcadeTshirt from "@/assets/arcade-tshirt.jpg";

export const ArcadeProduct = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("m");
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const productRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Array of product images (for now using the same image, you can add more)
  const productImages = [
    arcadeTshirt,
    arcadeTshirt, // Replace with different image paths when available
    arcadeTshirt, // Replace with different image paths when available
    arcadeTshirt, // Replace with different image paths when available
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Image animation with scale and glow
      gsap.from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.3,
      });

      // Features stagger animation
      gsap.from(".feature-item", {
        x: -50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.6,
      });

      // Floating animation for image
      gsap.to(imageRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Pulsing glow effect - using opacity instead of textShadow
      gsap.to(".neon-glow", {
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, productRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = () => {
    // Animate button
    gsap.to(".add-to-cart-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    // Add item to cart
    addItem({
      id: "arcade-tshirt",
      name: "Arcade Edition T-Shirt",
      nameAr: "قميص إصدار أركيد",
      size: selectedSize,
      price: 29.99,
      image: productImages[selectedImage],
    });

    const isArabic = i18n.language === "ar";

    toast({
      title: isArabic ? "🎮 تمت الإضافة!" : "🎮 PLAYER READY!",
      description: isArabic
        ? `تمت إضافة المقاس ${selectedSize.toUpperCase()} إلى السلة`
        : `Size ${selectedSize.toUpperCase()} added to cart - Game On!`,
      duration: 3000,
    });
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
    // Animate image change
    gsap.fromTo(
      imageRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  };

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  return (
    <div
      ref={productRef}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-5 left-5 md:top-10 md:left-10 w-12 h-12 md:w-20 md:h-20 border-2 md:border-4 border-primary/30 pixel-corners" />
        <div className="absolute bottom-5 right-5 md:bottom-10 md:right-10 w-20 h-20 md:w-32 md:h-32 border-2 md:border-4 border-secondary/30 pixel-corners" />
        <div className="hidden md:block absolute top-1/2 right-20 w-16 h-16 border-4 border-accent/30 pixel-corners" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-4 md:py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <span className="text-lg md:text-2xl font-bold neon-glow uppercase tracking-wider">
            {t("brandName")}
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <CartDrawer />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center max-w-7xl mx-auto">
          {/* Product Image */}
          <div className="space-y-3 md:space-y-4">
            <div ref={imageRef} className="relative">
              <div
                className="neon-border pixel-corners bg-card/50 p-4 md:p-8 backdrop-blur-sm group cursor-pointer"
                onClick={handleImageClick}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={productImages[selectedImage]}
                    alt="Arcade T-Shirt"
                    className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Zoom icon overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg pointer-events-none">
                    <Maximize2 className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-secondary text-secondary-foreground px-3 py-1 md:px-6 md:py-2 font-bold text-sm md:text-xl neon-border pixel-corners pointer-events-none">
                  {t("new")}
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2 md:gap-3">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`neon-border pixel-corners p-1 md:p-2 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    selectedImage === index
                      ? "ring-2 md:ring-4 ring-primary shadow-lg shadow-primary/50"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-auto rounded"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 md:space-y-8">
            <div>
              <h1
                ref={titleRef}
                className="text-3xl md:text-5xl lg:text-6xl font-bold neon-glow uppercase tracking-wider mb-2"
              >
                {t("title")}
              </h1>
              <p className="text-secondary text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wide">
                {t("subtitle")}
              </p>
            </div>

            <div className="neon-border pixel-corners bg-card/50 p-4 md:p-6 backdrop-blur-sm">
              <p className="text-foreground/90 text-base md:text-lg leading-relaxed">
                {t("description")}
              </p>
            </div>

            {/* Features */}
            <div ref={featuresRef} className="grid grid-cols-3 gap-2 md:gap-4">
              {Object.entries(
                t("features", { returnObjects: true }) as Record<string, string>
              ).map(([key, value]) => (
                <div
                  key={key}
                  className="feature-item neon-border pixel-corners bg-muted p-2 md:p-4 text-center"
                >
                  <Star className="w-4 h-4 md:w-6 md:h-6 text-accent mx-auto mb-1 md:mb-2" />
                  <p className="text-xs md:text-sm font-bold uppercase text-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Size Selector */}
            <SizeSelector onSizeSelect={setSelectedSize} />

            {/* Price & Add to Cart */}
            <div className="neon-border pixel-corners bg-card/50 p-4 md:p-6 backdrop-blur-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent neon-glow">
                  {t("price")}
                </span>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="add-to-cart-btn arcade-button bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto px-6 md:px-12 py-4 md:py-6 text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider"
                >
                  <ShoppingCart className="mr-2 w-5 h-5 md:w-6 md:h-6" />
                  {t("addToCart")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer decoration */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

      {/* Image Zoom Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-5xl w-[95vw] md:w-full p-2 md:p-4 bg-background/95 backdrop-blur-md border-2 md:border-4 border-primary">
          <div className="relative">
            <img
              src={productImages[selectedImage]}
              alt="Arcade T-Shirt Enlarged"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
