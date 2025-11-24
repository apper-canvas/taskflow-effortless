import React from "react";
import { format, isToday, isTomorrow, isYesterday, isPast, differenceInDays } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const DueDateIndicator = ({ dueDate, completed = false, className }) => {
  if (!dueDate) return null;

  const date = new Date(dueDate);
  const now = new Date();
  const daysDiff = differenceInDays(date, now);
  
  const getDateText = () => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isYesterday(date)) return "Yesterday";
    if (daysDiff > 0 && daysDiff <= 7) return `${daysDiff} days`;
    return format(date, "MMM d");
  };

  const getDateColor = () => {
    if (completed) return "text-gray-400";
    if (isPast(date) && !isToday(date)) return "text-error";
    if (isToday(date) || daysDiff <= 1) return "text-warning";
    return "text-success";
  };

  return (
    <div className={cn("flex items-center gap-1 text-xs", getDateColor(), className)}>
      <ApperIcon name="Calendar" size={12} />
      <span>{getDateText()}</span>
    </div>
  );
};

export default DueDateIndicator;