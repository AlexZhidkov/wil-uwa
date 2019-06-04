import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title: string;
  homeUrl: string;
  login: boolean;
  photoURL: string;

  constructor(public authService: AuthService,
              private router: Router) {
    this.title = environment.title;
    this.homeUrl = environment.homeUrl;
    this.authService.initialDetails.subscribe(obj => {
      this.login = obj.isLogin;
      this.photoURL = obj.photoURL;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  logout() {
    this.authService.logout();
  }
}
