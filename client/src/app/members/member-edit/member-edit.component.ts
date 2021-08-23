import { ToastrService } from 'ngx-toastr';
import { AccountServiceService } from './../../_Services/account-service.service';
import { MemberService } from './../../_Services/member.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/User';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm : NgForm;
  user : User;
  member : Member;
  @HostListener('window:beforeunload',['$event']) unloadNotification($event:any)
  {
    if(this.editForm.dirty)
    {
      $event.returnValue = true;
    }
  }
  constructor(private memberService : MemberService, private accountService : AccountServiceService, private toastrService : ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      console.log(user);
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember()
  {
    //let userName :string = this.user.username;
    this.memberService.getMember(this.user.userName).subscribe(member => {
      this.member = member;
      console.log(member);
    })
    
  }

  updateMember()
  {
    this.memberService.updateMember(this.member).subscribe(() => {
      console.log(this.member);
    this.toastrService.success("Profile Updated Successfully");
    this.editForm.resetForm(this.member);
    })
    
  }

}
