import { Component, HostListener, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/categories/category.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/tasks/task.service';
import { Category } from '../../../models/category.model';
import { TaskPopupService } from '../../../services/task-popup/task-popup.service';
import { combineLatest, Subscription } from 'rxjs';

function notInThePastValidator() {
  return (control: AbstractControl): ValidationErrors | null => {

    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate < today ? { pastDate: true } : null;
  };
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {

  taskForm: FormGroup;
  categories: Category[] = [];
  isSubmitting = false;
  private taskId: string | null = null;
  private subscriptions: Subscription[] = [];

  isOpen$ = this.taskPopupService.isOpen$;
  editMode$ = this.taskPopupService.editMode$;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private taskService: TaskService,
    private taskPopupService: TaskPopupService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: ['', [Validators.required, notInThePastValidator()]],
      priority: ['', Validators.required],
      status: [''],
      categoryId: ['', Validators.required]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  ngOnInit() {
    // Subscribe to categories
    this.subscriptions.push(
      this.categoryService.categories$.subscribe(
        categories => this.categories = categories
      )
    );


    const formUpdate$ = combineLatest([
      this.taskPopupService.currentTask$,
      this.taskPopupService.status$
    ]).subscribe(([task, status]) => {
      if (task) {

        const formattedDate = task.dueDate instanceof Date
          ? task.dueDate.toISOString().split('T')[0]
          : new Date(task.dueDate).toISOString().split('T')[0];

        this.taskForm.patchValue({
          title: task.title,
          description: task.description || '',
          dueDate: formattedDate,
          priority: task.priority,
          status: status || task.status,
          categoryId: task.categoryId,
        });

        this.taskId = task.id;
      } else {
        this.taskForm.reset();
        if (status) {
          this.taskForm.patchValue({ status });
        }
        this.taskId = null;
      }
    });
    this.subscriptions.push(formUpdate$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.task-popup-background') && !target.closest('.task-form-container')) {
      this.closePopup();
    }
  }

  closePopup() {
    this.taskPopupService.closePopup();
    this.taskForm.reset();
  }

  onSubmit() {
    if (this.taskForm.invalid) return;
    console.log(this.taskForm.value);

    this.isSubmitting = true;
    try {
      const taskData = this.taskForm.value;
      const task: Task = {
        id: this.taskId || '',
        ...taskData,
        dueDate: new Date(taskData.dueDate)
      };

      if (this.taskId) {
        this.taskService.updateTask(this.taskId, task);
      } else {
        this.taskService.addTask(task);
      }

      this.closePopup();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  deleteTask(){
    if (this.taskId) {
      this.taskService.removeTask(this.taskId);
      this.closePopup();
    }
  }

}
