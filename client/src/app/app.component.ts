import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  users:any
  constructor(private httpClient : HttpClient) {
  }

  ngOnInit(): void {
    this.getUsers();
  }
  title = 'The Dating App';
  getUsers() : void {
    this.httpClient.get("https://localhost:5001/api/users").subscribe(response => {this.users = response;},err => {console.log(err);});
  }
}
