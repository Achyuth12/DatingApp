import { map } from 'rxjs/operators';
import { Member } from './../_models/member';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members : Member[] = [];

  constructor(private httpClient : HttpClient) { }

  getMembers()
  {
    if(this.members.length > 0)
    {
      return of(this.members);
    }
    return this.httpClient.get<Member[]>(this.baseUrl + "users").pipe(
      map(members =>{
        this.members = members;
        return members;
      })
    )
  }

  getMember(username : string)
  {
    const member = this.members.find(x=> x.userName == username);
    if(member !== undefined)
    {
      return of(member);
    }
    return this.httpClient.get<Member>(this.baseUrl + "users/" + username);
  }

  updateMember(member : Member)
  {
    return this.httpClient.put(this.baseUrl + "users", member).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  
}
