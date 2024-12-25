import { Component, HostListener, OnInit } from '@angular/core';
import { TaskCardComponent } from "../task-card/task-card.component";
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/tasks/task.service';
import { TaskFormComponent } from "../forms/task-form/task-form.component";

@Component({
  selector: 'app-task-container',
  standalone: true,
  imports: [TaskCardComponent, CommonModule, DragDropModule, TaskFormComponent],
  templateUrl: './task-container.component.html',
  styleUrl: './task-container.component.css'
})
export class TaskContainerComponent implements OnInit {

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  isOpen: boolean = false;

  status?: 'to-do' | 'in-progress' | 'completed';
  currentTask: Task | null = null;
  isEdited = false;


  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => {
      this.todoTasks = tasks.filter(task => task.status === 'to-do');
      this.inProgressTasks = tasks.filter(task => task.status === 'in-progress');
      this.completedTasks = tasks.filter(task => task.status === 'completed');
    });
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {      
      const task = event.item.data as Task;
      const newStatus = this.getStatusFromContainer(event.container.id);
      console.log(event.container.id);
      
      try {
        this.taskService.updateTask(task.id, {
          ...task,
          status: newStatus
        });

        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    }
  }

  private getStatusFromContainer(containerId: string): Task['status'] {
    const statusMap: Record<string, Task['status']> = {
      'cdk-drop-list-0': 'to-do',
      'cdk-drop-list-1': 'in-progress',
      'cdk-drop-list-2': 'completed'
    };
    return statusMap[containerId] || 'to-do';
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.isOpen && (target.closest('.task-popup-background') && !target.closest('.task-form-container'))) {
      this.isOpen = false;
    }
  }

  toggleTaskForm(status?: 'completed' | 'in-progress' | 'to-do', isEdited: boolean = false, task?: Task) {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.status = status;
      this.isEdited = isEdited;
      this.currentTask = task || null;
    }
  }

}
