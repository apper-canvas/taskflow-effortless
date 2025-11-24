import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import TaskList from "@/components/organisms/TaskList";
import TaskModal from "@/components/organisms/TaskModal";
import QuickAddInput from "@/components/molecules/QuickAddInput";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const ListPage = () => {
  const { listId } = useParams();
  const { lists, onRefresh } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const currentList = lists.find(list => list.Id === parseInt(listId));

  useEffect(() => {
    if (listId) {
      loadTasks();
    }

    // Listen for task updates from other components
    const handleTaskUpdate = () => {
      loadTasks();
    };

    window.addEventListener("taskUpdated", handleTaskUpdate);
    return () => window.removeEventListener("taskUpdated", handleTaskUpdate);
  }, [listId]);

  const loadTasks = async () => {
    if (!listId) return;
    
    try {
      setLoading(true);
      setError("");
      const allTasks = await taskService.getAll();
      
      // Filter tasks for this specific list
      const listTasks = allTasks.filter(task => task.listId === listId);
      
      setTasks(listTasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks for this list");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (taskData) => {
    try {
      // Assign to current list
      await taskService.create({
        ...taskData,
        listId: listId
      });
      
      await loadTasks();
      onRefresh();
      toast.success(`Task added to ${currentList?.name || 'list'}!`);
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
        await taskService.create({
          ...taskData,
          listId: listId
        });
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

  if (!currentList) {
    return (
      <ErrorView
        title="List not found"
        message="The requested list could not be found."
      />
    );
  }

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

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: currentList.color }}
          />
          <h1 className="text-2xl font-bold text-gray-900">{currentList.name}</h1>
        </div>
        <p className="text-gray-600">
          {tasks.length === 0 
            ? "No tasks in this list yet" 
            : `${activeTasks.length} active, ${completedTasks.length} completed`
          }
        </p>
      </div>

      {/* Quick Add for This List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-3">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: currentList.color }}
          />
          <span className="text-sm font-medium text-gray-700">
            Add task to {currentList.name}
          </span>
        </div>
        <QuickAddInput
          onAdd={handleQuickAdd}
          placeholder={`Add a new task to ${currentList.name}...`}
        />
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Active Tasks
            <span 
              className="ml-2 text-white text-sm px-2 py-1 rounded-full"
              style={{ backgroundColor: currentList.color }}
            >
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
            Completed Tasks
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
          title={`No tasks in ${currentList.name}`}
          message={`Start organizing your work by adding tasks to your ${currentList.name} list.`}
          actionLabel="Add First Task"
          onAction={() => setIsTaskModalOpen(true)}
          icon="List"
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

export default ListPage;