import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AllProjectComponent } from './all-project.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AllProjectComponent', () => {
  let component: AllProjectComponent;
  let fixture: ComponentFixture<AllProjectComponent>;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  let router: Router;

  beforeEach(async () => {
    // Mock du AuthService
    authServiceMock = {
      isLoggedIn$: of(true), // Simule un utilisateur connecté
    };

    await TestBed.configureTestingModule({
      imports: [
        AllProjectComponent, 
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AllProjectComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP en attente
  });

  it('should create', () => {
    fixture.detectChanges(); 
    const req = httpMock.expectOne('http://localhost:8080/api/projects');
    req.flush([]); 
    expect(component).toBeTruthy();
  });

  it('should redirect to error page if user is not logged in', () => {
    authServiceMock.isLoggedIn$ = of(false);
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8080/api/projects');
    req.flush([]); 

    expect(navigateSpy).toHaveBeenCalledWith(['/error']);
  });

  it('should load projects successfully', () => {
    const mockProjects = [
      { id: 1, name: 'Project 1', username: 'user1' }, 
      { id: 2, name: 'Project 2', username: 'user2' },
    ];

    fixture.detectChanges(); 

    const req = httpMock.expectOne('http://localhost:8080/api/projects');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);

    expect(component.projects).toEqual(mockProjects);
  });

  it('should handle error when loading projects', () => {
    fixture.detectChanges(); 

    const req = httpMock.expectOne('http://localhost:8080/api/projects');
    req.error(new ErrorEvent('Network error')); 

    expect(component.projects).toEqual([]); 
  });

  it('should initialize menuItems correctly', () => {
    fixture.detectChanges(); 
    const req = httpMock.expectOne('http://localhost:8080/api/projects');
    req.flush([]); 

    expect(component.menuItems).toEqual(['Nom', 'Créer par', 'Action']);
  });

  it('should display projects in the template', () => {
    const mockProjects = [
      {
        id: 1,
        name: 'Project 1',
        createdBy: { username: 'user1' },
      },
      {
        id: 2,
        name: 'Project 2',
        createdBy: { username: 'user2' }, 
      },
    ];
  
    fixture.detectChanges(); 
  
    const req = httpMock.expectOne('http://localhost:8080/api/projects');
    req.flush(mockProjects); 
  
    fixture.detectChanges(); 
  
    const projectRows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(projectRows.length).toBe(2); 
  
    const firstRow = projectRows[0];
    const secondRow = projectRows[1];
  
    expect(firstRow.textContent).toContain('Project 1');
    expect(firstRow.textContent).toContain('user1'); 
  
    expect(secondRow.textContent).toContain('Project 2'); 
    expect(secondRow.textContent).toContain('user2'); 
  });
});