import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task.component.html',
  styles: ``
})
export class TaskComponent {
  projectId!: number;
  data: any;
  http = inject(HttpClient);

  todoTasks: any[] = []; 
  inProgressTasks: any[] = []; 
  doneTasks: any[] = []; 
  closedTasks: any[] = []; 

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.projectId) {
      this.loadProjectDetails();
    }
  }

  loadProjectDetails() {
    const id = this.projectId;
    const apiUrl = `http://localhost:8080/api/tasks/project/${id}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.data = response;
        this.filterTasksByStatus();
        // console.log(this.data)
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  filterTasksByStatus() {
    this.todoTasks = this.data.filter((task: any) => task.status === 'TODO');
    this.inProgressTasks = this.data.filter((task: any) => task.status === 'IN_PROGRESS');
    this.doneTasks = this.data.filter((task: any) => task.status === 'DONE');
    this.closedTasks = this.data.filter((task: any) => task.status === 'CLOSED');
  }
}
