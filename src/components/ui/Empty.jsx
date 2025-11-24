import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No tasks yet",
  message = "Create your first task to get started with organizing your work.",
  actionLabel = "Create Task",
  onAction,
  icon = "CheckSquare",
  className = ""
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Empty State Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={40} className="text-primary" />
        </div>

        {/* Empty State Content */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Button */}
        {onAction && (
          <Button onClick={onAction} size="lg" className="shadow-lg">
            <ApperIcon name="Plus" size={18} className="mr-2" />
            {actionLabel}
          </Button>
        )}

        {/* Tips */}
        <div className="mt-12 text-left bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <ApperIcon name="Lightbulb" size={16} className="mr-2 text-accent" />
            Tips to get started:
          </h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <ApperIcon name="ArrowRight" size={14} className="mr-2 mt-0.5 text-primary flex-shrink-0" />
              Use the quick add input for fast task capture
            </li>
            <li className="flex items-start">
              <ApperIcon name="ArrowRight" size={14} className="mr-2 mt-0.5 text-primary flex-shrink-0" />
              Set priorities and due dates to stay organized
            </li>
            <li className="flex items-start">
              <ApperIcon name="ArrowRight" size={14} className="mr-2 mt-0.5 text-primary flex-shrink-0" />
              Create custom lists to categorize your work
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Empty;