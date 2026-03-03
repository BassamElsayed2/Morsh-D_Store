import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
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
import { CheckoutForm, type FormData } from "./CheckoutForm";
import {
  Sparkles,
  Star,
  Maximize2,
  Send,
  Plus,
  Minus,
  Tag,
  CheckCircle2,
  X,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { getDeliveryFee } from "@/lib/delivery";
import { trackPurchase } from "@/lib/metaPixel";

const VALID_COUPON = "MD200";
const COUPON_DISCOUNT_PER_ITEM = 200;

// Lazy load Dialog (only needed when user clicks image)
const Dialog = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.Dialog })),
);
const DialogContent = lazy(() =>
  import("@/components/ui/dialog").then((m) => ({ default: m.DialogContent })),
);

const PRODUCT_NAME = "DEMENTE BLACK ZIPUP JACKET";
const PRODUCT_NAME_AR = "جاكت ديمنتي الأسود بسوستة";
const PRODUCT_PRICE = 1200;
const WHATSAPP_NUMBER = "201013816187";

interface OrderItem {
  size: string;
  quantity: number;
}

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
  const [selectedSize, setSelectedSize] = useState<string>("m");
  const [currentQty, setCurrentQty] = useState<number>(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [couponInput, setCouponInput] = useState<string>("");
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<boolean>(false);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  const productRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

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
          0.3,
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
          0.6,
        );

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

  // ── Computed values ──────────────────────────────────────────────────────────
  const totalItems = useMemo(
    () => orderItems.reduce((sum, i) => sum + i.quantity, 0),
    [orderItems],
  );

  const subtotal = useMemo(() => PRODUCT_PRICE * totalItems, [totalItems]);

  const discountAmount = useMemo(
    () =>
      isCouponApplied
        ? Math.min(totalItems * COUPON_DISCOUNT_PER_ITEM, subtotal)
        : 0,
    [isCouponApplied, totalItems, subtotal],
  );

  const finalPrice = useMemo(
    () => subtotal - discountAmount,
    [subtotal, discountAmount],
  );

  // ── Order list handlers ───────────────────────────────────────────────────────
  const handleAddToOrder = useCallback(() => {
    setOrderItems((prev) => {
      const idx = prev.findIndex((i) => i.size === selectedSize);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + currentQty,
        };
        return updated;
      }
      return [...prev, { size: selectedSize, quantity: currentQty }];
    });
    setCurrentQty(1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  }, [selectedSize, currentQty]);

  const handleUpdateItemQty = useCallback((size: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((i) =>
          i.size === size ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const handleRemoveItem = useCallback((size: string) => {
    setOrderItems((prev) => prev.filter((i) => i.size !== size));
  }, []);

  // ── Coupon handlers ──────────────────────────────────────────────────────────
  const handleApplyCoupon = useCallback(() => {
    setCouponError(false);
    if (couponInput.trim().toUpperCase() === VALID_COUPON) {
      setIsCouponApplied(true);
    } else {
      setCouponError(true);
      setTimeout(() => setCouponError(false), 3000);
    }
  }, [couponInput]);

  const handleRemoveCoupon = useCallback(() => {
    setIsCouponApplied(false);
    setCouponInput("");
    setCouponError(false);
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────────
  const handleOrderNow = useCallback(() => {
    if (orderItems.length === 0) {
      handleAddToOrder();
    }
    setTimeout(
      () =>
        formSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      50,
    );
  }, [orderItems.length, handleAddToOrder]);

  // ── WhatsApp ──────────────────────────────────────────────────────────────────
  const sendToWhatsApp = useCallback(
    (shippingData: FormData) => {
      const isArabic = i18n.language === "ar";
      const deliveryFee = getDeliveryFee(shippingData.city, totalItems);
      const totalWithDelivery = finalPrice + deliveryFee;

      let message = isArabic
        ? "🛍️ *طلب جديد من متجر Morsh-D*\n\n"
        : "🛍️ *New Order from Morsh-D Store*\n\n";

      message += isArabic
        ? "📦 *معلومات الشحن:*\n"
        : "📦 *Shipping Information:*\n";
      message += isArabic
        ? `👤 الاسم: ${shippingData.firstName} ${shippingData.lastName}\n`
        : `👤 Name: ${shippingData.firstName} ${shippingData.lastName}\n`;
      if (shippingData.email)
        message += isArabic
          ? `📧 البريد: ${shippingData.email}\n`
          : `📧 Email: ${shippingData.email}\n`;
      message += isArabic
        ? `📱 الهاتف: ${shippingData.phone}\n`
        : `📱 Phone: ${shippingData.phone}\n`;
      if (shippingData.country)
        message += isArabic
          ? `🌍 الدولة: ${shippingData.country}\n`
          : `🌍 Country: ${shippingData.country}\n`;
      message += isArabic
        ? `📍 المحافظة: ${shippingData.governorate}\n`
        : `📍 State: ${shippingData.governorate}\n`;
      message += isArabic
        ? `🏙️ المدينة: ${shippingData.city}\n`
        : `🏙️ City: ${shippingData.city}\n`;
      message += isArabic
        ? `🏠 العنوان: ${shippingData.apartment}\n`
        : `🏠 Address: ${shippingData.apartment}\n`;

      const paymentText =
        shippingData.paymentMethod === "instapay"
          ? isArabic
            ? "📱 انستاباي (InstaPay)"
            : "📱 InstaPay"
          : isArabic
            ? "💵 الدفع عند الاستلام"
            : "💵 Cash on Delivery";
      message += isArabic
        ? `💳 طريقة الدفع: ${paymentText}\n\n`
        : `💳 Payment: ${paymentText}\n\n`;

      message += isArabic ? "🛒 *المنتجات:*\n" : "🛒 *Order Items:*\n";
      orderItems.forEach((item, idx) => {
        const lineTotal = PRODUCT_PRICE * item.quantity;
        message += isArabic
          ? `${idx + 1}. *${PRODUCT_NAME_AR}*\n   المقاس: ${item.size.toUpperCase()}\n   الكمية: ${item.quantity}\n   السعر: ${lineTotal} جنيه\n\n`
          : `${idx + 1}. *${PRODUCT_NAME}*\n   Size: ${item.size.toUpperCase()}\n   Qty: ${item.quantity}\n   Price: ${lineTotal} EGP\n\n`;
      });

      message += isArabic
        ? `━━━━━━━━━━━━━━━\n*المجموع: ${subtotal} جنيه*`
        : `━━━━━━━━━━━━━━━\n*Subtotal: ${subtotal} EGP*`;

      if (isCouponApplied) {
        message += isArabic
          ? `\n🎟️ *كوبون: ${VALID_COUPON} (${COUPON_DISCOUNT_PER_ITEM} جنيه/قطعة)*\n*الخصم: -${discountAmount} جنيه*\n*بعد الخصم: ${finalPrice} جنيه*`
          : `\n🎟️ *Coupon: ${VALID_COUPON} (${COUPON_DISCOUNT_PER_ITEM} EGP/item)*\n*Discount: -${discountAmount} EGP*\n*After discount: ${finalPrice} EGP*`;
      }

      message += isArabic
        ? `\n🚚 *التوصيل: ${deliveryFee === 0 ? "مجاني" : `${deliveryFee} جنيه`}*\n💰 *الإجمالي النهائي: ${totalWithDelivery} جنيه*`
        : `\n🚚 *Delivery: ${deliveryFee === 0 ? "FREE" : `${deliveryFee} EGP`}*\n💰 *Total: ${totalWithDelivery} EGP*`;

      trackPurchase(totalWithDelivery, "EGP");
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer",
      );
    },
    [
      orderItems,
      totalItems,
      subtotal,
      discountAmount,
      finalPrice,
      isCouponApplied,
      i18n.language,
    ],
  );

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

  const isArabic = i18n.language === "ar";

  return (
    <div
      ref={productRef}
      className="min-h-screen bg-background relative overflow-hidden pt-12 md:pt-14"
    >
      <PromoBanner />

      {/* Decorative background */}
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
        <LanguageSwitcher />
      </header>

      <main className="container mx-auto px-4 py-6 md:py-12 space-y-10 md:space-y-16">
        {/* ── Product Section ────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12 items-start max-w-7xl mx-auto">
          {/* Images */}
          <div className="space-y-3 md:space-y-4">
            <div ref={imageRef} className="relative will-change-transform">
              <div
                className="neon-border pixel-corners bg-card/50 p-3 md:p-5 backdrop-blur-sm group cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={productImagePaths[selectedImage]}
                    alt="Arcade T-Shirt"
                    decoding="async"
                    loading="lazy"
                    className="w-full max-h-[350px] md:max-h-[450px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg pointer-events-none">
                    <Maximize2 className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-secondary text-secondary-foreground px-3 py-1 md:px-6 md:py-2 font-bold text-sm md:text-xl neon-border pixel-corners pointer-events-none">
                  {t("new")}
                </div>
              </div>
            </div>

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
          <div className="space-y-4 md:space-y-6">
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

            {/* ── Size + Qty + Add to Order ──────────────────────────────────── */}
            <div className="neon-border pixel-corners bg-card/50 p-4 md:p-5 backdrop-blur-sm space-y-4">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
                {isArabic ? "أضف مقاس للطلب" : "Add a size to your order"}
              </p>

              <SizeSelector onSizeSelect={setSelectedSize} />

              {/* Qty row */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm md:text-base">
                  {isArabic ? "الكمية:" : "Quantity:"}
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 pixel-corners"
                    onClick={() => setCurrentQty((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="font-bold text-xl w-8 text-center">
                    {currentQty}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 pixel-corners"
                    onClick={() => setCurrentQty((q) => Math.min(10, q + 1))}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Add button */}
              <Button
                onClick={handleAddToOrder}
                className={`w-full pixel-corners font-bold text-base transition-all duration-300 ${
                  addedFeedback
                    ? "bg-green-600 text-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {addedFeedback ? (
                  <>
                    <CheckCircle2 className="mr-2 w-4 h-4" />
                    {isArabic ? "تمت الإضافة ✓" : "Added ✓"}
                  </>
                ) : (
                  <>
                    <ShoppingBag className="mr-2 w-4 h-4" />
                    {isArabic
                      ? `أضف ${currentQty > 1 ? `${currentQty}×` : ""}${selectedSize.toUpperCase()} للطلب`
                      : `Add ${currentQty > 1 ? `${currentQty}×` : ""}${selectedSize.toUpperCase()} to order`}
                  </>
                )}
              </Button>
            </div>

            {/* ── Order Summary ──────────────────────────────────────────────── */}
            {orderItems.length > 0 && (
              <div className="neon-border pixel-corners bg-card/50 p-4 backdrop-blur-sm space-y-3">
                <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {isArabic ? "📋 ملخص الطلب" : "📋 Order Summary"}
                </p>

                {orderItems.map((item) => (
                  <div
                    key={item.size}
                    className="flex items-center justify-between gap-3 neon-border pixel-corners bg-background/40 px-3 py-2"
                  >
                    {/* Size badge */}
                    <span className="font-bold text-accent text-lg w-10 text-center uppercase shrink-0">
                      {item.size}
                    </span>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 pixel-corners"
                        onClick={() => handleUpdateItemQty(item.size, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-bold w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 pixel-corners"
                        onClick={() => handleUpdateItemQty(item.size, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Line price */}
                    <span className="font-bold text-sm text-foreground/80 shrink-0">
                      {PRODUCT_PRICE * item.quantity} {isArabic ? "ج.م" : "EGP"}
                    </span>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => handleRemoveItem(item.size)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}

                {/* Coupon */}
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold">
                      {isArabic ? "كود الخصم" : "Coupon Code"}
                    </span>
                  </div>
                  {isCouponApplied ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded px-3 py-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-bold text-green-500">
                          {isArabic
                            ? `${VALID_COUPON} — خصم ${COUPON_DISCOUNT_PER_ITEM} جنيه/قطعة`
                            : `${VALID_COUPON} — ${COUPON_DISCOUNT_PER_ITEM} EGP/item`}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={handleRemoveCoupon}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError(false);
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleApplyCoupon()
                        }
                        placeholder={
                          isArabic
                            ? "ادخل كود الخصم..."
                            : "Enter coupon code..."
                        }
                        className={`flex-1 bg-background border rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary transition-colors ${
                          couponError
                            ? "border-destructive ring-1 ring-destructive"
                            : "border-border"
                        }`}
                        dir="ltr"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="pixel-corners text-xs"
                        onClick={handleApplyCoupon}
                        disabled={!couponInput.trim()}
                      >
                        {isArabic ? "تطبيق" : "Apply"}
                      </Button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-xs text-destructive">
                      {isArabic
                        ? "❌ كود الخصم غير صالح"
                        : "❌ Invalid coupon code"}
                    </p>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-border pt-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {isArabic
                        ? `${totalItems} قطعة × ${PRODUCT_PRICE} جنيه`
                        : `${totalItems} item(s) × ${PRODUCT_PRICE} EGP`}
                    </span>
                    <span>
                      {subtotal} {isArabic ? "ج.م" : "EGP"}
                    </span>
                  </div>
                  {isCouponApplied && (
                    <div className="flex justify-between text-sm text-green-500 font-bold">
                      <span>
                        {isArabic ? "خصم الكوبون:" : "Coupon discount:"}
                      </span>
                      <span>
                        -{discountAmount} {isArabic ? "ج.م" : "EGP"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      {isCouponApplied && (
                        <span className="text-sm text-muted-foreground line-through mr-2">
                          {subtotal} {isArabic ? "ج.م" : "EGP"}
                        </span>
                      )}
                      <span className="text-2xl md:text-3xl font-bold text-accent neon-glow">
                        {finalPrice} {isArabic ? "جنيه" : "EGP"}
                      </span>
                    </div>
                    <Button
                      onClick={handleOrderNow}
                      size="lg"
                      className="arcade-button bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 md:px-10 py-4 md:py-5 text-base md:text-xl font-bold uppercase tracking-wider"
                    >
                      <Send className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                      {isArabic ? "اطلب الآن" : "Order Now"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* If nothing added yet — show price + CTA */}
            {orderItems.length === 0 && (
              <div className="neon-border pixel-corners bg-card/50 p-4 md:p-6 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-3xl md:text-4xl font-bold text-accent neon-glow">
                  {t("price")}
                </span>
                <Button
                  onClick={handleOrderNow}
                  size="lg"
                  className="arcade-button bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full sm:w-auto px-6 md:px-10 py-4 md:py-6 text-lg md:text-xl font-bold uppercase tracking-wider"
                >
                  <Send className="mr-2 w-5 h-5 md:w-6 md:h-6" />
                  {isArabic ? "اطلب الآن" : "Order Now"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Checkout Form ──────────────────────────────────────────────────── */}
        <div ref={formSectionRef} className="max-w-2xl mx-auto scroll-mt-20">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold neon-glow uppercase tracking-wider">
              {isArabic ? "🛒 إتمام الطلب" : "🛒 Complete Your Order"}
            </h2>
            {orderItems.length > 0 ? (
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                {isArabic
                  ? `${orderItems.map((i) => `${i.size.toUpperCase()}×${i.quantity}`).join(" · ")} — الإجمالي: ${finalPrice} جنيه`
                  : `${orderItems.map((i) => `${i.size.toUpperCase()}×${i.quantity}`).join(" · ")} — Total: ${finalPrice} EGP`}
              </p>
            ) : (
              <p className="text-muted-foreground mt-2 text-sm md:text-base">
                {isArabic
                  ? "اكمل بياناتك وأرسل الطلب عبر واتساب"
                  : "Fill in your details and send via WhatsApp"}
              </p>
            )}
          </div>
          <CheckoutForm
            cartSubtotal={finalPrice}
            totalItems={totalItems || 1}
            onSubmit={sendToWhatsApp}
          />
        </div>
      </main>

      {/* Footer decoration */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

      {/* Image Zoom Modal */}
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
