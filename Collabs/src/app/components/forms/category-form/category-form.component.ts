import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/categories/category.service';
import { NotificationService } from '../../../services/notifications/notification.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {
  categoryForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;

    this.isSubmitting = true;
      const categoryData = this.categoryForm.value;
      if(this.categoryService.addCategory({
        id: '', 
        name: categoryData.name
      })){
        this.categoryForm.reset();
        this.notificationService.emitNotification("Category added successfully!", 'success');
      }else{
        this.notificationService.emitNotification("Error adding category", 'error');
      }

      this.isSubmitting = false;
  }
}
