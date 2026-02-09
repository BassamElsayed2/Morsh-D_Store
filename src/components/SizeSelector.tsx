import { memo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface SizeSelectorProps {
  onSizeSelect: (size: string) => void;
}

const sizes = ["m", "l", "xl"];

export const SizeSelector = memo(({ onSizeSelect }: SizeSelectorProps) => {
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState<string>("m");

  const handleSelect = useCallback(
    (size: string) => {
      setSelectedSize(size);
      onSizeSelect(size);
    },
    [onSizeSelect]
  );

  return (
    <div className="space-y-3 md:space-y-4">
      <h3 className="text-primary neon-glow font-bold text-base md:text-xl uppercase tracking-wider">
        {t("selectSize")}
      </h3>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {sizes.map((size) => (
          <Button
            key={size}
            onClick={() => handleSelect(size)}
            variant={selectedSize === size ? "default" : "outline"}
            className={`
              arcade-button h-12 md:h-16 font-bold text-sm md:text-lg uppercase
              ${
                selectedSize === size
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--neon-glow))]"
                  : "bg-card text-primary hover:bg-primary/20"
              }
            `}
          >
            {t(`sizes.${size}`)}
          </Button>
        ))}
      </div>
    </div>
  );
});

SizeSelector.displayName = "SizeSelector";
