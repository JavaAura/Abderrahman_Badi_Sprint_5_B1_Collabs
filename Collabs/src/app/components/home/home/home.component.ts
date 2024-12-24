import { Component } from '@angular/core';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/categories/category.service';
import { TaskCategoryComponent } from '../../task-category/task-category.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TaskCategoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  addCategory(newCategory: Category): void {
    if (!this.categoryService.isDuplicateCategoryName(newCategory.name)) {
      this.categoryService.addCategory(newCategory);
    } else {
      console.error('Category name already exists!');
    }
  }

}
