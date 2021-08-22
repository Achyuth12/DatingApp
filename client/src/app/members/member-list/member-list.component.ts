import { MemberService } from './../../_Services/member.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/Member';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members : Member[];

  constructor(private memberService : MemberService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers()
  {
    this.memberService.getMembers().subscribe(members => {
      this.members = members;
    })
  }

}
