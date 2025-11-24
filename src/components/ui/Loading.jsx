import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-48 mb-2"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-32"></div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg"></div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-20"></div>
          ))}
        </div>
      </div>

      {/* Task Cards Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded mt-0.5"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2"></div>
                <div className="flex gap-2 mt-2">
                  <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full w-12"></div>
                  <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;