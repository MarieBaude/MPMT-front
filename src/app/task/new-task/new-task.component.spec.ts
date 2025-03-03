import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { NewTaskComponent } from './new-task.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

class MockAuthService {
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

describe('NewTaskComponent', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewTaskComponent,
        HttpClientTestingModule,
        FormsModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should initialize projectId and currentUserId', () => {
    const req = httpMock.expectOne(`http://localhost:8080/api/projects/${component.projectId}/members`);
    req.flush([]);

    expect(component.projectId).toBe(123);
    expect(component.currentUserId).toBe(1);
  });

  it('should load project members', () => {
    const mockMembers = [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];

    const req = httpMock.expectOne(`http://localhost:8080/api/projects/${component.projectId}/members`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMembers);

    expect(component.data).toEqual(mockMembers);
  });

  it('should open and close the modal', () => {
    const req = httpMock.expectOne(`http://localhost:8080/api/projects/${component.projectId}/members`);
    req.flush([]);

    component.openModal();
    const modalElement = document.getElementById('crud-modal');
    expect(modalElement?.classList.contains('hidden')).toBe(false);

    component.closeModal();
    expect(modalElement?.classList.contains('hidden')).toBe(true);
  });

  it('should create a new task', () => {
    const membersReq = httpMock.expectOne(`http://localhost:8080/api/projects/${component.projectId}/members`);
    membersReq.flush([]);

    const mockTask = {
      name: 'Task 1',
      description: 'Description',
      priority: 'HIGH',
      status: 'TODO',
      endDate: '2023-12-31',
      assigneeId: 1,
    };

    component.task = mockTask;
    component.newTask();

    const taskReq = httpMock.expectOne(`http://localhost:8080/api/tasks`);
    expect(taskReq.request.method).toBe('POST');
    expect(taskReq.request.body).toEqual({
      ...mockTask,
      projectId: component.projectId,
      createdById: component.currentUserId,
    });
    taskReq.flush({});

    expect(component.errorMessage).toBeNull();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should handle error when creating a new task', () => {
    const membersReq = httpMock.expectOne(`http://localhost:8080/api/projects/${component.projectId}/members`);
    membersReq.flush([]);
  
    const mockTask = {
      name: 'Task 1',
      description: 'Description',
      priority: 'HIGH',
      status: 'TODO',
      endDate: '2023-12-31',
      assigneeId: 1,
    };
  
    component.task = mockTask;
    component.newTask();
  
    const taskReq = httpMock.expectOne(`http://localhost:8080/api/tasks`);
    taskReq.flush({ error: 'Erreur' }, { status: 400, statusText: 'Bad Request' });
  
    expect(component.errorMessage).toEqual({ error: 'Erreur' });
  });
});
