import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/contexts/CartContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Send,
  Tag,
  X,
  CheckCircle2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckoutForm, type FormData } from "./CheckoutForm";
import { OptimizedImage } from "./OptimizedImage";

interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CartDrawer = memo(
  ({ open = false, onOpenChange }: CartDrawerProps) => {
    const { i18n } = useTranslation();
    const {
      items,
      removeItem,
      updateQuantity,
      totalItems,
      totalPrice,
      clearCart,
      couponCode,
      setCouponCode,
      applyCoupon,
      removeCoupon,
      isCouponApplied,
      discountAmount,
      finalPrice,
    } = useCart();

    const isArabic = i18n.language === "ar";
    const [couponError, setCouponError] = useState(false);
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);

    const handleApplyCoupon = useCallback(() => {
      setCouponError(false);
      const success = applyCoupon();
      if (!success) {
        setCouponError(true);
        setTimeout(() => setCouponError(false), 3000);
      }
    }, [applyCoupon]);

    const handleRemoveCoupon = useCallback(() => {
      removeCoupon();
      setCouponError(false);
    }, [removeCoupon]);

    const sendToWhatsApp = useCallback(
      (shippingData: FormData) => {
        if (items.length === 0) return;

        let message = isArabic
          ? "🛍️ *طلب جديد من متجر Morsh-D*\n\n"
          : "🛍️ *New Order from Morsh-D Store*\n\n";

        // Shipping Information
        message += isArabic
          ? "📦 *معلومات الشحن:*\n"
          : "📦 *Shipping Information:*\n";
        message += isArabic
          ? `👤 الاسم: ${shippingData.firstName} ${shippingData.lastName}\n`
          : `👤 Name: ${shippingData.firstName} ${shippingData.lastName}\n`;

        if (shippingData.email) {
          message += isArabic
            ? `📧 البريد: ${shippingData.email}\n`
            : `📧 Email: ${shippingData.email}\n`;
        }

        message += isArabic
          ? `📱 الهاتف: ${shippingData.phone}\n`
          : `📱 Phone: ${shippingData.phone}\n`;

        message += isArabic
          ? `📍 المحافظة: ${shippingData.governorate}\n`
          : `📍 Governorate: ${shippingData.governorate}\n`;

        message += isArabic
          ? `🏙️ المدينة: ${shippingData.city}\n`
          : `🏙️ City: ${shippingData.city}\n`;

        message += isArabic
          ? `🏠 العنوان: ${shippingData.apartment}\n`
          : `🏠 Address: ${shippingData.apartment}\n`;

        // Payment Method
        const paymentMethodText =
          shippingData.paymentMethod === "instapay"
            ? isArabic
              ? "📱 انستاباي (InstaPay)"
              : "📱 InstaPay"
            : isArabic
              ? "💵 الدفع عند الاستلام"
              : "💵 Cash on Delivery";

        message += isArabic
          ? `💳 طريقة الدفع: ${paymentMethodText}\n\n`
          : `💳 Payment Method: ${paymentMethodText}\n\n`;

        // Order Items
        message += isArabic ? "🛒 *المنتجات:*\n" : "🛒 *Order Items:*\n";
        items.forEach((item, index) => {
          const itemName = isArabic ? item.nameAr : item.name;
          message += isArabic
            ? `${index + 1}. *${itemName}*\n   المقاس: ${item.size.toUpperCase()}\n   الكمية: ${item.quantity}\n   السعر: ${item.price} جنيه\n   المجموع: ${item.price * item.quantity} جنيه\n\n`
            : `${index + 1}. *${itemName}*\n   Size: ${item.size.toUpperCase()}\n   Quantity: ${item.quantity}\n   Price: ${item.price} EGP\n   Subtotal: ${item.price * item.quantity} EGP\n\n`;
        });

        message += isArabic
          ? `━━━━━━━━━━━━━━━\n*المجموع: ${totalPrice} جنيه*\n*عدد القطع: ${totalItems}*`
          : `━━━━━━━━━━━━━━━\n*Subtotal: ${totalPrice} EGP*\n*Total Items: ${totalItems}*`;

        if (isCouponApplied) {
          message += isArabic
            ? `\n🎟️ *كوبون خصم: MD20 (-20%)*\n*الخصم: -${discountAmount} جنيه*\n*المجموع بعد الخصم: ${finalPrice} جنيه*`
            : `\n🎟️ *Coupon: MD20 (-20%)*\n*Discount: -${discountAmount} EGP*\n*Total after discount: ${finalPrice} EGP*`;
        }

        const phoneNumber = "201013816187";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        // Close checkout form and cart after sending
        setShowCheckoutForm(false);
        onOpenChange?.(false);
      },
      [
        items,
        isArabic,
        totalPrice,
        totalItems,
        isCouponApplied,
        discountAmount,
        finalPrice,
        onOpenChange,
      ],
    );

    const handleOpenChange = useCallback(
      (value: boolean) => onOpenChange?.(value),
      [onOpenChange],
    );

    const handleCheckoutClick = useCallback(() => {
      setShowCheckoutForm(true);
      onOpenChange?.(false); // Close cart drawer when opening checkout form
    }, [onOpenChange]);

    const handleCheckoutSubmit = useCallback(
      (formData: FormData) => {
        sendToWhatsApp(formData);
      },
      [sendToWhatsApp],
    );

    const handleCheckoutClose = useCallback(() => {
      setShowCheckoutForm(false);
    }, []);

    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="neon-border pixel-corners"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
            {totalItems > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 md:h-6 md:w-6 flex items-center justify-center p-0 text-xs font-bold z-50 pointer-events-none"
                variant="destructive"
              >
                {totalItems}
              </Badge>
            )}
          </div>
        </SheetTrigger>
        <SheetContent
          className="w-full sm:max-w-lg bg-background/95 backdrop-blur-md"
          side={isArabic ? "left" : "right"}
        >
          <SheetHeader>
            <SheetTitle className="text-xl md:text-2xl font-bold neon-glow uppercase">
              {isArabic ? "🛒 سلة التسوق" : "🛒 Shopping Cart"}
            </SheetTitle>
            <SheetDescription className="text-sm md:text-base">
              {isArabic
                ? `${totalItems} منتج في السلة`
                : `${totalItems} items in your cart`}
            </SheetDescription>
          </SheetHeader>

          <Separator className="my-3 md:my-4" />

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vmin] text-center px-4">
              <ShoppingCart className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground mb-4" />
              <p className="text-base md:text-lg text-muted-foreground">
                {isArabic ? "السلة فارغة" : "Your cart is empty"}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">
                {isArabic
                  ? "ابدأ بإضافة المنتجات"
                  : "Start adding some products"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-[calc(100vh-140px)]">
              <ScrollArea className="flex-1 pr-2 md:pr-4">
                <div className="space-y-3 md:space-y-4 pb-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="neon-border pixel-corners bg-card/50 p-3 md:p-4 space-y-2 md:space-y-3"
                    >
                      <div className="flex gap-3 md:gap-4">
                        <OptimizedImage
                          src={item.image}
                          alt={isArabic ? item.nameAr : item.name}
                          width={80}
                          height={80}
                          loading="lazy"
                          decoding="async"
                          sizes="80px"
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded pixel-corners flex-shrink-0"
                        />
                        <div className="flex-1 space-y-1 min-w-0">
                          <h3 className="font-bold text-sm md:text-base text-foreground truncate">
                            {isArabic ? item.nameAr : item.name}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {isArabic ? "المقاس:" : "Size:"}{" "}
                            <span className="font-bold text-accent">
                              {item.size.toUpperCase()}
                            </span>
                          </p>
                          <p className="text-xs md:text-sm font-bold text-primary">
                            {item.price} {isArabic ? "جنيه" : "EGP"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
                        >
                          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 pixel-corners"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-bold text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 pixel-corners"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="font-bold text-base md:text-lg text-accent">
                          {item.price * item.quantity}{" "}
                          {isArabic ? "جنيه" : "EGP"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex-shrink-0 p-3 md:p-4 bg-background border-t space-y-3 md:space-y-4">
                {/* Coupon Section */}
                <div className="neon-border pixel-corners bg-card/50 p-3 md:p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <span className="text-sm md:text-base font-bold">
                      {isArabic ? "كود الخصم" : "Coupon Code"}
                    </span>
                  </div>
                  {isCouponApplied ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded px-3 py-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-bold text-green-500">
                          MD20 (-20%)
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
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase());
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
                        disabled={!couponCode.trim()}
                      >
                        {isArabic ? "تطبيق" : "Apply"}
                      </Button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-xs text-destructive mt-1.5">
                      {isArabic ? "كود الخصم غير صالح" : "Invalid coupon code"}
                    </p>
                  )}
                </div>

                {/* Price Summary */}
                <div className="neon-border pixel-corners bg-card/50 p-3 md:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm md:text-base text-muted-foreground">
                      {isArabic ? "عدد القطع:" : "Total Items:"}
                    </span>
                    <span className="font-bold text-sm md:text-base">
                      {totalItems}
                    </span>
                  </div>
                  {isCouponApplied && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm md:text-base text-muted-foreground">
                          {isArabic ? "المجموع:" : "Subtotal:"}
                        </span>
                        <span className="font-bold text-sm md:text-base text-muted-foreground line-through">
                          {totalPrice} {isArabic ? "جنيه" : "EGP"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm md:text-base text-green-500">
                          {isArabic ? "الخصم (20%):" : "Discount (20%):"}
                        </span>
                        <span className="font-bold text-sm md:text-base text-green-500">
                          -{discountAmount} {isArabic ? "جنيه" : "EGP"}
                        </span>
                      </div>
                    </>
                  )}
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-lg md:text-xl font-bold">
                      {isArabic ? "المجموع:" : "Total:"}
                    </span>
                    <span className="text-xl md:text-2xl font-bold text-accent neon-glow">
                      {isCouponApplied ? finalPrice : totalPrice}{" "}
                      {isArabic ? "جنيه" : "EGP"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1 pixel-corners text-sm md:text-base"
                  >
                    {isArabic ? "إفراغ السلة" : "Clear Cart"}
                  </Button>
                  <Button
                    onClick={handleCheckoutClick}
                    className="flex-1 arcade-button bg-secondary text-secondary-foreground hover:bg-secondary/90 pixel-corners text-sm md:text-base"
                  >
                    <Send className="mr-2 w-3 h-3 md:w-4 md:h-4" />
                    {isArabic ? "إتمام الطلب" : "Checkout"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>

        {/* Checkout Form Modal */}
        {showCheckoutForm && (
          <CheckoutForm
            onSubmit={handleCheckoutSubmit}
            onClose={handleCheckoutClose}
          />
        )}
      </Sheet>
    );
  },
);

CartDrawer.displayName = "CartDrawer";
