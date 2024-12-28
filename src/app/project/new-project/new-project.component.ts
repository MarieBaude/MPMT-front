import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-project',
  imports: [FormsModule],
  templateUrl: './new-project.component.html'
})
export class NewProjectComponent {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/error']);
      }
    });
  }

  getCurrentUserId() {
    return this.authService.getCurrentUserId();
  }

  project: any = {
    "name": "",
    "createdById": null
  };

  http = inject(HttpClient);

  createProject() {
    this.project.createdById = this.getCurrentUserId();
    this.http.post('http://localhost:8080/api/projects/create', this.project).subscribe((res: any) => {
      if (res && res.success) {
        console.log('Project created successfully:', res);
      } else {
        console.error('Failed to create project:', res);
      }
    })
  }

}
