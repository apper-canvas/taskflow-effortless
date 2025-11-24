import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import TaskModal from "@/components/organisms/TaskModal";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { listService } from "@/services/api/listService";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const Layout = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const fetchedLists = await listService.getAll();
      
      // Update task counts for each list
      const tasks = await taskService.getAll();
      const listsWithCounts = fetchedLists.map(list => ({
        ...list,
        taskCount: tasks.filter(task => task.listId === list.Id.toString() && !task.completed).length
      }));
      
      setLists(listsWithCounts);
    } catch (error) {
      console.error("Error loading lists:", error);
      toast.error("Failed to load lists");
    } finally {
      setLoading(false);
    }
  };

  const handleNewList = () => {
    // For now, just show a toast. Could implement list creation modal later
    toast.info("List creation coming soon!");
  };

  const handleNewTask = () => {
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      await taskService.create(taskData);
      setIsTaskModalOpen(false);
      loadLists(); // Refresh counts
toast.success("Task created successfully!");
      
      // Trigger a custom event to refresh task lists
      if (typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent("taskUpdated"));
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          lists={lists} 
          onNewList={handleNewList}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative w-64 h-full bg-white transform transition-transform duration-300">
            <Sidebar 
              lists={lists} 
              onNewList={handleNewList}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden"
              >
                <ApperIcon name="Menu" size={20} />
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
                <p className="text-sm text-gray-600">Organize your work efficiently</p>
              </div>
            </div>

            <Button onClick={handleNewTask} className="shrink-0">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Task
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <Outlet context={{ lists, onRefresh: loadLists }} />
        </main>
      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        lists={lists}
      />
    </div>
  );
};

export default Layout;