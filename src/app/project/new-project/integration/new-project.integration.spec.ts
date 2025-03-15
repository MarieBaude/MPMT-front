import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewProjectComponent } from '../new-project.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

// Simule un utilisateur connecté
class MockAuthService {
  isLoggedIn$ = of(true); 
  getCurrentUserId() {
    return 123; 
  }
}

class MockRouter {
  navigate(path: string[]) {
    console.log('Navigated to:', path);
  }
}

class MockHttpClient {
  post(url: string, body: any) {
    if (url === 'http://localhost:8080/api/projects/create') {
      return of({ success: true }); 
    }
    return throwError(() => new Error('Failed to create project'));
  }
}

describe('NewProjectComponent Integration Tests', () => {
    let component: NewProjectComponent;
    let fixture: ComponentFixture<NewProjectComponent>;
    let authService: AuthService;
    let router: Router;
    let httpClient: HttpClient;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [NewProjectComponent, FormsModule], 
        providers: [
          { provide: AuthService, useClass: MockAuthService },
          { provide: Router, useClass: MockRouter },
          { provide: HttpClient, useClass: MockHttpClient },
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(NewProjectComponent);
      component = fixture.componentInstance;
      authService = TestBed.inject(AuthService);
      router = TestBed.inject(Router);
      httpClient = TestBed.inject(HttpClient);
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should call http.post with the correct URL and data', () => {
      const httpPostSpy = jest.spyOn(httpClient, 'post');
      component.project = { name: 'Test Project', description: 'Test Description' };
      component.createProject(); 
  
      expect(httpPostSpy).toHaveBeenCalledWith(
        'http://localhost:8080/api/projects/create',
        { name: 'Test Project', description: 'Test Description', createdById: 123 }
      );
    });
  
    it('should navigate to /project on successful project creation', () => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.createProject(); 
      expect(navigateSpy).toHaveBeenCalledWith(['/project']);
    });
  });