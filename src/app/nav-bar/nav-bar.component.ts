import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit{
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    initFlowbite();
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    const currentUser = localStorage.getItem('currentUser');
    this.isLoggedIn = !!currentUser;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
  }
  
}
