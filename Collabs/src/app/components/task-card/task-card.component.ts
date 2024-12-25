import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/categories/category.service';
import { CommonModule } from '@angular/common';

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

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategoryById(this.task.categoryId).subscribe(category => {
      this.category = category;
    });
  }

  showDetails(task: Task) {
    throw new Error('Method not implemented.');
  }

}
