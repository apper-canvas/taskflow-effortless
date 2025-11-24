import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import FilterBar from "@/components/organisms/FilterBar";
import TaskModal from "@/components/organisms/TaskModal";
import QuickAddInput from "@/components/molecules/QuickAddInput";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const TasksPage = () => {
  const { lists, onRefresh } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    loadTasks();

    // Listen for task updates from other components
    const handleTaskUpdate = () => {
      loadTasks();
    };

    window.addEventListener("taskUpdated", handleTaskUpdate);
    return () => window.removeEventListener("taskUpdated", handleTaskUpdate);
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const fetchedTasks = await taskService.getAll();
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (taskData) => {
    try {
      await taskService.create(taskData);
      await loadTasks();
      onRefresh(); // Refresh list counts
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await taskService.update(taskId, { completed });
      await loadTasks();
      onRefresh(); // Refresh list counts
      
      if (completed) {
        toast.success("Task completed! 🎉");
      } else {
        toast.info("Task marked as active");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully!");
      }
      
      setIsTaskModalOpen(false);
      setEditingTask(null);
      await loadTasks();
      onRefresh(); // Refresh list counts
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        await loadTasks();
        onRefresh(); // Refresh list counts
        toast.success("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleModalClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  // Filter tasks based on active filter and search query
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    let statusMatch = true;
    switch (activeFilter) {
      case "active":
        statusMatch = !task.completed;
        break;
      case "completed":
        statusMatch = task.completed;
        break;
      case "high":
      case "medium":
      case "low":
        statusMatch = task.priority === activeFilter;
        break;
      case "all":
      default:
        statusMatch = true;
        break;
    }

    // Search filter
    const searchMatch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return statusMatch && searchMatch;
  });

  // Calculate task counts for filter buttons
  const taskCounts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        title="Unable to load tasks"
        message={error}
        onRetry={loadTasks}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Quick Add Input */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <QuickAddInput
          onAdd={handleQuickAdd}
          placeholder="What needs to be done?"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          taskCounts={taskCounts}
        />
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {filteredTasks.length === 0 ? (
          <Empty
            title={
              searchQuery 
                ? "No matching tasks" 
                : activeFilter === "completed" 
                ? "No completed tasks yet" 
                : activeFilter === "active"
                ? "No active tasks"
                : "No tasks yet"
            }
            message={
              searchQuery 
                ? `No tasks found matching "${searchQuery}". Try adjusting your search terms.`
                : activeFilter === "completed"
                ? "Complete some tasks to see them here."
                : activeFilter === "active"
                ? "All your tasks are completed! Add new ones to get started."
                : "Create your first task to get started with organizing your work."
            }
            actionLabel="Create Task"
            onAction={() => setIsTaskModalOpen(true)}
          />
        ) : (
          <TaskList
            tasks={filteredTasks}
            lists={lists}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveTask}
        task={editingTask}
        lists={lists}
      />
    </motion.div>
  );
};

export default TasksPage;