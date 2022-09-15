import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, Observable } from "rxjs";
import { IdentityService } from "./identity.service";
import { Utils } from "./utils";

@Injectable()
export class AuthApproveGuard implements CanActivate {
  constructor(private identityService: IdentityService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.identityService.getUserIdentity().pipe(map(userIdentity => {
      return Utils.isUserCanApprove(userIdentity);
    }));
  }
}
