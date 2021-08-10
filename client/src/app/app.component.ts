import { AccountServiceService } from './_Services/account-service.service';
import { User } from './_models/User';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  users:any
  constructor(private httpClient : HttpClient,private accountService : AccountServiceService) {
  }

  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }
  title = 'The Dating App';
  getUsers() : void {
    this.httpClient.get("https://localhost:5001/api/users").subscribe(response => {this.users = response;},err => {console.log(err);});
  }

  setCurrentUser(){
    const user : User = JSON.parse(localStorage.getItem('user'));
    this.accountService.setCurrentUser(user);
  }
}
