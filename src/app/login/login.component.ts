import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(private authService: AuthService) { }

  activeTab: 'login' | 'register' = 'login';

  router = inject(Router)

  user: any = {
    "username": "",
    "password": "",
    "email": ""
  }

  log: any = {
    "email": "",
    "password": ""
  }

  http = inject(HttpClient);

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/all-project']);
      }
    });
  }

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
  }

  saveUser() {
    this.http.post('http://localhost:8080/api/users', this.user).subscribe((res: any) => {
      if (res && !res.error) {
        this.resetForm();
        console.log('User saved successfully:', res);
      } else {
        console.error('Failed to save user:', res);
      }
    })
  }

  login() {
    this.http.post('http://localhost:8080/api/login', this.log).subscribe(
      (res: any) => {
        console.log('Connexion réussie :', res);
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.authService.loginUser();
        this.router.navigate(['/project']);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401) {
          alert('Identifiants incorrects. Veuillez vérifier vos informations.');
        } else {
          console.error('Erreur inattendue :', error);
          alert('Une erreur est survenue. Merci de réessayer plus tard.');
        }
      }
    );
  }

  resetForm() {
    this.user = {
      "username": "",
      "password": "",
      "email": ""
    };
  }
  
}
