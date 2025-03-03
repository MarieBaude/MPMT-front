import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskComponent } from './task.component';
import { AuthService } from '../services/auth.service';
import { NewTaskComponent } from './new-task/new-task.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

class MockAuthService {
  isLoggedIn$ = of(true); 
  getCurrentUserId() {
    return of(1); 
  }
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: jest.fn().mockReturnValue('123'), 
    },
  };
}

class MockRouter {
  navigate = jest.fn(); 
}

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskComponent, 
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should initialize projectId and redirect if user is not logged in', () => {
    (authService as any).isLoggedIn$ = of(false);

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const tasksReq = httpMock.match(`http://localhost:8080/api/tasks/project/${component.projectId}`);
    tasksReq.forEach(req => req.flush([])); 

    const membersReq = httpMock.match(`http://localhost:8080/api/projects/${component.projectId}/members`);
    membersReq.forEach(req => req.flush([])); 

    expect(component.projectId).toBe(123);
    expect(router.navigate).toHaveBeenCalledWith(['/error']); 
  });

  it('should load project details and filter tasks by status', () => {
    const mockTasks = [
      { id: 1, name: 'Task 1', status: 'TODO', priority: 'HIGH', assignee: { username: 'user1' } },
      { id: 2, name: 'Task 2', status: 'IN_PROGRESS', priority: 'MEDIUM', assignee: { username: 'user2' } },
      { id: 3, name: 'Task 3', status: 'DONE', priority: 'LOW', assignee: { username: 'user3' } },
      { id: 4, name: 'Task 4', status: 'CLOSED', priority: 'HIGH', assignee: { username: 'user4' } },
    ];

    component.loadProjectDetails();

    const tasksReq = httpMock.match(`http://localhost:8080/api/tasks/project/${component.projectId}`);
    tasksReq.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks); 
    });

    const membersReq = httpMock.match(`http://localhost:8080/api/projects/${component.projectId}/members`);
    membersReq.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush([]); 
    });

    expect(component.todoTasks.length).toBe(1);
    expect(component.inProgressTasks.length).toBe(1);
    expect(component.doneTasks.length).toBe(1);
    expect(component.closedTasks.length).toBe(1);
  });

  it('should delete a task and reload project details', () => {
    const mockTask = { id: 1, name: 'Task 1', status: 'TODO', priority: 'HIGH', assignee: { username: 'user1' } };
    component.taskToDelete = mockTask;

    component.deleteTask();

    const deleteReq = httpMock.expectOne(`http://localhost:8080/api/tasks/${mockTask.id}`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({}); 

    const reloadReq = httpMock.match(`http://localhost:8080/api/tasks/project/${component.projectId}`);
    reloadReq.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush([]); 
    });

    const membersReq = httpMock.match(`http://localhost:8080/api/projects/${component.projectId}/members`);
    membersReq.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush([]); 
    });

    const modalElement = document.getElementById('popup-modal');
    expect(modalElement?.classList.contains('hidden')).toBe(true);
  });
});