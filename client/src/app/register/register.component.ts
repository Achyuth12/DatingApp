import { AccountServiceService } from './../_Services/account-service.service';
import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//import * as EventEmitter from 'events';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
model : any =  {};
@Output() cancelRegister = new EventEmitter;
  constructor(private accountService : AccountServiceService,private toast : ToastrService) { }

  ngOnInit(): void {
  }
  register() {
    this.accountService.register(this.model).subscribe(
      response =>{
        console.log(response);
        this.cancel();
      }, error => {
        console.log(error);
        this.toast.error(error.error);
      }
    )
  }
  cancel() {
    
    this.cancelRegister.emit(false);
  }



}
