import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import QuickAddInput from "@/components/molecules/QuickAddInput";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const ImportantPage = () => {
  const { lists, onRefresh } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
      const allTasks = await taskService.getAll();
      
      // Filter high priority tasks
      const importantTasks = allTasks.filter(task => task.priority === "high");
      
      setTasks(importantTasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load important tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (taskData) => {
    try {
      // Set high priority for important tasks
      await taskService.create({
        ...taskData,
        priority: "high"
      });
      
      await loadTasks();
      onRefresh();
      toast.success("Important task added!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await taskService.update(taskId, { completed });
      await loadTasks();
      onRefresh();
      
      if (completed) {
        toast.success("Important task completed! Excellent work! 🌟");
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
      onRefresh();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this important task?")) {
      try {
        await taskService.delete(taskId);
        await loadTasks();
        onRefresh();
        toast.success("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task");
      }
    }
  };

  const handleModalClose = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <ErrorView
        title="Unable to load important tasks"
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
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Important Tasks</h1>
        <p className="text-gray-600">
          High priority tasks that need your immediate attention
        </p>
      </div>

      {/* Quick Add for Important Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-3">
          <div className="w-3 h-3 bg-gradient-to-r from-error to-red-600 rounded-full mr-2"></div>
          <span className="text-sm font-medium text-gray-700">Add High Priority Task</span>
        </div>
        <QuickAddInput
          onAdd={handleQuickAdd}
          placeholder="What's urgent and important?"
        />
      </div>

      {/* Active Important Tasks */}
      {activeTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Needs Attention
            <span className="ml-2 bg-gradient-to-r from-error to-red-600 text-white text-sm px-2 py-1 rounded-full">
              {activeTasks.length}
            </span>
          </h2>
          <TaskList
            tasks={activeTasks}
            lists={lists}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      )}

      {/* Completed Important Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Completed Important Tasks
            <span className="ml-2 bg-gradient-to-r from-success to-green-600 text-white text-sm px-2 py-1 rounded-full">
              {completedTasks.length}
            </span>
          </h2>
          <TaskList
            tasks={completedTasks}
            lists={lists}
            onToggleComplete={handleToggleComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <Empty
          title="No important tasks"
          message="You don't have any high priority tasks right now. Add important tasks that need your immediate attention."
          actionLabel="Add Important Task"
          onAction={() => setIsTaskModalOpen(true)}
          icon="Star"
        />
      )}

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

export default ImportantPage;