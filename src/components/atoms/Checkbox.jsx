import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  className, 
  checked = false,
  onChange,
  animated = true,
  ...props 
}, ref) => {
  const handleClick = () => {
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "relative flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
        checked 
          ? "bg-gradient-to-r from-primary to-secondary border-primary text-white" 
          : "bg-white border-gray-300 hover:border-primary",
        animated && "checkbox-animate",
        animated && checked && "checked",
        className
      )}
      onClick={handleClick}
      ref={ref}
      {...props}
    >
      {checked && (
        <ApperIcon 
          name="Check" 
          size={14} 
          className={cn(
            "text-white",
            animated && "checkmark-path"
          )} 
        />
      )}
    </button>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;