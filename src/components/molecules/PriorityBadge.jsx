import React from "react";
import Badge from "@/components/atoms/Badge";

const PriorityBadge = ({ priority, className }) => {
  const getPriorityConfig = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return { variant: "high", label: "High" };
      case "medium":
        return { variant: "medium", label: "Med" };
      case "low":
        return { variant: "low", label: "Low" };
      default:
        return { variant: "default", label: "Unknown" };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;