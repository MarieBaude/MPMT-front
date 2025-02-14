import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HistoryComponent } from "../history/history.component";
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-task-details',
  imports: [HistoryComponent, FormsModule, RouterModule],
  templateUrl: './task-details.component.html'
})
export class TaskDetailsComponent {
  task: any;
  data: any;
  taskId!: number;
  projectId: number | null = null;
  http = inject(HttpClient);
  errorMessage: string | null = null;
  currentUserId!: number;

  activeTab: 'detail' | 'history' = 'detail';

  taskToDelete: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  getCurrentUserId() {
    return this.authService.getCurrentUserId();
  }

  switchTab(tab: 'detail' | 'history'): void {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/error']);
      }
    });
    this.currentUserId = this.getCurrentUserId() ?? 0;
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTaskDetails();
    // this.getProjectMembers();
  }

  loadTaskDetails() {
    const id = this.taskId;
    const apiUrl = `http://localhost:8080/api/tasks/${id}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.task = response;
        this.projectId = this.task.projects.id;

        if (this.projectId) {
          this.getProjectMembers();
        }
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  getProjectMembers() {
    const apiUrl = `http://localhost:8080/api/projects/${this.projectId}/members`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.data = response;
        // console.log("data", this.data)
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  saveChanges(): void {
    const taskId = this.taskId;
    const currentUserId = this.currentUserId;
  
    const body: any = {};
  
    if (this.task.name !== undefined) {
      body.name = this.task.name;
    }
    if (this.task.description !== undefined) {
      body.description = this.task.description;
    }
    if (this.task.priority !== undefined) {
      body.priority = this.task.priority;
    }
    if (this.task.status !== undefined) {
      body.status = this.task.status;
    }
    if (this.task.endDate !== undefined) {
      body.endDate = this.task.endDate;
    }
    if (this.task.assignee?.id !== undefined) {
      body.assigneeId = this.task.assignee.id;
    }
  
    const apiUrl = `http://localhost:8080/api/tasks/${taskId}?userId=${currentUserId}`;
  
    this.http.patch(apiUrl, body).subscribe(
      (response: any) => {
        // console.log('Tâche mise à jour avec succès :', response);
        this.errorMessage = null;
        this.loadTaskDetails();
      },
      (error: any) => {
        console.error('Erreur lors de la mise à jour de la tâche :', error);
        this.errorMessage = error.error?.message || 'Une erreur est survenue lors de la mise à jour de la tâche.';
      }
    );
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
          this.loadTaskDetails();
          this.closeDeleteModal();
          if (this.projectId) {
            this.router.navigate(['/project', this.projectId]);
          }
        },
        (error) => {
          console.error('Erreur lors de la suppression de la tâche :', error);
          this.closeDeleteModal();
        }
      );
    }
  }

}
