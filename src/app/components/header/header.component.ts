/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RCSA22C00000008 awarded by the United
 * States Department of Homeland Security for Cybersecurity and Infrastructure Security Agency.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/Auth/auth-service.service';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
/** Header component */
@Component({
  selector: 'nvip-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  faSignOut = faSignOut;
  constructor(private authService: AuthService, private router: Router) {}

  /** ensure user is logged in before accessing a certain page */
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  /** show first name of user credentials on header */
  getFirstName(): string | undefined {
    return this.authService.get()?.firstName;
  }

  /** log out user triggered by log out button icon on far right */
  logOut() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  /** navigate to a certain page */
  goTo(link: any) {
    if (this.isLoggedIn()) {
      this.router.navigate(link);
    } else 
      this.router.navigate(['login'])
  }
}
