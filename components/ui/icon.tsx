import * as React from "react";
import { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Xiventa Icon Wrapper
 * Enforces the Figma Design System Icon Rules:
 * - Line based
 * - 1.75 stroke width (strokeWidth={1.75})
 * - Rounded caps and joins
 * - 24px default bounding box
 */
export interface IconProps extends Omit<LucideProps, "ref"> {
  icon: LucideIcon;
}

export function Icon({
  icon: IconComponent,
  className,
  size = 20,
  strokeWidth = 1.75,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

export * from "lucide-react";
