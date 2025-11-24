import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  title = "Something went wrong",
  message = "We're having trouble loading your tasks right now.",
  onRetry,
  className = ""
}) => {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-error/10 to-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>

        {/* Error Content */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}

        {/* Additional Help */}
        <p className="text-sm text-gray-500 mt-4">
          If this problem persists, please refresh the page or try again later.
        </p>
      </div>
    </div>
  );
};

export default ErrorView;