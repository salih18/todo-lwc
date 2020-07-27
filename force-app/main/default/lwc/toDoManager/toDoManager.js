import { LightningElement, track } from "lwc";
import addTodo from "@salesforce/apex/ToDoController.addTodo";
import getCurrentTodos from "@salesforce/apex/ToDoController.getCurrentTodos";

export default class ToDoManager extends LightningElement {
  time = "8:12 PM";
  greeting = "Good Evening";
  @track todos = [];

  connectedCallback() {
    this.getTime();
    this.fetchTodos();
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setInterval(() => {
      this.getTime();
    }, 1000 * 60);
  }

  getTime() {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes().toString().padStart(2, 0);

    this.time = `${this.getHour(hour)}:${min} ${this.getMidDay(hour)}`;

    this.setGreeting(hour);
  }
  getHour(hour) {
    return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  }

  getMidDay(hour) {
    return hour >= 12 ? "PM" : "AM";
  }

  setGreeting(hour) {
    if (hour < 12 && hour > 6) {
      this.greeting = "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      this.greeting = "Good Afternoon";
    } else this.greeting = "Good Evening";
  }
  async addTodoHandler() {
    const input = this.template.querySelector("lightning-input");
    const todo = {
      name: input.value,
      done: false
    };
    try {
      const response = await addTodo({ payload: JSON.stringify(todo) });
      const newTodo = JSON.parse(response);
      this.todos.unshift(newTodo);
      input.value = "";
    } catch (error) {
      console.log(error);
    }
  }
  get upcomingTasks() {
    const tasks = this.todos.filter((t) => !t.done);
    return tasks;
  }

  get completedTasks() {
    const tasks = this.todos.filter((t) => t.done);
    return tasks;
  }

  deleteHandler({ detail: { id } }) {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  updateHandler({ detail: { id } }) {
    const updateTodo = this.todos.find((t) => t.id === id);
    this.todos = this.todos.map((t) =>
      t.id === updateTodo.id ? { ...updateTodo, done: !updateTodo.done } : t
    );
  }

  async fetchTodos() {
    try {
      const todos = await getCurrentTodos();
      this.todos = todos;
    } catch (error) {
      console.log(error);
    }
  }
}
