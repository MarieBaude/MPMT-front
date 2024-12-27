import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TableComponent } from './table/table.component';
import { ProjectComponent } from './project/project.component';
import { NewProjectComponent } from './project/new-project/new-project.component';
import { ErrorComponent } from './error/error.component';

export const routes: Routes = [
    { path: '', component: TableComponent },
    { path: 'login', component: LoginComponent },
    { path: 'project', component: ProjectComponent },
    { path: 'new-project', component: NewProjectComponent },
    { path: 'error', component: ErrorComponent },
    { path: '**', redirectTo: 'error' }
];
