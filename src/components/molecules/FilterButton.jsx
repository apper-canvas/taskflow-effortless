import React from "react";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const FilterButton = ({ 
  active = false, 
  children, 
  onClick, 
  variant = "ghost",
  className,
  ...props 
}) => {
  return (
    <Button
      variant={active ? "primary" : variant}
      size="sm"
      onClick={onClick}
      className={cn(
        "transition-all duration-200",
        active && "shadow-md",
        !active && "hover:bg-gray-100 text-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FilterButton;