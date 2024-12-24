import { Injectable } from '@angular/core';
import { Task } from '../../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly LOCAL_STORAGE_KEY = 'tasks';

  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasksFromLocalStorage());
  tasks$ = this.tasksSubject.asObservable();

  constructor() { }

  private loadTasksFromLocalStorage(): Task[] {
    const storedTasks = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return storedTasks ? JSON.parse(storedTasks) : [];
  }

  private saveTasksToLocalStorage(tasks: Task[]): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  addTask(task: Task): void {
    const currentTasks = this.getTasks();
    currentTasks.push(task);
    this.saveTasksToLocalStorage(currentTasks);
    this.tasksSubject.next(currentTasks);
  }

  updateTask(taskId: string, updatedTask: Task): void {
    const currentTasks = this.getTasks();
    const taskIndex = currentTasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {

      currentTasks[taskIndex] = { ...currentTasks[taskIndex], ...updatedTask };
  
      this.saveTasksToLocalStorage(currentTasks);
  
      this.tasksSubject.next(currentTasks);
    } else {
      console.error(`Task with ID ${taskId} not found.`);
    }
  }

  removeTask(taskId: string): void {
    const currentTasks = this.getTasks();
    const updatedTasks = currentTasks.filter(cat => cat.id !== taskId);
    this.saveTasksToLocalStorage(updatedTasks);
    this.tasksSubject.next(updatedTasks);
  }

}
