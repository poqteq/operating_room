import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutFullScreenComponent } from "../../../../layout/fullscreen/fullscreen.component";

import { Lay1Component } from "./static/lay1/lay1.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutFullScreenComponent,
    children: [
      { path: "static", redirectTo: "static/lay1", pathMatch: "full" },
      { path: "static/lay1", component: Lay1Component },

      { path: "fixed", redirectTo: "fixed/sidebar", pathMatch: "full" },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
