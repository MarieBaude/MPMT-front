import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ProjectDetailComponent } from './project-detail.component';
import { HttpErrorResponse } from '@angular/common/http';

describe('ProjectDetailComponent', () => {
  let component: ProjectDetailComponent;
  let fixture: ComponentFixture<ProjectDetailComponent>;
  let httpMock: HttpTestingController;
  let route: ActivatedRoute;

  beforeEach(async () => {
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
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should load project details on initialization', () => {
    const mockResponse = { id: 1, name: 'Test Project' };

    const req = httpMock.expectOne('http://localhost:8080/api/projects/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(component.data).toEqual(mockResponse);
  });

  it('should log error if loading project details fails', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    const req = httpMock.expectOne('http://localhost:8080/api/projects/1');
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));

    expect(consoleSpy).toHaveBeenCalledWith('Erreur lors de la récupération des données :', expect.any(HttpErrorResponse));
  });

  it('should switch active tab', () => {
    const req = httpMock.expectOne('http://localhost:8080/api/projects/1');

    expect(component.activeTab).toBe('task');

    component.switchTab('member');
    expect(component.activeTab).toBe('member');

    component.switchTab('detail');
    expect(component.activeTab).toBe('detail');
  });
});