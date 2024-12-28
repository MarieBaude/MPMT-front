import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-member',
  imports: [],
  templateUrl: './member.component.html',
  styles: ``
})
export class MemberComponent {
  projectId!: number;
  http = inject(HttpClient);

  menuItems = [
    "Username",
    "Email",
    "Rôle",
    "Action"
  ];

  @Input() projectData: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('projectData:', this.projectData);
  }

}
