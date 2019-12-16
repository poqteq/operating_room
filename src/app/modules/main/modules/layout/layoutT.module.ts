import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LayoutRoutingModule } from "./layout-routing.module";
import { SharedModule } from "@shared/shared.module";
import { LayoutModule } from "../../../../layout/layout.module";

import { Lay1Component } from "./static/lay1/lay1.component";

import { Content1Component } from "./static/content1/content1.component";



@NgModule({
  imports: [SharedModule, LayoutModule, CommonModule, LayoutRoutingModule],
  declarations: [
    Lay1Component,


    Content1Component,

  ]
})
export class LayoutTModule {}
