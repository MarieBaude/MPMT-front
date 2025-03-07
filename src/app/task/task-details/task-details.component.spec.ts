import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetailsComponent } from './task-details.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

class MockAuthService {
  isLoggedIn$ = of(true);
  getCurrentUserId() {
    return 1; 
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
        RouterTestingModule.withRoutes([]),
        TaskDetailsComponent, 
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize taskId and currentUserId on ngOnInit', () => {
    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/123');
    expect(req.request.method).toBe('GET');
    req.flush({});

    expect(component.taskId).toBe(123);
    expect(component.currentUserId).toBe(1);
  });

  it('should load task details', () => {
    const mockTask = {
      id: 123,
      name: 'Test Task',
      description: 'Test Description',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      endDate: '2023-12-31',
      projects: { id: 456 },
    };

    component.ngOnInit();

    const taskReq = httpMock.expectOne('http://localhost:8080/api/tasks/123');
    expect(taskReq.request.method).toBe('GET');
    taskReq.flush(mockTask);

    const membersReq = httpMock.expectOne('http://localhost:8080/api/projects/456/members');
    expect(membersReq.request.method).toBe('GET');
    membersReq.flush([]);

    expect(component.task).toEqual(mockTask);
    expect(component.projectId).toBe(456);
  });

  it('should switch to detail tab', () => {
    component.switchTab('detail');
    expect(component.activeTab).toBe('detail');
  });

  it('should switch to history tab', () => {
    component.switchTab('history');
    expect(component.activeTab).toBe('history');
  });

  it('should save changes', () => {
    const mockTask = {
      id: 123,
      name: 'Updated Task',
      description: 'Updated Description',
      priority: 'HIGH',
      status: 'DONE',
      endDate: '2023-12-31',
      assignee: { id: 2 },
    };

    component.taskId = 123;
    component.currentUserId = 1;
    component.task = mockTask;

    component.saveChanges();

    const reqPatch = httpMock.expectOne('http://localhost:8080/api/tasks/123?userId=1');
    expect(reqPatch.request.method).toBe('PATCH');
    reqPatch.flush(mockTask);
  
    const reqGet = httpMock.expectOne('http://localhost:8080/api/tasks/123');
    expect(reqGet.request.method).toBe('GET');
    reqGet.flush(mockTask);
  
    expect(component.errorMessage).toBeNull();
  });

  it('should delete task', () => {
    const mockTask = { id: 123, projects: { id: 456 } };
    component.taskToDelete = mockTask;
    component.taskId = 123;
    component.projectId = 456;
  
    component.deleteTask();
  
    const reqDelete = httpMock.expectOne('http://localhost:8080/api/tasks/123');
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush({});
  
    const reqTaskDetails = httpMock.expectOne('http://localhost:8080/api/tasks/123');
    expect(reqTaskDetails.request.method).toBe('GET');
    reqTaskDetails.flush(mockTask);
  
    const reqMembers = httpMock.expectOne('http://localhost:8080/api/projects/456/members');
    expect(reqMembers.request.method).toBe('GET');
    reqMembers.flush([]);
  
    expect(component.taskToDelete).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/project', 456]);
  });
  
  it('should handle error when loading task details', () => {
    component.ngOnInit();
    const req = httpMock.expectOne('http://localhost:8080/api/tasks/123');
    req.error(new ErrorEvent('Network error'));

    expect(component.task).toBeUndefined();
    expect(component.errorMessage).toBeNull();
  });

  it('should handle error when saving changes', () => {
    const mockTask = {
      id: 123,
      name: 'Updated Task',
      description: 'Updated Description',
      priority: 'HIGH',
      status: 'DONE',
      endDate: '2023-12-31',
      assignee: { id: 2 },
    };

    component.taskId = 123;
    component.currentUserId = 1;
    component.task = mockTask;

    component.saveChanges();

    const req = httpMock.expectOne('http://localhost:8080/api/tasks/123?userId=1');
    req.error(new ErrorEvent('Network error'));

    expect(component.errorMessage).toBe('Une erreur est survenue lors de la mise à jour de la tâche.');
  });
});