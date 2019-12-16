import { Component, OnDestroy, Inject, Optional } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { environment } from "@env/environment";


import { Subscription } from "rxjs";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "passport-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.less"]
})
export class UserLoginComponent implements OnDestroy {
  form: FormGroup;
  error = "";
  type = 0;
  loading = false;
  count = 0;
  interval$: any;
  loginS$: Subscription;
  constructor(
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
  
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true]
    });
    modalSrv.closeAll();
    // this.loginS$ = this.authInfoService.loginstatus.subscribe(
    //     (params: any) => {
    //         const status = params || {};
    //         if (status.status === "success") {
    //             this.router.navigateByUrl("/app");
    //         } else if (status.status === "fail") {
    //             this.msg.error("登录失败");
    //             this.loading = false;
    //         }
    //     }
    // );
  }

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get remember() {
    return this.form.controls.remember;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  switch(ret: any) {
    this.type = ret.index;
  }
  getCaptcha() {
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }
  submit() {
    this.error = "";
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    }
    this.loading = true;

    // this.authActionService.loginAction({
    //     username: this.userName.value || "",
    //     password: this.password.value || "",
    //     remember: this.remember.value || ""
    // });
    this.router.navigateByUrl("/app");
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
    if (this.loginS$) {
      this.loginS$.unsubscribe();
    }
  }
}
