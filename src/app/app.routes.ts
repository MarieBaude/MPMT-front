import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TableComponent } from './table/table.component';

export const routes: Routes = [
    { path: '', component: TableComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '' }
];
