import { Injectable } from '@angular/core';
import { Category } from '../../models/category.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly LOCAL_STORAGE_KEY = 'categories';

  private categoriesSubject = new BehaviorSubject<Category[]>(this.loadCategoriesFromLocalStorage());
  categories$ = this.categoriesSubject.asObservable();

  constructor() {}

  private loadCategoriesFromLocalStorage(): Category[] {
    const storedCategories = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return storedCategories ? JSON.parse(storedCategories) : [];
  }

  private saveCategoriesToLocalStorage(categories: Category[]): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(categories));
  }

  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  addCategory(category: Category): void {
    const currentCategories = this.getCategories();
    currentCategories.push(category);
    this.saveCategoriesToLocalStorage(currentCategories);
    this.categoriesSubject.next(currentCategories);
  }

  updateCategory(categoryId: string, updatedCategory: Partial<Category>): void {
    const currentCategories = this.getCategories();
    const categoryIndex = currentCategories.findIndex(category => category.id === categoryId);
  
    if (categoryIndex !== -1) {
      currentCategories[categoryIndex] = { 
        ...currentCategories[categoryIndex], 
        ...updatedCategory 
      };
  
      this.saveCategoriesToLocalStorage(currentCategories);
  
      this.categoriesSubject.next(currentCategories);
    } else {
      console.error(`Category with ID ${categoryId} not found.`);
    }
  }

  removeCategory(categoryId: string): void {
    const currentCategories = this.getCategories();
    const updatedCategories = currentCategories.filter(cat => cat.id !== categoryId);
    this.saveCategoriesToLocalStorage(updatedCategories);
    this.categoriesSubject.next(updatedCategories);
  }

  isDuplicateCategoryName(name: string): boolean {
    const currentCategories = this.getCategories();
    return currentCategories.some(cat => cat.name.toLowerCase() === name.toLowerCase());
  }
}
