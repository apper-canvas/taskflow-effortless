import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task = null,
  lists = []
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    listId: "1"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing existing task
        setFormData({
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "medium",
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
          listId: task.listId || "1"
        });
      } else {
        // Creating new task
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          dueDate: "",
          listId: lists[0]?.Id?.toString() || "1"
        });
      }
      setErrors({});
    }
  }, [isOpen, task, lists]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    };

    onSave(taskData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {task ? "Edit Task" : "Create New Task"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={18} />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Task Title"
              placeholder="Enter task title..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={errors.title}
              autoFocus
            />

            <Textarea
              label="Description (Optional)"
              placeholder="Add more details..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </Select>

              <Select
                label="List"
                value={formData.listId}
                onChange={(e) => handleInputChange("listId", e.target.value)}
              >
                {lists.map((list) => (
                  <option key={list.Id} value={list.Id.toString()}>
                    {list.name}
                  </option>
                ))}
              </Select>
            </div>

            <Input
              label="Due Date (Optional)"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;