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
  userPrimaryRole: string;
  showUserPrimaryRoleSelector: boolean;

  constructor(public authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.userPrimaryRole = localStorage.getItem('userPrimaryRole');
    this.showUserPrimaryRoleSelector = !Boolean(this.userPrimaryRole);

    this.faculties = [
      'Business, Operations/Consulting',
      'Marketing',
      'Accounting',
      'Human Resources'
    ];
  }

  updateUserPrimaryRole(role: string) {
    localStorage.setItem('userPrimaryRole', role);
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
