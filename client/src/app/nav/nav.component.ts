import { AccountServiceService } from './../_Services/account-service.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loggedIn : boolean
  model:any = {}
  constructor(public accountService:AccountServiceService, private route : Router, private toast : ToastrService) { }

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe(response => {
      this.route.navigateByUrl('/members');
    },err => {console.log(err);
    this.toast.error(err.error)
    });
  }

  

  logout() {
    this.accountService.logout();
    this.route.navigateByUrl('/');
  }

}
