import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    high: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    medium: "bg-gradient-to-r from-accent/10 to-yellow-100 text-accent border border-accent/20",
    low: "bg-gradient-to-r from-success/10 to-green-100 text-success border border-success/20",
    primary: "bg-gradient-to-r from-primary/10 to-blue-100 text-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-purple-100 text-secondary border border-secondary/20"
  };

  return (
    <span
      className={cn(baseClasses, variants[variant], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;