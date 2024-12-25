import { Component, HostListener } from '@angular/core';
import { CategoryService } from '../../services/categories/category.service';
import { CategoryFormComponent } from "../forms/category-form/category-form.component";
import { CommonModule } from '@angular/common';
import { TaskContainerComponent } from "../task-container/task-container.component";
import { SearchBarComponent } from "../search-bar/search-bar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CategoryFormComponent, CommonModule, TaskContainerComponent, SearchBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isOpen: boolean = false;

  constructor(private categoryService: CategoryService) { }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (this.isOpen && (target.closest('.popup-background') && !target.closest('.form-container'))) {
      this.isOpen = false;
    }
  }
  
  toggleCategoryForm(): void {
    if(this.isOpen){
      this.isOpen = false;
    }else{
      this.isOpen = true;
    }
  }
}
