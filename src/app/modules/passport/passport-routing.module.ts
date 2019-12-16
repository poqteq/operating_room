import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { UserLoginComponent } from "./login/login.component";

import { LayoutPassportComponent } from "../../layout/passport/passport.component";


const routes: Routes = [
  {
    path: "passport",
    component: LayoutPassportComponent,
    children: [
      {
        path: "login",
        component: UserLoginComponent,
        data: { title: "登录", titleI18n: "pro-login" }
        // canActivate: [AuthActivateGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassportRoutingModule {}
