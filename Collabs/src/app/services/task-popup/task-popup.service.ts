import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskPopupService {

  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private currentTaskSubject = new BehaviorSubject<Task | null>(null);
  private statusSubject = new BehaviorSubject<'to-do' | 'in-progress' | 'completed' | null>(null);
  private editModeSubject = new BehaviorSubject<boolean>(false);

  isOpen$ = this.isOpenSubject.asObservable();
  currentTask$ = this.currentTaskSubject.asObservable();
  status$ = this.statusSubject.asObservable();
  editMode$ = this.editModeSubject.asObservable();

  openCreatePopup(status: 'to-do' | 'in-progress' | 'completed') {
    this.statusSubject.next(status);
    this.editModeSubject.next(false);
    this.currentTaskSubject.next(null);
    this.isOpenSubject.next(true);
  }

  openEditPopup(task: Task) {
    this.currentTaskSubject.next(task);
    this.editModeSubject.next(true);
    this.statusSubject.next(task.status);
    this.isOpenSubject.next(true);
  }

  closePopup() {
    this.isOpenSubject.next(false);
    this.currentTaskSubject.next(null);
    this.statusSubject.next(null);
    this.editModeSubject.next(false);
  }


}
