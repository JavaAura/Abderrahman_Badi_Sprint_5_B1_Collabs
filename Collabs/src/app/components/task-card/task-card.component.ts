import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/categories/category.service';
import { CommonModule } from '@angular/common';
import { TaskPopupService } from '../../services/task-popup/task-popup.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent implements OnInit {

  @Input() task!: Task;
  category: Category | undefined;

  constructor(private categoryService: CategoryService, private taskPopupService: TaskPopupService) { }

  ngOnInit(): void {
    this.categoryService.getCategoryById(this.task.categoryId).subscribe(category => {
      this.category = category;
    });
  }

  openEditForm() {
    this.taskPopupService.openEditPopup(this.task);
  }

}
