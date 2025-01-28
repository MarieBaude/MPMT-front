import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-all-project',
  imports: [],
  templateUrl: './all-project.component.html',
})
export class AllProjectComponent {

  http = inject(HttpClient);

  ngOnInit() {
    this.loadAllProjects();
  }

  loadAllProjects() {
    const urlApi = 'http://localhost:8080/api/projects';

    this.http.get(urlApi).subscribe(
      (response: any) => {
        console.log('Réponse de l\'API :', response);
       
      },
      (error) => {
        console.log('Erreur lors de la récupération des données :', error);
      }
    );
  }
}
