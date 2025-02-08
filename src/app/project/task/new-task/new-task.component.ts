import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-new-task',
  imports: [FormsModule],
  templateUrl: './new-task.component.html'
})
export class NewTaskComponent {
  projectId!: number;
  http = inject(HttpClient);
  data: any;
  currentUserId!: number;

  task: any = {
    name: null,
    description: null,
    priority: null,
    status: null,
    endDate: null,
    assigneeId: null
  };

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    initFlowbite();
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUserId = this.getCurrentUserId() ?? 0;
    if (this.projectId) {
      this.getProjectMembers();
    }
  }

  openModal() {
    const modalElement = document.getElementById('crud-modal');
    if (modalElement) {
      modalElement.classList.remove('hidden');
    }
  }

  closeModal() {
    const modalElement = document.getElementById('crud-modal');
    if (modalElement) {
      modalElement.classList.add('hidden');
    }
  }

  getCurrentUserId() {
    return this.authService.getCurrentUserId();
  }

  getProjectMembers() {
    const id = this.projectId;
    const apiUrl = `http://localhost:8080/api/projects/${id}/members`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.data = response;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  newTask() {
    const apiUrl = `http://localhost:8080/api/tasks`;
    const body = {
      name: this.task.name,
      description: this.task.description,
      priority: this.task.priority,
      status: this.task.status,
      endDate: this.task.endDate,
      projectId: this.projectId, 
      assigneeId: this.task.assigneeId,
      createdById: this.currentUserId 
    };

    console.log("body : ", body)

    this.http.post(apiUrl, body).subscribe(
      (res: any) => {
        if (res && !res.error) {
          console.log('Tâche créée avec succès :', res);
          this.closeModal();
          window.location.reload();
        } else {
          console.error('Erreur lors de la création de la tâche :', res);
        }
      },
      (error) => {
        console.error('Erreur lors de la création de la tâche :', error);
      }
    );
  }

}
