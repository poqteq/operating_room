import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
// import { AuthCanActivateGuard } from '@core/services/auth-guard.canactivate';


import { CanActivateGuard } from "@core/services/auth-guard";

const routes: Routes = [
  {
    path: "app",
    loadChildren: "app/modules/main/main.module#MainModule",
    canActivate: [CanActivateGuard],

  
  },

  {
    path: "",
    redirectTo: "/app/dashboard/v1",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
