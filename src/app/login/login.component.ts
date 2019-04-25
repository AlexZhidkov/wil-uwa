import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  faculties: string[];
  faculty: string;
  isStudent: boolean;

  constructor(public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.isStudent = localStorage.getItem('userPrimaryRole') === 'student';
    this.faculties = [
      'Business, Operations/Consulting',
      'Marketing',
      'Accounting',
      'Human Resources'
    ];
  }

  loginFacebook() {
    this.authService.loginWithFacebook()
      .then(() => this.redirectAfterLogin());
  }

  loginGoogle() {
    this.authService.loginWithGoogle()
      .then(() => this.redirectAfterLogin());
  }

  redirectAfterLogin() {
    const userPrimaryRole = localStorage.getItem('userPrimaryRole');
    const redirectAfterLoginPath = userPrimaryRole ? userPrimaryRole : '/';
    this.router.navigate([redirectAfterLoginPath]);
  }
}
