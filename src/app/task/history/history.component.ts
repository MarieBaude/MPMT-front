import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-history',
  imports: [],
  templateUrl: './history.component.html'
})
export class HistoryComponent {
  history: any;
  historyId!: number;
  projectId: number | null = null;
  http = inject(HttpClient);

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/error']);
      }
    });
    this.historyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTaskDetails();
  }


  loadTaskDetails() {
    const id = this.historyId;
    const apiUrl = `http://localhost:8080/api/histories/task/${id}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.history = response;
        // console.log("this.history", this.history)
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }
}
