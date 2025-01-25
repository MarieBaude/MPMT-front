import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member',
  imports: [FormsModule],
  templateUrl: './member.component.html',
  styles: ``
})
export class MemberComponent {
  @Input() projectData: any;
  memberData: any;
  isModalOpen: boolean = false;
  currentUserId!: number;
  http = inject(HttpClient);
  projectId!: number;

  member: any = {
    userId: null,
    role: null,
  };

  menuItems = [
    "Username",
    "Email",
    "Rôle",
    "Action"
  ];

  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    initFlowbite();
    this.currentUserId = this.getCurrentUserId() ?? 0;
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
  }

  getCurrentUserId() {
    return this.authService.getCurrentUserId();
  }


  openModal() {
    const modalElement = document.getElementById('role-modal');
    if (modalElement) {
      modalElement.classList.remove('hidden');
    }
  }

  closeModal() {
    const modalElement = document.getElementById('role-modal');
    if (modalElement) {
      modalElement.classList.add('hidden');
    }
  }

  changeRole() {
    const apiUrl = `http://localhost:8080/api/projects/${this.projectId}/change-role?currentUserId=${this.currentUserId}`;
    const body = {
      email: this.member.userId,
      role: this.member.role,
    };

    this.http.patch(apiUrl, body).subscribe(
      (res: any) => {
        if (res && !res.error) {
          console.log('Ok', res);
          this.closeModal();
          window.location.reload();
        } else {
          console.error('KO', res);
        }
      }
    );
  }

}

