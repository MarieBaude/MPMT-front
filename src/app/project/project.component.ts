import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-project',
  imports: [FormsModule, RouterLink],
  templateUrl: './project.component.html'
})
export class ProjectComponent {
  menuItems = [
    "Nom",
    "Rôle",
    "Action"
  ];

  createdProjects: any[] = [];
  otherProjects: any[] = [];
  currentUsername: string = '';

  rolesForCreatedProjects: { [projectName: string]: string } = {}; 
  rolesForOtherProjects: { [projectName: string]: string } = {};  
  http = inject(HttpClient);

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/error']);
      }
    });

    this.loadProjects();
  }

  getCurrentUserId() {
    return this.authService.getCurrentUserId();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  loadProjects() {
    const userId = this.getCurrentUserId();
    this.currentUsername = this.getCurrentUser() || '';

    const apiUrl = `http://localhost:8080/api/projects/user/${userId}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.createdProjects = response.filter((project: any) => project.createdById === userId);
        this.otherProjects = response.filter((project: any) => project.createdById !== userId);

        this.createdProjects.forEach((project) => {
          const role = project.projectRoles.find((role: any) => role.username === this.currentUsername);
          if (role) {
            this.rolesForCreatedProjects[project.name] = role.role; 
          }
        });

        this.otherProjects.forEach((project) => {
          const role = project.projectRoles.find((role: any) => role.username === this.currentUsername);
          if (role) {
            this.rolesForOtherProjects[project.name] = role.role; 
          }
        });
      },
      (error) => {
        console.log('Erreur lors de la récupération des données :', error);
      }
    );
  }
}
