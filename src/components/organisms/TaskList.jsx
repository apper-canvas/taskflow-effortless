import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/organisms/TaskCard";

const TaskList = ({ 
  tasks, 
  lists,
  onToggleComplete, 
  onEditTask, 
  onDeleteTask,
  className 
}) => {
  const getListColor = (listId) => {
    const list = lists.find(l => l.Id === parseInt(listId));
    return list?.color || "#6366F1";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskCard
            key={task.Id}
            task={task}
            listColor={getListColor(task.listId)}
            onToggleComplete={onToggleComplete}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;