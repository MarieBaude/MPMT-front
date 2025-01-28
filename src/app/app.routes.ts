import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProjectComponent } from './project/project.component';
import { NewProjectComponent } from './project/new-project/new-project.component';
import { ErrorComponent } from './error/error.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { AllProjectComponent } from './project/all-project/all-project.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'project', component: ProjectComponent },
    { path: 'all-project', component: AllProjectComponent },
    { path: 'new-project', component: NewProjectComponent },
    { path: 'project/:id', component: ProjectDetailComponent },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo: 'error' }
];
