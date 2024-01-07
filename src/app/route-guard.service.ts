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


  /**
   * Checks if the user can activate the given route.
   *
   * @param {ActivatedRouteSnapshot} next - The next route that will be activated.
   * @param {RouterStateSnapshot} state - The router state snapshot.
   * @return {boolean} Returns true if the user is authenticated and can activate the route, false otherwise.
   */
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
