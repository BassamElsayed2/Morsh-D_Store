import {
  useEffect,
  useRef,
  useState,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { SizeSelector } from "./SizeSelector";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OptimizedImage } from "./OptimizedImage";
import { PromoBanner } from "./PromoBanner";
import { ShoppingCart, Sparkles, Star, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

// Lazy load Dialog (only needed when user clicks image)
const Dialog = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.Dialog })),
);
const DialogContent = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogContent })),
);

// Lazy load CartDrawer — pulls in Sheet, ScrollArea, Badge, CheckoutForm,
// and 8 lucide icons. Only needed when the user interacts with the cart.
const CartDrawer = lazy(() =>
  import("./CartDrawer").then((m) => ({ default: m.CartDrawer })),
);

// Product images from public/images folder
const productImagePaths = [
  "/images/IMG_9020.webp",
  "/images/IMG_9028.webp",
  "/images/IMG_9008.webp",
  "/images/IMG_9009.webp",
  "/images/IMG_9010.webp",
  "/images/sizes.jpeg",
];

export const ArcadeProduct = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("m");
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const productRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(titleRef.current, { y: -50, opacity: 0, force3D: true });
      gsap.set(imageRef.current, { scale: 0.8, opacity: 0, force3D: true });
      gsap.set(".feature-item", { x: -50, opacity: 0, force3D: true });

      const tl = gsap.timeline();

      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        force3D: true,
      })
        .to(
          imageRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "back.out(1.7)",
            force3D: true,
          },
          0.3, // start at t = 0.3s (overlap with title)
        )
        .to(
          ".feature-item",
          {
            x: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out",
            force3D: true,
          },
          0.6, // start at t = 0.6s
        );

      // ── Continuous animations (transform / opacity only, no reflow) ──
      gsap.to(imageRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true,
      });

      gsap.to(".neon-glow", {
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".morsh-bg", {
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.8,
      });
    }, productRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = useCallback(() => {
    addItem({
      id: "arcade-tshirt",
      name: "DEMENTE BLACK ZIPUP JACKET",
      nameAr: "جاكت ديمنتي الأسود بسوستة",
      size: selectedSize,
      price: 1200,
      image: productImagePaths[selectedImage],
    });

    const isArabic = i18n.language === "ar";

    toast({
      title: isArabic ? "🎮 تمت الإضافة!" : "🎮 PLAYER READY!",
      description: isArabic
        ? `تمت إضافة المقاس ${selectedSize.toUpperCase()} إلى السلة`
        : `Size ${selectedSize.toUpperCase()} added to cart`,
      duration: 3000,
    });

    setIsCartOpen(true);
  }, [selectedSize, selectedImage, addItem, toast, i18n.language]);

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImage(index);

    requestAnimationFrame(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          force3D: true,
        },
      );
    });
  }, []);

  const handleImageClick = useCallback(() => {
    setIsImageModalOpen(true);
  }, []);

  return (
    <div
      ref={productRef}
      className="min-h-screen bg-background relative overflow-hidden pt-12 md:pt-14"
    >
      <PromoBanner />
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <OptimizedImage
          src="/images/back-img.png"
          alt=""
          width={112}
          height={112}
          loading="lazy"
          decoding="async"
          className="morsh-bg absolute top-10 left-5 md:top-20 md:left-10 w-16 h-16 md:w-28 md:h-28 object-contain opacity-5 will-change-[opacity]"
        />
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
          <Suspense
            fallback={
              <Button
                variant="outline"
                size="icon"
                className="neon-border pixel-corners"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            }
          >
            <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
          </Suspense>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-center max-w-7xl mx-auto">
          {/* Product Image */}
          <div className="space-y-3 md:space-y-4">
            <div ref={imageRef} className="relative will-change-transform">
              <div
                className="neon-border pixel-corners bg-card/50 p-3 md:p-5 backdrop-blur-sm group cursor-pointer"
                onClick={handleImageClick}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={productImagePaths[selectedImage]}
                    alt="Arcade T-Shirt"
                    decoding="async"
                    loading="lazy"
                    className="w-full max-h-[350px] md:max-h-[450px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
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
            <div className="grid grid-cols-6 gap-2 md:gap-3">
              {productImagePaths.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`neon-border pixel-corners p-1 md:p-2 bg-card/50 backdrop-blur-sm transition-[transform,opacity,box-shadow,ring-color] duration-300 hover:scale-105 ${
                    selectedImage === index
                      ? "ring-2 md:ring-4 ring-primary shadow-lg shadow-primary/50"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <OptimizedImage
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 768px) 15vw, 100px"
                    className="w-full h-16 md:h-20 object-cover rounded"
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
                t("features", { returnObjects: true }) as Record<
                  string,
                  string
                >,
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

      {/* Image Zoom Modal - Lazy loaded */}
      {isImageModalOpen && (
        <Suspense fallback={null}>
          <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogContent className="max-w-3xl w-[95vw] md:w-full p-2 md:p-4 bg-background/95 backdrop-blur-md border-2 md:border-4 border-primary">
              <div className="relative flex items-center justify-center">
                <OptimizedImage
                  src={productImagePaths[selectedImage]}
                  alt="Arcade T-Shirt Enlarged"
                  width={900}
                  height={1200}
                  loading="eager"
                  sizes="(max-width: 768px) 95vw, 900px"
                  className="w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
        </Suspense>
      )}
    </div>
  );
};
