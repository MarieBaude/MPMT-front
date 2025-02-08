import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HistoryComponent } from "../../history/history.component";
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-details',
  imports: [HistoryComponent],
  templateUrl: './task-details.component.html'
})
export class TaskDetailsComponent {
  data: any;
  taskId!: number;
  http = inject(HttpClient);

  activeTab: 'detail' | 'history' = 'detail';

  
  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }
  
  switchTab(tab: 'detail' | 'history' ): void {
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


  // AFFICAGE
  loadTaskDetails() {
    const id = this.taskId;
    const apiUrl = `http://localhost:8080/api/tasks/${id}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.data = response;
        console.log(this.data)
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

}
