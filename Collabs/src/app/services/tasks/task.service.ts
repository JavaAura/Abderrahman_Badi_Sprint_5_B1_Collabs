import { Injectable } from '@angular/core';
import { Task } from '../../models/task.model';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly LOCAL_STORAGE_KEY = 'tasks';

  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasksFromLocalStorage());
  readonly tasks$ = this.tasksSubject.asObservable();

  constructor() {
      try {
        this.loadTasksFromLocalStorage();
      } catch (error) {
        console.error('Failed to load tasks:', error);
        this.tasksSubject.next([]);
      }
    }
  
    private loadTasksFromLocalStorage(): Task[] {
      try {
        const storedTasks = localStorage.getItem(this.LOCAL_STORAGE_KEY);
        return storedTasks ? JSON.parse(storedTasks) : [];
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        return [];
      }
    }
  
    private saveTasksToLocalStorage(tasks: Task[]): boolean {
      try {
        localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(tasks));
        return true;
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
        return false;
      }
    }
  
    getTaskById(id: string): Observable<Task | undefined> {
      return this.tasks$.pipe(
        map(tasks => tasks.find(task => task.id === id))
      );
    }
  
    getTasks(): Task[] {
      return this.tasksSubject.getValue();
    }
  
    addTask(task: Task): boolean {
      try {
        const currentTasks = this.getTasks();
  
        if (!task.title?.trim()) {
          throw new Error('Task name is required');
        }
  
        const newTasks = [...currentTasks, {
          ...task,
          id: task.id || `task-${Date.now()}-${Math.random().toString(36)}`,
          createdAt: new Date().toISOString()
        }];
  
        if (this.saveTasksToLocalStorage(newTasks)) {
          this.tasksSubject.next(newTasks);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error adding task:', error);
        return false;
      }
    }
  
  
    updateTask(taskId: string, updatedTask: Partial<Task>): boolean {
      try {
        const currentTasks = this.getTasks();
        const taskIndex = currentTasks.findIndex(cat => cat.id === taskId);
  
        if (taskIndex === -1) {
          throw new Error(`Task with ID ${taskId} not found`);
        }
  
        const newTasks = currentTasks.map(cat =>
          cat.id === taskId
            ? { ...cat, ...updatedTask, updatedAt: new Date().toISOString() }
            : cat
        );
  
        if (this.saveTasksToLocalStorage(newTasks)) {
          this.tasksSubject.next(newTasks);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error updating task:', error);
        return false;
      }
    }
  
  
    removeTask(taskId: string): boolean {
      try {
        const currentTasks = this.getTasks();
        const newTasks = currentTasks.filter(cat => cat.id !== taskId);
  
        if (newTasks.length === currentTasks.length) {
          throw new Error(`Task with ID ${taskId} not found`);
        }
  
        if (this.saveTasksToLocalStorage(newTasks)) {
          this.tasksSubject.next(newTasks);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error removing task:', error);
        return false;
      }
    }
  
    clearTasks(): boolean {
      try {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
        this.tasksSubject.next([]);
        return true;
      } catch (error) {
        console.error('Error clearing tasks:', error);
        return false;
      }
    }

}
