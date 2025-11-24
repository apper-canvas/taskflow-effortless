import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { isToday } from "date-fns";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import QuickAddInput from "@/components/molecules/QuickAddInput";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const TodayPage = () => {
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
      
      // Filter tasks that are due today
      const todayTasks = allTasks.filter(task => {
        if (!task.dueDate) return false;
        return isToday(new Date(task.dueDate));
      });
      
      setTasks(todayTasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load today's tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (taskData) => {
    try {
      // Set due date to today for quick add
      const today = new Date();
      today.setHours(17, 0, 0, 0); // Default to 5 PM today
      
      await taskService.create({
        ...taskData,
        dueDate: today.toISOString()
      });
      
      await loadTasks();
      onRefresh();
      toast.success("Task added to today!");
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
        toast.success("Great job! Task completed! 🎉");
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
    if (window.confirm("Are you sure you want to delete this task?")) {
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
        title="Unable to load today's tasks"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Today's Focus</h1>
        <p className="text-gray-600">
          {activeTasks.length === 0 
            ? "All done for today! You're amazing! ✨" 
            : `${activeTasks.length} task${activeTasks.length === 1 ? '' : 's'} due today`
          }
        </p>
      </div>

      {/* Quick Add for Today */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <QuickAddInput
          onAdd={handleQuickAdd}
          placeholder="Add a task for today..."
        />
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Due Today
            <span className="ml-2 bg-gradient-to-r from-warning to-yellow-500 text-white text-sm px-2 py-1 rounded-full">
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

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Completed Today
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
          title="No tasks for today"
          message="You don't have any tasks due today. Add some tasks to stay focused and productive!"
          actionLabel="Add Task for Today"
          onAction={() => setIsTaskModalOpen(true)}
          icon="Calendar"
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

export default TodayPage;