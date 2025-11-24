import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const QuickAddInput = ({ onAdd, placeholder = "Add a new task...", className }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title: title.trim() });
      setTitle("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1"
      />
      <Button 
        type="submit" 
        size="md"
        disabled={!title.trim()}
        className="shrink-0"
      >
        <ApperIcon name="Plus" size={16} />
      </Button>
    </form>
  );
};

export default QuickAddInput;