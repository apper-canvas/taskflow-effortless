import React from "react";
import FilterButton from "@/components/molecules/FilterButton";
import SearchBar from "@/components/molecules/SearchBar";

const FilterBar = ({ 
  activeFilter, 
  onFilterChange, 
  onSearch,
  taskCounts = {},
  className 
}) => {
  const filters = [
    { key: "all", label: `All (${taskCounts.all || 0})` },
    { key: "active", label: `Active (${taskCounts.active || 0})` },
    { key: "completed", label: `Completed (${taskCounts.completed || 0})` }
  ];

  const priorities = [
    { key: "high", label: "High Priority" },
    { key: "medium", label: "Medium Priority" },
    { key: "low", label: "Low Priority" }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      <SearchBar 
        onSearch={onSearch}
        placeholder="Search tasks..."
      />

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2 flex items-center">
          Status:
        </span>
        {filters.map((filter) => (
          <FilterButton
            key={filter.key}
            active={activeFilter === filter.key}
            onClick={() => onFilterChange(filter.key)}
          >
            {filter.label}
          </FilterButton>
        ))}
      </div>

      {/* Priority Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 mr-2 flex items-center">
          Priority:
        </span>
        {priorities.map((priority) => (
          <FilterButton
            key={priority.key}
            active={activeFilter === priority.key}
            onClick={() => onFilterChange(priority.key)}
            variant="secondary"
          >
            {priority.label}
          </FilterButton>
        ))}
        <FilterButton
          active={activeFilter === "all"}
          onClick={() => onFilterChange("all")}
          variant="secondary"
        >
          All Priorities
        </FilterButton>
      </div>
    </div>
  );
};

export default FilterBar;