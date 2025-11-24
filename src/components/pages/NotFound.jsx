import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Icon */}
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
          <ApperIcon name="Search" size={48} className="text-primary" />
        </div>

        {/* Error Content */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <ApperIcon name="Home" size={18} className="mr-2" />
              Back to Tasks
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            or try these helpful links:
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/today">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                <ApperIcon name="Calendar" size={16} className="mr-1" />
                Today's Tasks
              </Button>
            </Link>
            <Link to="/important">
              <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                <ApperIcon name="Star" size={16} className="mr-1" />
                Important
              </Button>
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center justify-center">
            <ApperIcon name="Lightbulb" size={16} className="mr-2 text-accent" />
            Need help getting organized?
          </h3>
          <p className="text-sm text-gray-600">
            TaskFlow helps you capture, organize, and complete your tasks efficiently. 
            Start by creating your first task and experience the satisfaction of getting things done!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;