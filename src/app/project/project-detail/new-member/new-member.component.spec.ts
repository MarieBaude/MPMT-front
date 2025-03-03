import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { NewMemberComponent } from './new-member.component';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

class MockAuthService {
  getCurrentUserId = jest.fn().mockReturnValue(1); // Simule un utilisateur connecté
}

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: jest.fn().mockReturnValue('123'), // Simule un paramètre d'URL 'id'
    },
  };
}

describe('NewMemberComponent', () => {
  let component: NewMemberComponent;
  let fixture: ComponentFixture<NewMemberComponent>;
  let httpMock: HttpTestingController;
  let authService: AuthService;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewMemberComponent, // Importe le composant autonome
        HttpClientTestingModule,
        FormsModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewMemberComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
    activatedRoute = TestBed.inject(ActivatedRoute);

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: {
        reload: jest.fn(), // Mock de la fonction reload
      },
      writable: true,
    });

    // Ajoute la modal au DOM
    const modalElement = document.createElement('div');
    modalElement.id = 'crud-modal';
    modalElement.classList.add('hidden'); // La modal est initialement cachée
    document.body.appendChild(modalElement);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'il n'y a pas de requêtes HTTP en attente

    // Nettoie la modal du DOM après chaque test
    const modalElement = document.getElementById('crud-modal');
    if (modalElement && modalElement.parentNode) {
      modalElement.parentNode.removeChild(modalElement);
    }
  });

  it('should initialize projectId and currentUserId on init', () => {
    expect(component.projectId).toBe(123); // Vérifie que projectId est correct
    expect(component.currentUserId).toBe(1); // Vérifie que currentUserId est correct
    expect(authService.getCurrentUserId).toHaveBeenCalled();
    expect(activatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
  });

  it('should send a POST request to invite a new member', () => {
    component.member.email = 'test@example.com';
    component.member.role = 'MEMBER';

    component.newMember();

    // Intercepte la requête HTTP
    const req = httpMock.expectOne(
      `http://localhost:8080/api/projects/${component.projectId}/invite?currentUserId=${component.currentUserId}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      role: 'MEMBER',
    });

    // Simule une réponse réussie
    req.flush({ success: true });

    // Vérifie que la modal est fermée
    const modalElement = document.getElementById('crud-modal');
    expect(modalElement?.classList.contains('hidden')).toBe(true);

    // Vérifie que window.location.reload a été appelé
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should open the modal', () => {
    // Ouvre la modal
    component.openModal();

    // Vérifie que la modal est ouverte
    const modalElement = document.getElementById('crud-modal');
    expect(modalElement?.classList.contains('hidden')).toBe(false);
  });

  it('should close the modal', () => {
    // Ouvre la modal
    component.openModal();

    // Ferme la modal
    component.closeModal();

    // Vérifie que la modal est fermée
    const modalElement = document.getElementById('crud-modal');
    expect(modalElement?.classList.contains('hidden')).toBe(true);
  });
});