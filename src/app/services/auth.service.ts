import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
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
  }

  getCurrentUser(): string | null {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      return user.username || null; 
    }
    return null;
  }
  
}