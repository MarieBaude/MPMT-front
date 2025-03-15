import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTaskComponent } from '../new-task.component';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

// Simule un utilisateur connecté
class MockAuthService {
  getCurrentUserId() {
    return 123; 
  }
}

// Simule ActivatedRoute
class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: (key: string) => '1' 
    }
  };
}

// Simule HttpClient
class MockHttpClient {
  get(url: string) {
    if (url === 'http://localhost:8080/api/projects/1/members') {
      return of([{ id: 1, name: 'Member 1' }, { id: 2, name: 'Member 2' }]); 
    }
    return throwError(() => new Error('Failed to fetch project members'));
  }

  post(url: string, body: any) {
    if (url === 'http://localhost:8080/api/tasks') {
      return of({ success: true }); 
    }
    return throwError(() => new Error('Failed to create task'));
  }
}

describe('NewTaskComponent Integration Tests', () => {
  let component: NewTaskComponent;
  let fixture: ComponentFixture<NewTaskComponent>;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTaskComponent, FormsModule], 
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: HttpClient, useClass: MockHttpClient },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTaskComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  it('should initialize with projectId and currentUserId', () => {
    expect(component.projectId).toBe(1);
    expect(component.currentUserId).toBe(123);
  });

  it('should fetch project members on initialization', () => {
    const httpGetSpy = jest.spyOn(httpClient, 'get');
    component.ngOnInit();
    expect(httpGetSpy).toHaveBeenCalledWith('http://localhost:8080/api/projects/1/members');
    expect(component.data).toEqual([{ id: 1, name: 'Member 1' }, { id: 2, name: 'Member 2' }]);
  });

  it('should call http.post with the correct URL and data when creating a new task', () => {
    const httpPostSpy = jest.spyOn(httpClient, 'post');
    component.task = {
      name: 'Test Task',
      description: 'Test Description',
      priority: 'High',
      status: 'Todo',
      endDate: '2023-12-31',
      assigneeId: 2
    };
    component.newTask();

    expect(httpPostSpy).toHaveBeenCalledWith(
      'http://localhost:8080/api/tasks',
      {
        name: 'Test Task',
        description: 'Test Description',
        priority: 'High',
        status: 'Todo',
        endDate: '2023-12-31',
        projectId: 1,
        assigneeId: 2,
        createdById: 123
      }
    );
  });

});