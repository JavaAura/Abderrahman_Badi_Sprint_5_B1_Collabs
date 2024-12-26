import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/tasks/task.service';
import { Task } from '../../models/task.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables)
@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {

  tasks: Task[] = [];
  chart: any;
  completedTasksNumber: number = 0;
  inProgressTasksNumber: number = 0;
  todoTasksNumber: number = 0;
  overdueTasksNumber: number = 0;



  public config = {
    type: 'doughnut' as const,
    data: {
      labels: [
        'To Do',
        'In Progress',
        'Completed'
      ],
      datasets: [{
        label: 'Tasks',
        data: [this.todoTasksNumber, this.inProgressTasksNumber, this.completedTasksNumber],
        backgroundColor: [
          'rgb(255,255,51)',
          'rgb(30,144,255)',
          'rgb(50,205,50)'
        ],
        hoverOffset: 4
      }]
    }
  };


  constructor(private taskService: TaskService) {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = [...tasks]
    })
    
  }

  ngOnInit() {
    this.completedTasksNumber = this.tasks.filter((task) => task.status === 'completed').length;
    this.todoTasksNumber = this.tasks.filter((task) => task.status === 'to-do').length;
    this.inProgressTasksNumber = this.tasks.filter((task) => task.status === 'in-progress').length;
    this.overdueTasksNumber = this.tasks.filter((task) => new Date(task.dueDate).getTime() < Date.now()).length;

    this.config.data.datasets[0].data = [
      this.todoTasksNumber,
      this.inProgressTasksNumber, 
      this.completedTasksNumber
    ];
  
    if (this.chart) {
      this.chart.destroy();
    }  

    this.chart = new Chart("TaskChart", this.config); 
  }


}