import React from "react";
import { NavLink } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ lists, onNewList, className }) => {
  const navigation = [
    { name: "All Tasks", href: "", icon: "Inbox", count: lists.reduce((sum, list) => sum + list.taskCount, 0) },
    { name: "Today", href: "today", icon: "Calendar", count: 0 },
    { name: "Important", href: "important", icon: "Star", count: 0 }
  ];

  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 flex flex-col", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <ApperIcon name="CheckSquare" size={18} className="text-white" />
          </div>
<h1 className="font-semibold text-xl text-gray-900">TaskFlow Pro</h1>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === ""}
              className={({ isActive }) =>
                cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <div className="flex items-center gap-3">
                <ApperIcon name={item.icon} size={18} />
                <span>{item.name}</span>
              </div>
              {item.count > 0 && (
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Lists Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Lists
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewList}
              className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>

          <div className="space-y-1">
            {lists.map((list) => (
              <NavLink
                key={list.Id}
                to={`/list/${list.Id}`}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: list.color }}
                  />
                  <span>{list.name}</span>
                </div>
                {list.taskCount > 0 && (
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                    {list.taskCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Stay organized, stay productive
        </div>
      </div>
    </div>
  );
};

export default Sidebar;