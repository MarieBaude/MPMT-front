import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {
  constructor(private authService: AuthService) { }

  isLoggedIn: boolean = false;
  username: string | null = null;

  ngOnInit(): void {
    initFlowbite();
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.username = this.authService.getCurrentUser();
    });
    this.username = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logoutUser();
  }

}
