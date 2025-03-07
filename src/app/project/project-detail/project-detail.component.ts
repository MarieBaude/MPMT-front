import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MemberComponent } from "../member/member.component";
import { TaskComponent } from "../../task/task.component";
import { NewMemberComponent } from './new-member/new-member.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  imports: [MemberComponent, TaskComponent, NewMemberComponent, DatePipe],
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent {
  projectId!: number;
  data: any;
  http = inject(HttpClient);

  activeTab: 'task' | 'member' | 'detail' = 'task';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.projectId) {
      this.loadProjectDetails();
    }
  }

  loadProjectDetails() {
    const id = this.projectId;
    const apiUrl = `http://localhost:8080/api/projects/${id}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        this.data = response;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  switchTab(tab: 'task' | 'member' | 'detail'): void {
    this.activeTab = tab;
  }

}
