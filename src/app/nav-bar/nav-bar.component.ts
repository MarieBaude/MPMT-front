import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit{
  ngOnInit(): void {
    initFlowbite();
  }
}
