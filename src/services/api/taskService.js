import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const taskService = {
  async getAll() {
    await delay();
    return [...tasks];
  },

  async getById(id) {
    await delay();
    const task = tasks.find(task => task.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay();
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const now = new Date().toISOString();
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || "",
      priority: taskData.priority || "medium",
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      listId: taskData.listId || "1",
      createdAt: now,
      updatedAt: now
    };
    tasks.push(newTask);
    
    // Update localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    return { ...newTask };
  },

  async update(id, updates) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const updatedTask = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        completedAt: updates.completed ? new Date().toISOString() : null
      };
      tasks[index] = updatedTask;
      
      // Update localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));
      
      return { ...updatedTask };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const deletedTask = tasks.splice(index, 1)[0];
      
      // Update localStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));
      
      return { ...deletedTask };
    }
    return null;
  },

  // Local storage methods
  loadFromStorage() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      tasks = JSON.parse(stored);
    }
  },

  saveToStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
};

// Initialize from localStorage on module load
taskService.loadFromStorage();