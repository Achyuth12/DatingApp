import { MemberService } from './../../_Services/member.service';
import { Photo } from './../../_models/Photo';
import { AccountServiceService } from './../../_Services/account-service.service';
import { environment } from './../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader, FileDropDirective } from 'ng2-file-upload';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/User';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member : Member;
  uploader : FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrl;
  user : User;
  constructor(private accountService : AccountServiceService, private memberService : MemberService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.intializeUploader();
  }

  fileOverBase(e:any) {
    this.hasBaseDropzoneOver = e;
  }

  intializeUploader() {
    this.uploader = new FileUploader(
      {
        url:this.baseUrl + 'users/add-photo',
        authToken : 'Bearer ' + this.user.token,
        isHTML5 : true,
        allowedFileType : ['image'],
        removeAfterUpload : true,
        autoUpload : false,
        maxFileSize : 10*1024*1024
      }
    );
    this.uploader.onAfterAddingFile = (file) =>{
      file.withCredentials = false;
    }
    this.uploader.onSuccessItem = (item,response,status,headers) => {
      if(response)
      {
        const photo = JSON.parse(response);
        this.member.photos.push(photo);
      }
    }
  }

  setMainPhoto(photo : Photo)
  {
    this.accountService.setMainPhoto(photo.id).subscribe(() =>{
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(x => {
        if(x.isMain) x.isMain =false;
        if(x.id == photo.id) x.isMain = true;
      })
    });

  }

  deleteMainPhoto(photoId:number)
  {
    this.accountService.deletePhoto(photoId).subscribe(() =>{
      this.member.photos.filter(x=> x.id != photoId);
    })
  }

}
