import { LightningElement, api } from "lwc";
import updateTodo from "@salesforce/apex/ToDoController.updateTodo";
import deleteTodo from "@salesforce/apex/ToDoController.deleteTodo";

export default class ToDoItem extends LightningElement {
  @api todo;

  async updateHandler() {
    const todo = {
      id: this.todo.id,
      name: this.todo.name,
      done: !this.todo.done
    };
    try {
      const id = await updateTodo({ payload: JSON.stringify(todo) });
      const updateEvent = new CustomEvent("update", { detail: { id } });
      this.dispatchEvent(updateEvent);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteHandler() {
    try {
      const id = await deleteTodo({ todoId: this.todo.id });
      const deleteEvent = new CustomEvent("delete", { detail: { id } });
      this.dispatchEvent(deleteEvent);
    } catch (error) {
      console.log(error);
    }
  }

  get isCompleted() {
    return this.todo.done
      ? "todo-item todo-completed"
      : "todo-item todo-upcoming";
  }
  get iconName() {
    return this.todo.done ? "utility:check" : "utility:add";
  }
}
