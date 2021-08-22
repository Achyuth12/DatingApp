import { Member } from './../_models/member';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient : HttpClient) { }

  getMembers()
  {
    return this.httpClient.get<Member[]>(this.baseUrl + "users")
  }

  getMember(username : string)
  {
    return this.httpClient.get<Member>(this.baseUrl + "users/" + username);
  }
}
