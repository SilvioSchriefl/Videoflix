import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  authenticated: boolean = false;

  constructor(
    private router: Router,
  ) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authenticated) {
      return true;
    } else {
      this.router.navigateByUrl('log_in');
      return false;
    }
  }
}
