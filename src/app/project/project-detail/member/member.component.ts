import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-member',
  imports: [],
  templateUrl: './member.component.html',
  styles: ``
})
export class MemberComponent {
  memberData: any;

  menuItems = [
    "Username",
    "Email",
    "Rôle",
    "Action"
  ];

  @Input() projectData: any;

}

