class TodoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.filter = 'all';
    this.initializeElements();
    this.setupEventListeners();
    this.render();
  }

  initializeElements() {
    this.taskInput = document.getElementById('taskInput');
    this.addTaskBtn = document.getElementById('addTask');
    this.taskList = document.getElementById('taskList');
    this.taskCount = document.getElementById('taskCount');
    this.clearCompletedBtn = document.getElementById('clearCompleted');
    this.filterBtns = document.querySelectorAll('.filter-btn');
  }

  setupEventListeners() {
    this.addTaskBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });
    this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
    });
  }

  addTask() {
    const text = this.taskInput.value.trim();
    if (text) {
      const task = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date()
      };
      this.tasks.push(task);
      this.taskInput.value = '';
      this.saveAndRender();
    }
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveAndRender();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveAndRender();
  }

  clearCompleted() {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.saveAndRender();
  }

  setFilter(filter) {
    this.filter = filter;
    this.filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.render();
  }

  getFilteredTasks() {
    switch (this.filter) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-text">${task.text}</span>
      <button class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    `;

    const checkbox = li.querySelector('.task-checkbox');
    checkbox.addEventListener('change', () => this.toggleTask(task.id));

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

    return li;
  }

  render() {
    const filteredTasks = this.getFilteredTasks();
    this.taskList.innerHTML = '';
    filteredTasks.forEach(task => {
      this.taskList.appendChild(this.createTaskElement(task));
    });

    const activeTasks = this.tasks.filter(task => !task.completed).length;
    this.taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
  }

  saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});