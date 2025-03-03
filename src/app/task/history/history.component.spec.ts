import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoryComponent } from './history.component';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { LOCALE_ID } from '@angular/core';
import '@angular/common/locales/global/fr';

class MockAuthService {
  isLoggedIn$ = of(true); 
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

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HistoryComponent, 
        HttpClientTestingModule,
        DatePipe,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: Router, useClass: MockRouter },
        { provide: LOCALE_ID, useValue: 'fr' }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
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

  it('should initialize historyId and redirect if user is not logged in', () => {
    (authService as any).isLoggedIn$ = of(false);

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const reqs = httpMock.match(`http://localhost:8080/api/histories/task/${component.historyId}`);
    reqs.forEach(req => req.flush([])); 

    expect(component.historyId).toBe(123); 
    expect(router.navigate).toHaveBeenCalledWith(['/error']);
  });

  it('should load history details', () => {
    const mockHistory = [
      {
        changedField: 'status',
        oldValue: 'TODO',
        newValue: 'IN_PROGRESS',
        updatedAt: '2023-10-01T12:00:00Z',
        username: 'user1',
      },
      {
        changedField: 'assignee',
        oldAssigneeUsername: 'user1',
        newAssigneeUsername: 'user2',
        updatedAt: '2023-10-02T12:00:00Z',
        username: 'user2',
      },
    ];

    component.loadHistoryDetails();

    const reqs = httpMock.match(`http://localhost:8080/api/histories/task/${component.historyId}`);
    reqs.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush(mockHistory); 
    });

    expect(component.history).toEqual(mockHistory);
  });

  it('should display history details in the template', () => {
    const mockHistory = [
      {
        changedField: 'status',
        oldValue: 'TODO',
        newValue: 'IN_PROGRESS',
        updatedAt: '2023-10-01T12:00:00Z',
        username: 'user1',
      },
      {
        changedField: 'assignee',
        oldAssigneeUsername: 'user1',
        newAssigneeUsername: 'user2',
        updatedAt: '2023-10-02T12:00:00Z',
        username: 'user2',
      },
    ];


    const reqs = httpMock.match(`http://localhost:8080/api/histories/task/${component.historyId}`);
    reqs.forEach(req => req.flush(mockHistory)); 

    component.history = mockHistory;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Nom du champ : status');
    expect(compiled.textContent).toContain('Ancienne valeur : TODO');
    expect(compiled.textContent).toContain('Nouvelle valeur : IN_PROGRESS');
    expect(compiled.textContent).toContain('Date : 1 octobre 2023');
    expect(compiled.textContent).toContain('Modifié par : user1');

    expect(compiled.textContent).toContain('Nom du champ : assignee');
    expect(compiled.textContent).toContain('Ancienne valeur : user1');
    expect(compiled.textContent).toContain('Nouvelle valeur : user2');
    expect(compiled.textContent).toContain('Date : 2 octobre 2023');
    expect(compiled.textContent).toContain('Modifié par : user2');
  });
});