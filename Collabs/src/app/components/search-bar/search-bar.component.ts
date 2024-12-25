import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, fromEvent, map, Observable, of, Subscription, switchMap } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/tasks/task.service';
import { TaskPopupService } from '../../services/task-popup/task-popup.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  searchResults: Task[] = [];
  showResults = false;
  noResults = false;
  private subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private taskPopupService: TaskPopupService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(searchTerm => {
          if (!searchTerm || searchTerm.length < 2) {
            this.searchResults = [];
            this.showResults = false;
            return of([]);
          }
          return this.searchTasks(searchTerm);
        })
      ).subscribe(results => {
        this.searchResults = results;
        this.showResults = true;
        this.noResults = results.length === 0;
      })
    );

    // Close results when clicking outside
    this.subscription.add(
      fromEvent(document, 'click').pipe(
        filter(event => {
          const target = event.target as HTMLElement;
          return !target.closest('.search-container');
        })
      ).subscribe(() => {
        this.showResults = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private searchTasks(searchTerm: string): Observable<Task[]> {
    return this.taskService.tasks$.pipe(
      map(tasks => 
        tasks.filter(task => 
          task.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  selectTask(task: Task) {
    this.taskPopupService.openEditPopup(task);
    this.showResults = false;
    this.searchControl.setValue('', { emitEvent: false });
  }

}
