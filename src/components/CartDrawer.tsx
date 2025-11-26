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
import { ShoppingCart, Trash2, Plus, Minus, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export const CartDrawer = () => {
  const { t, i18n } = useTranslation();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const isArabic = i18n.language === "ar";

  const sendToWhatsApp = () => {
    if (items.length === 0) return;

    // Format cart items for WhatsApp
    let message = isArabic
      ? "🛍️ *طلب جديد من متجر Morsh-D*\n\n"
      : "🛍️ *New Order from Morsh-D Store*\n\n";

    items.forEach((item, index) => {
      const itemName = isArabic ? item.nameAr : item.name;
      message += isArabic
        ? `${
            index + 1
          }. *${itemName}*\n   المقاس: ${item.size.toUpperCase()}\n   الكمية: ${
            item.quantity
          }\n   السعر: ${item.price} جنيه\n   المجموع: ${
            item.price * item.quantity
          } جنيه\n\n`
        : `${
            index + 1
          }. *${itemName}*\n   Size: ${item.size.toUpperCase()}\n   Quantity: ${
            item.quantity
          }\n   Price: ${item.price} EGP\n   Subtotal: ${
            item.price * item.quantity
          } EGP\n\n`;
    });

    message += isArabic
      ? `━━━━━━━━━━━━━━━\n*المجموع الكلي: ${getTotalPrice()} جنيه*\n*عدد القطع: ${getTotalItems()}*`
      : `━━━━━━━━━━━━━━━\n*Total: ${getTotalPrice()} EGP*\n*Total Items: ${getTotalItems()}*`;

    const phoneNumber = "201013816187";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="neon-border pixel-corners"
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          {getTotalItems() > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 md:h-6 md:w-6 flex items-center justify-center p-0 text-xs font-bold z-50 pointer-events-none"
              variant="destructive"
            >
              {getTotalItems()}
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
              ? `${getTotalItems()} منتج في السلة`
              : `${getTotalItems()} items in your cart`}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-3 md:my-4" />

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <ShoppingCart className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground mb-4" />
            <p className="text-base md:text-lg text-muted-foreground">
              {isArabic ? "السلة فارغة" : "Your cart is empty"}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-2">
              {isArabic ? "ابدأ بإضافة المنتجات" : "Start adding some products"}
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[calc(100vh-250px)] pr-2 md:pr-4">
              <div className="space-y-3 md:space-y-4 mb-10">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="neon-border pixel-corners bg-card/50 p-3 md:p-4 space-y-2 md:space-y-3"
                  >
                    <div className="flex gap-3 md:gap-4">
                      <img
                        src={item.image}
                        alt={isArabic ? item.nameAr : item.name}
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
                              item.quantity - 1
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
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="font-bold text-base md:text-lg text-accent">
                        {item.price * item.quantity} {isArabic ? "جنيه" : "EGP"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-background border-t space-y-3 md:space-y-4">
              <div className="neon-border pixel-corners bg-card/50 p-3 md:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm md:text-base text-muted-foreground">
                    {isArabic ? "عدد القطع:" : "Total Items:"}
                  </span>
                  <span className="font-bold text-sm md:text-base">
                    {getTotalItems()}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-lg md:text-xl font-bold">
                    {isArabic ? "المجموع:" : "Total:"}
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-accent neon-glow">
                    {getTotalPrice()} {isArabic ? "جنيه" : "EGP"}
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
                  onClick={sendToWhatsApp}
                  className="flex-1 arcade-button bg-secondary text-secondary-foreground hover:bg-secondary/90 pixel-corners text-sm md:text-base"
                >
                  <Send className="mr-2 w-3 h-3 md:w-4 md:h-4" />
                  {isArabic ? "إرسال للواتساب" : "Send to WhatsApp"}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
