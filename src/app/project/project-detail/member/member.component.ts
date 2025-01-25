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
  isModalOpen: boolean = false;
  currentUserId!: number;
  http = inject(HttpClient);
  projectId!: number;
  memberData: any[] = [];

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

    this.memberData = this.projectData.projectRoles.map((role: any) => ({
      userId: role.user.id,
      role: role.role,
    }));
  }

  getCurrentUserId() {
    return this.authService.getCurrentUserId();
  }

  changeRole(index: number) {
    const apiUrl = `http://localhost:8080/api/projects/${this.projectId}/change-role?currentUserId=${this.currentUserId}`;
    const body = {
      userId: this.memberData[index].userId,  
      role: this.memberData[index].role,    
    };
    
    this.http.patch(apiUrl, body).subscribe(
      (res: any) => {
        if (res && !res.error) {
          console.log('Ok', res);
          window.location.reload();
        } else {
          console.error('KO', res);
        }
      }
    );
  }

}

