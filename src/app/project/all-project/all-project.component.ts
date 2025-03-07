import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-all-project',
  imports: [RouterLink],
  templateUrl: './all-project.component.html',
})
export class AllProjectComponent {
  projects: any[] = [];
  http = inject(HttpClient);

  menuItems = [
    "Nom",
    "Créer par",
    "Action"
  ];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/error']);
      }
    });
    this.loadAllProjects();
  }

  loadAllProjects() {
    const urlApi = 'http://localhost:8080/api/projects';

    this.http.get(urlApi).subscribe(
      (response: any) => {
        this.projects = response;
       
      },
      (error) => {
        console.log('Erreur lors de la récupération des données :', error);
      }
    );
  }
}
