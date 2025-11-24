import listsData from "@/services/mockData/lists.json";

let lists = [...listsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const listService = {
  async getAll() {
    await delay();
    return [...lists];
  },

  async getById(id) {
    await delay();
    const list = lists.find(list => list.Id === parseInt(id));
    return list ? { ...list } : null;
  },

  async create(listData) {
    await delay();
    const maxId = lists.length > 0 ? Math.max(...lists.map(l => l.Id)) : 0;
    const newList = {
      Id: maxId + 1,
      name: listData.name,
      color: listData.color || "#6366F1",
      taskCount: 0,
      createdAt: new Date().toISOString()
    };
    lists.push(newList);
    
    // Update localStorage
    localStorage.setItem("lists", JSON.stringify(lists));
    
    return { ...newList };
  },

  async update(id, updates) {
    await delay();
    const index = lists.findIndex(list => list.Id === parseInt(id));
    if (index !== -1) {
      const updatedList = {
        ...lists[index],
        ...updates
      };
      lists[index] = updatedList;
      
      // Update localStorage
      localStorage.setItem("lists", JSON.stringify(lists));
      
      return { ...updatedList };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = lists.findIndex(list => list.Id === parseInt(id));
    if (index !== -1) {
      const deletedList = lists.splice(index, 1)[0];
      
      // Update localStorage
      localStorage.setItem("lists", JSON.stringify(lists));
      
      return { ...deletedList };
    }
    return null;
  },

  // Local storage methods
  loadFromStorage() {
    const stored = localStorage.getItem("lists");
    if (stored) {
      lists = JSON.parse(stored);
    }
  },

  saveToStorage() {
    localStorage.setItem("lists", JSON.stringify(lists));
  },

  async updateTaskCount(listId, count) {
    await delay();
    const index = lists.findIndex(list => list.Id === parseInt(listId));
    if (index !== -1) {
      lists[index].taskCount = count;
      localStorage.setItem("lists", JSON.stringify(lists));
      return { ...lists[index] };
    }
    return null;
  }
};

// Initialize from localStorage on module load
listService.loadFromStorage();