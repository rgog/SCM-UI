import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import {Router} from '@angular/router';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render form with email and password inputs', () => {
    const element = fixture.nativeElement;
    expect(element.querySelector('form')).toBeTruthy();
    expect(element.querySelector('#username')).toBeTruthy();
    expect(element.querySelector('#password')).toBeTruthy();
    expect(element.querySelector('button')).toBeTruthy();
  });

  it('should validate email input as required', () => {
    const email = component.loginForm.controls.email;
    expect(email.valid).toBeFalsy();
    expect(email.errors.required).toBeTruthy();
  });

  it('should validate password input as required', () => {
    const password = component.loginForm.controls.password;
    expect(password.valid).toBeFalsy();
    expect(password.errors.required).toBeTruthy();
  });

  it('should validate email format', () => {
    const email = component.loginForm.controls.email;
    email.setValue('test');
    const errors = email.errors;
    expect(errors.required).toBeFalsy();
    expect(errors.pattern).toBeTruthy();
    expect(email.valid).toBeFalsy();
  });

  it('should validate email format correctly', () => {
    const email = component.loginForm.controls.email;
    email.setValue('test@test.com');
    const errors = email.errors || {};
  
    expect(email.valid).toBeTruthy();
    expect(errors.required).toBeFalsy();
    expect(errors.pattern).toBeFalsy();
  });

  it('should render email validation message when formControl is submitted and invalid', () => {
    const elements: HTMLElement = fixture.nativeElement;
    expect(elements.querySelector('#email-error')).toBeFalsy();
  
    elements.querySelector('button').click();

    // component.onSubmit();
  
    fixture.detectChanges();
    expect(elements.querySelector('#email-error')).toBeTruthy();
    expect(elements.querySelector('#email-error').textContent).toContain(
      'Please enter a valid email.'
    );
  });

});
