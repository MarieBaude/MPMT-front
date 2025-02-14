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
  taskId!: number;
  projectId: number | null = null;
  http = inject(HttpClient);

  activeTab: 'detail' | 'history' = 'detail';

  taskToDelete: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  switchTab(tab: 'detail' | 'history'): void {
    this.activeTab = tab;
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/error']);
      }
    });
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTaskDetails();
  }

  loadTaskDetails() {
    const id = this.taskId;
    const apiUrl = `http://localhost:8080/api/tasks/${id}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.task = response;
        this.projectId = this.task.projects.id;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  saveChanges(): void {

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
