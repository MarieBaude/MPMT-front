import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ProjectComponent } from './project.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;
  let authServiceMock: any;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    authServiceMock = {
      isLoggedIn$: of(true),
      getCurrentUserId: jest.fn().mockReturnValue(1),
      getCurrentUser: jest.fn().mockReturnValue('john_doe')
    };

    await TestBed.configureTestingModule({
      imports: [
        ProjectComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should redirect to error page if user is not logged in', () => {
    authServiceMock.isLoggedIn$ = of(false);
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/error']);
  });

  it('should load projects and assign roles correctly', () => {
    const mockProjects = [
      {
        id: 1,
        name: 'Project 1',
        createdById: 1,
        projectRoles: [{ username: 'john_doe', role: 'Admin' }]
      },
      {
        id: 2,
        name: 'Project 2',
        createdById: 2,
        projectRoles: [{ username: 'john_doe', role: 'Member' }]
      }
    ];

    const req = httpMock.expectOne('http://localhost:8080/api/projects/user/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);

    expect(component.createdProjects.length).toBe(1);
    expect(component.otherProjects.length).toBe(1);
    expect(component.rolesForCreatedProjects['Project 1']).toBe('Admin');
    expect(component.rolesForOtherProjects['Project 2']).toBe('Member');
  });

  it('should handle HTTP error when loading projects', () => {
    const req = httpMock.expectOne('http://localhost:8080/api/projects/user/1');
    req.error(new ErrorEvent('Network error'));

    expect(component.createdProjects.length).toBe(0);
    expect(component.otherProjects.length).toBe(0);
  });

  it('should set currentUsername to empty string when getCurrentUser returns null', () => {
    authServiceMock.getCurrentUser.mockReturnValue(null);
    component.loadProjects();

    expect(component.currentUsername).toBe('');
    expect(authServiceMock.getCurrentUser).toHaveBeenCalled();
  });
});
