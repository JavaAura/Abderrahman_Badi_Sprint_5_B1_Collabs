import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CategoryService } from '../../../services/categories/category.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import { TaskService } from '../../../services/tasks/task.service';
import { Category } from '../../../models/category.model';

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
export class TaskFormComponent implements OnInit, OnChanges{
  @Input() editMode = false;
  @Input() status?: 'to-do' | 'in-progress' | 'completed';
  @Input() set taskToEdit(task: Task | null) {
    if (task) {
      const formattedDate = task.dueDate instanceof Date
        ? task.dueDate.toISOString().split('T')[0]
        : new Date(task.dueDate).toISOString().split('T')[0];

      this.taskForm.patchValue({
        title: task.title,
        description: task.description || '',
        dueDate: formattedDate,
        priority: task.priority,
        status: task.status,
        categoryId: task.categoryId
      });

      this.taskId = task.id;
    }
  }

  taskForm: FormGroup;
  categories: Category[] = [];
  isSubmitting = false;
  private taskId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: ['', [Validators.required, notInThePastValidator()]],
      priority: ['', Validators.required],
      status: this.status,
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.categoryService.categories$.subscribe(
      categories => this.categories = categories
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['status'] && this.taskForm) {
      this.taskForm.patchValue({ status: this.status });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit() {
    console.log(this.status);
    console.log(this.taskForm.value);
    if (this.taskForm.invalid) return;

    this.isSubmitting = true;
    try {
      const taskData = this.taskForm.value;
      const task: Task = {
        id: this.taskId || '',
        ...taskData,
        dueDate: new Date(taskData.dueDate)
      };

      if (this.editMode && this.taskId) {
        this.taskService.updateTask(this.taskId, task);
      } else {
        this.taskService.addTask(task);
      }

      this.taskId = null;
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      this.isSubmitting = false;
    }
  }
}
