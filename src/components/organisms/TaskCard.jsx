import React, { useState } from "react";
import { motion } from "framer-motion";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import PriorityBadge from "@/components/molecules/PriorityBadge";
import DueDateIndicator from "@/components/molecules/DueDateIndicator";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  listColor,
  className 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleComplete = async () => {
    setIsAnimating(true);
    setTimeout(() => {
      onToggleComplete(task.Id, !task.completed);
      setIsAnimating(false);
    }, task.completed ? 0 : 300);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.Id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-200",
        task.completed && "opacity-75",
        isAnimating && "task-exit",
        className
      )}
    >
      {/* List Color Indicator */}
      {listColor && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: listColor }}
        />
      )}

      <div className="flex items-start gap-3 pl-2">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            animated={true}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-gray-900 text-sm leading-5",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={cn(
                  "text-xs text-gray-600 mt-1 leading-4",
                  task.completed && "line-through text-gray-400"
                )}>
                  {task.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center gap-2 mt-2">
                <PriorityBadge priority={task.priority} />
                <DueDateIndicator 
                  dueDate={task.dueDate} 
                  completed={task.completed}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="w-8 h-8 p-0"
              >
                <ApperIcon name="Edit3" size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="w-8 h-8 p-0 text-gray-400 hover:text-error"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;