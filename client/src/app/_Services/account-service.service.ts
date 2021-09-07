import { environment } from './../../environments/environment';
import { User } from './../_models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {

baseURL = environment.apiUrl;
private currentUserSource = new ReplaySubject<User>(1);
currentUser$ = this.currentUserSource.asObservable();
  constructor(private httpClient : HttpClient) { }

  login(model : any) {
    return this.httpClient.post(this.baseURL+"account/login",model).pipe(
      map((response : User) => {
        const user = response;
        if(user)
        {
          
          this.setCurrentUser(user);
          
        }
      })
    )
  }

  register(model:any){
    return this.httpClient.post(this.baseURL+"account/register",model).pipe(
      map((response : User) => {
        const user = response;
        if(user)
        {
          this.setCurrentUser(user);
          
        }
      })
    )
  }

  setCurrentUser(user : User){
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  setMainPhoto(photoId : number)
  {
    return this.httpClient.put(this.baseURL + "users/set-main-photo/" + photoId,{});
  }

  deletePhoto(photoId : number)
  {
    return this.httpClient.delete(this.baseURL + "users/delete-photo" + photoId, {});
  }
}
