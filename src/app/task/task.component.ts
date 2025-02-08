import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewTaskComponent } from './new-task/new-task.component';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-task',
  imports: [NewTaskComponent, RouterLink],
  templateUrl: './task.component.html',
})
export class TaskComponent {
  projectId!: number;
  data: any;
  http = inject(HttpClient);

  todoTasks: any[] = [];
  inProgressTasks: any[] = [];
  doneTasks: any[] = [];
  closedTasks: any[] = [];

  taskToDelete: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/error']);
      }
    });
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.projectId) {
      this.loadProjectDetails();
    }
  }


  // AFFICAGE
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


  // DELETE
  openDeleteModal(task: any) {
    this.taskToDelete = task;
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeDeleteModal() {
    this.taskToDelete = null;
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  deleteTask() {
    if (this.taskToDelete) {
      const apiUrl = `http://localhost:8080/api/tasks/${this.taskToDelete.id}`;

      this.http.delete(apiUrl).subscribe(
        () => {
          this.loadProjectDetails();
          this.closeDeleteModal();
        },
        (error) => {
          console.error('Erreur lors de la suppression de la tâche :', error);
          this.closeDeleteModal();
        }
      );
    }
  }
}
