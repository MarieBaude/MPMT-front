import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
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

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
  }

  saveUser() {
    this.http.post('http://localhost:8080/api/users', this.user).subscribe((res: any) => {
      if (res && res.success) {
        console.log('User saved successfully:', res);
      } else {
        console.error('Failed to save user:', res);
      }
    })
  }

  login() {
    this.http.post('http://localhost:8080/api/login', this.log).subscribe(
      (res: any) => {
        localStorage.setItem('currentUser', JSON.stringify(res));
        this.router.navigate(['/']);
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
  
}
