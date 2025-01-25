import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-member',
  imports: [FormsModule],
  templateUrl: './new-member.component.html',
  styles: ``
})
export class NewMemberComponent {
  projectId!: number;
  http = inject(HttpClient);

  currentUserId!: number;


  member: any = {
    userId: 0,
    role: null,
  };




  constructor(private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    initFlowbite();
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.currentUserId = this.getCurrentUserId() ?? 0;
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

  newMember() {
    const apiUrl = `http://localhost:8080/api/projects/${this.projectId}/invite?currentUserId=${this.currentUserId}`;
    const body = {
      email: this.member.email,
      role: this.member.role,
    };

    this.http.post(apiUrl, body).subscribe(
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
