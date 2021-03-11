import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  email: string = '';
  password: string = '';
  verifySent = false;
  verificationCode: string = '';
  username: string = '';

  constructor(
    private us: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  sendVerificationEmail() {
    this.us
      .sendVerification(this.email)
      .then(() => {
        this.verifySent = true;
      })
      .catch((e) => {
        if (e.error.Detail.includes("already exists")) {
          this.verifySent = true;
          return
        }
        this.toastr.error(e.error.Detail);
      });
  }

  verify() {
    this.us
      .verify(this.email, this.username, this.password, this.verificationCode)
      .then(() => {
        document.location.href = '/';
      })
      .catch((e) => {
        this.toastr.error(e.error.Detail);
      });
  }
}
