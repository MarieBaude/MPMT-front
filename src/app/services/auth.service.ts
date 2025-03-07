import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private router: Router) {
    this.checkLoginStatus();
  }


  checkLoginStatus(): void {
    const currentUser = localStorage.getItem('currentUser');
    this.loggedInSubject.next(!!currentUser);
  }

  loginUser(): void {
    this.loggedInSubject.next(true);
  }

  logoutUser(): void {
    localStorage.removeItem('currentUser');
    this.loggedInSubject.next(false);
    this.router.navigate(['/']);
  }

  getCurrentUser(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.username || null;  
    }
    return null;
  }

  getCurrentUserId(): number | null {
    const currentUserId = localStorage.getItem('currentUser');
    if (currentUserId) {
      const user = JSON.parse(currentUserId);
      return user.id || null;  
    }
    return null;
  }
}