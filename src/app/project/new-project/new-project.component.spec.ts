import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewProjectComponent } from './new-project.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('NewProjectComponent', () => {
  let component: NewProjectComponent;
  let fixture: ComponentFixture<NewProjectComponent>;
  let authServiceMock: any;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    authServiceMock = {
      isLoggedIn$: of(true),
      getCurrentUserId: jest.fn().mockReturnValue(1)
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NewProjectComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewProjectComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should call createProject and navigate to /project on success', () => {
    const mockResponse = { success: true };
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.project = { name: 'Test Project', description: 'Test Description' };
    component.createProject();

    const req = httpMock.expectOne('http://localhost:8080/api/projects/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Test Project',
      createdById: 1,
      description: 'Test Description'
    });
    req.flush(mockResponse);
    expect(navigateSpy).toHaveBeenCalledWith(['/project']);

    const consoleSpy = jest.spyOn(console, 'error');
    expect(consoleSpy).not.toHaveBeenCalled();
  });

});
