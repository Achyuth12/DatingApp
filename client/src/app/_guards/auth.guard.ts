import { map } from 'rxjs/operators';
import { AccountServiceService } from './../_Services/account-service.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService : AccountServiceService, private toast : ToastrService)
  {

  }
  canActivate() : Observable<boolean>
  {
    return this.accountService.currentUser$.pipe(
      map(user => {
        if(user) return true;
        this.toast.error("You Shall Not Pass");
      })
    )
  }
  
 
}
