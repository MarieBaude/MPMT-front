import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { fakeAsync, tick } from '@angular/core/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  const httpClientMock = { post: jest.fn() };
  const routerMock = { navigate: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should initialize activeTab to "login"', () => {
    expect(component.activeTab).toBe('login');
  });

  it('should switch activeTab to "register" when switchTab is called with "register"', () => {
    component.switchTab('register');
    expect(component.activeTab).toBe('register');
  });
  
  it('should switch activeTab to "login" when switchTab is called with "login"', () => {
    component.switchTab('login');
    expect(component.activeTab).toBe('login');
  });

  it('should save user correctly when saveUser is called', () => {
    const mockResponse = { success: true };
    httpClientMock.post.mockReturnValue(of(mockResponse));
  
    component.saveUser();
  
    expect(httpClientMock.post).toHaveBeenCalledWith("http://localhost:8080/api/users", expect.any(Object));
  });
  
  it('should send the correct user data in saveUser request', () => {
    const userData = {
      username: 'testUser',
      password: 'password123',
      email: 'test@example.com'
    };
    component.user = userData;

    jest.spyOn(httpClientMock, 'post').mockReturnValue(of({ success: true }));
    component.saveUser();
    expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:8080/api/users', userData);
  });

  it('should send the correct login data in login request', () => {
    const loginData = {
      email: 'lala',
      password: 'azerty'
    };
    component.log = loginData;

    jest.spyOn(httpClientMock, 'post').mockReturnValue(of({ success: true }));
    component.login();
    expect(httpClientMock.post).toHaveBeenCalledWith('http://localhost:8080/api/login', loginData);
  });

  it('should navigate to home page after successful login', () => {
    const loginData = { email: 'lala', password: 'azerty' };
    component.log = loginData;

    jest.spyOn(httpClientMock, 'post').mockReturnValue(of({ success: true }));

    component.login();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/project']);
  });

});
