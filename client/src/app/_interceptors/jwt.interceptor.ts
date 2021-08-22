import { User } from './../_models/User';
import { AccountServiceService } from './../_Services/account-service.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService : AccountServiceService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser : User;
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      currentUser = user;
      console.log(user);
    });
    if(currentUser)
    {
      request = request.clone({
        setHeaders : {
          Authorization : 'Bearer ' + currentUser.token
        }
      })
    }
    return next.handle(request);
  }
}
