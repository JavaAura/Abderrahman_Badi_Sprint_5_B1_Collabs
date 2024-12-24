import { Injectable } from '@angular/core';
import { Category } from '../../models/category.model';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly LOCAL_STORAGE_KEY = 'categories';

  private categoriesSubject = new BehaviorSubject<Category[]>(this.loadCategoriesFromLocalStorage());
  readonly categories$ = this.categoriesSubject.asObservable();

  constructor() {
    try {
      this.loadCategoriesFromLocalStorage();
    } catch (error) {
      console.error('Failed to load categories:', error);
      this.categoriesSubject.next([]);
    }
  }

  private loadCategoriesFromLocalStorage(): Category[] {
    try {
      const storedCategories = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return storedCategories ? JSON.parse(storedCategories) : [];
    } catch (error) {
      console.error('Error loading categories from localStorage:', error);
      return [];
    }
  }

  private saveCategoriesToLocalStorage(categories: Category[]): boolean {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(categories));
      return true;
    } catch (error) {
      console.error('Error saving categories to localStorage:', error);
      return false;
    }
  }

  getCategoryById(id: string): Observable<Category | undefined> {
    return this.categories$.pipe(
      map(categories => categories.find(cat => cat.id === id))
    );
  }

  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  addCategory(category: Category): boolean {
    try {
      const currentCategories = this.getCategories();

      if (!category.name?.trim()) {
        throw new Error('Category name is required');
      }

      const newCategories = [...currentCategories, {
        ...category,
        id: category.id || `cat-${Date.now()}-${Math.random().toString(36)}`,
        createdAt: new Date().toISOString()
      }];

      if (this.saveCategoriesToLocalStorage(newCategories)) {
        this.categoriesSubject.next(newCategories);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  }


  updateCategory(categoryId: string, updatedCategory: Partial<Category>): boolean {
    try {
      const currentCategories = this.getCategories();
      const categoryIndex = currentCategories.findIndex(cat => cat.id === categoryId);

      if (categoryIndex === -1) {
        throw new Error(`Category with ID ${categoryId} not found`);
      }

      const newCategories = currentCategories.map(cat =>
        cat.id === categoryId
          ? { ...cat, ...updatedCategory, updatedAt: new Date().toISOString() }
          : cat
      );

      if (this.saveCategoriesToLocalStorage(newCategories)) {
        this.categoriesSubject.next(newCategories);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  }


  removeCategory(categoryId: string): boolean {
    try {
      const currentCategories = this.getCategories();
      const newCategories = currentCategories.filter(cat => cat.id !== categoryId);

      if (newCategories.length === currentCategories.length) {
        throw new Error(`Category with ID ${categoryId} not found`);
      }

      if (this.saveCategoriesToLocalStorage(newCategories)) {
        this.categoriesSubject.next(newCategories);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing category:', error);
      return false;
    }
  }


  isDuplicateCategoryName(name: string, excludeId?: string): boolean {
    const currentCategories = this.getCategories();
    return currentCategories.some(cat =>
      cat.name.toLowerCase() === name.toLowerCase() &&
      (!excludeId || cat.id !== excludeId)
    );
  }


  clearCategories(): boolean {
    try {
      localStorage.removeItem(this.LOCAL_STORAGE_KEY);
      this.categoriesSubject.next([]);
      return true;
    } catch (error) {
      console.error('Error clearing categories:', error);
      return false;
    }
  }

}
