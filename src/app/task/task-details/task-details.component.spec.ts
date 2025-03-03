import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskDetailsComponent } from './task-details.component';
import { AuthService } from '../../services/auth.service';
import { HistoryComponent } from '../history/history.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

class MockAuthService {
  isLoggedIn$ = of(true); // Simule un utilisateur connecté
  getCurrentUserId() {
    return 1; // Simule un ID d'utilisateur
  }
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: jest.fn().mockReturnValue('1'), // Simule un ID de tâche
    },
  };
}

class MockRouter {
  navigate = jest.fn(); // Simule la navigation
}

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]), // Configurez RouterTestingModule avec des routes vides
        FormsModule,
        // RouterModule, // Ajoutez RouterModule ici
        TaskDetailsComponent, // Importez le composant standalone
        HistoryComponent, // Importez HistoryComponent si nécessaire
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);

    // Simule une réponse pour la requête HTTP déclenchée par ngOnInit
    fixture.detectChanges(); // Déclenche ngOnInit
    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    req.flush({ id: 1, name: 'Test Task', projects: { id: 1 } }); // Simule une réponse réussie
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP en attente
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load task details on init', () => {
    expect(component.task).toEqual({ id: 1, name: 'Test Task', projects: { id: 1 } });
    expect(component.projectId).toBe(1);
  });

  it('should switch tab', () => {
    component.switchTab('history');
    expect(component.activeTab).toBe('history');
  });

  it('should save changes', () => {
    const mockTask = { id: 1, name: 'Updated Task', description: 'Updated Description' };
    component.task = mockTask;

    component.saveChanges();

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/1?userId=1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({
      name: 'Updated Task',
      description: 'Updated Description',
    });
    req.flush({}); // Simule une réponse HTTP réussie

    expect(component.errorMessage).toBeNull();
  });

  it('should delete task', () => {
    const mockTask = { id: 1, name: 'Task to Delete' };
    component.taskToDelete = mockTask;

    component.deleteTask();

    const deleteReq = httpMock.expectOne('http://localhost:8080/api/tasks/1');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({}); // Simule une réponse HTTP réussie

    expect(router.navigate).toHaveBeenCalledWith(['/project', null]);
  });
});