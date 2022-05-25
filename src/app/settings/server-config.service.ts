
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// export keyword is same as public keyword in C# and Java. If export keyword is used, the class
// can used in other files.

@Injectable()
export class ServerConfigService {
  public router: Router;
  public base_url ;
  public navigate_url;
  constructor(router: Router) {
    this.router = router;

  }

  openUrl(): string {

    const currentUrl = window.location.href;
    if (currentUrl.includes('localhost')) {
      this.navigate_url = '';
    } else if (currentUrl.includes('alpha')) {
      this.navigate_url = 'kd-ptl-webapp-alpha/';
    } else if (currentUrl.includes('beta')) {
      this.navigate_url = 'kd-ptl-webapp-beta/';

    } else if (currentUrl.includes('prod')) {
      this.navigate_url = 'kd-ptl-webapp-prod/';
    }

    return this.navigate_url;


  }


  getBaseUrl(): string {

    const currentUrl = window.location.href;

    if (currentUrl.includes('localhost')) {
      this.base_url = 'https://ptl-api-dev.flexli.in/flexlione-webapi-alpha/api/v1';
    } else if (currentUrl.includes('beta')) {
      this.base_url = 'https://ptl-api-dev.flexli.in/flexlione-webapi-beta/api/v1';
    } else if (currentUrl.includes('alpha')) {
      this.base_url = 'https://ptl-api-dev.flexli.in/flexlione-webapi-alpha/api/v1';
    }
    return this.base_url;

  }
}




