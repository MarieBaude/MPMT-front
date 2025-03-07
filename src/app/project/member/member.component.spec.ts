import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { MemberComponent } from './member.component';
import { AuthService } from '../../services/auth.service';

describe('MemberComponent', () => {
  let component: MemberComponent;
  let fixture: ComponentFixture<MemberComponent>;
  let httpMock: HttpTestingController;
  let authServiceMock: any;
  let route: ActivatedRoute;

  beforeEach(async () => {
    authServiceMock = {
      getCurrentUserId: jest.fn().mockReturnValue(1) 
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn().mockReturnValue('1')
              }
            }
          }
        },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MemberComponent);
    component = fixture.componentInstance;

    component.projectData = {
      projectRoles: [
        { user: { id: 1 }, role: 'Admin' },
        { user: { id: 2 }, role: 'Member' }
      ]
    };

    httpMock = TestBed.inject(HttpTestingController); 
    route = TestBed.inject(ActivatedRoute); 
    fixture.detectChanges(); 
  });

   it('should call changeRole and handle success response', () => {
     Object.defineProperty(window, 'location', {
       value: { reload: jest.fn() },
       writable: true
     });

     component.changeRole(0); 

     const req = httpMock.expectOne(`http://localhost:8080/api/projects/1/change-role?currentUserId=1`);
     expect(req.request.method).toBe('PATCH');
     expect(req.request.body).toEqual({
       userId: 1, 
       role: 'Admin' 
     });

     req.flush({ success: true });

     expect(window.location.reload).toHaveBeenCalled();
   });

});