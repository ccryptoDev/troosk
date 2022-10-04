import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from './_service/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  installersidebar = false;
  borrowerSidebar = false;
  adminsidebar = false;
  sidenavtoggled: any = false;
  menusBar = false;
  isUserlogin = false;
  UDInfo: any = {};
  constructor(
    private router: Router,
    route: ActivatedRoute,
    private service: HttpService
  ) {}
  ngOnInit() {
    let firstName = sessionStorage.getItem('UD_firstName');
    let lastName = sessionStorage.getItem('UD_lastName');
    let email = sessionStorage.getItem('UD_email');
    if (email) {
      this.UDInfo.firstName = firstName;
      this.UDInfo.lastName = lastName;
      this.UDInfo.email = email;
      this.isUserlogin = true;
      //console.log("yes", this.UDInfo)
    }
  }
  changeOfRoutes() {
    let routePaths = this.router.url.split('/');
    let router = routePaths[1],
      menusNotShowPath = false;
    if (router == 'admin' || router == 'borrower') {
      let ro = routePaths[2].split('?')[0];
      if (
        ro == 'login' ||
        ro == 'verify' ||
        ro == 'forgot-password' ||
        ro == 'passwordReset' ||
        ro == 'plaid' ||
        ro == 'twoFactorAuth'
      ) {
        router = ro;
        menusNotShowPath = true;
      }
    }
    switch (router) {
      case 'installer':
        this.installersidebar = true;
        break;
      case 'borrower':
        this.borrowerSidebar = true;
        break;
      case 'admin':
        this.adminsidebar = true;
        break;
      default:
        this.installersidebar = false;
        this.borrowerSidebar = false;
        this.adminsidebar = false;
        break;
    }
    if (router != 'admin' && !menusNotShowPath) {
      this.menusBar = true;
      if (router == 'borrower') {
        //call get user details
      }
    } else {
      this.menusBar = false;
    }
  }

  logout() {
    this.service.logout();
  }
}
