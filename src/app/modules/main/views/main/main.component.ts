import {
  Component,
  HostBinding,
  OnInit,
  AfterViewInit,
  TemplateRef
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { filter } from "rxjs/operators";
import { SettingsService, TitleService, MenuService } from "fui-theme";
import { SidebarNavComponent } from "fui-abc";


import { Menu } from "fui-theme";
import * as extend from "extend";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html"
})
export class MainComponent implements OnInit, AfterViewInit {
  // sidebar: TemplateRef<SidebarNavComponent>;
  ngAfterViewInit() {}

  @HostBinding("class.layout-fixed")
  get isFixed() {
    return this.settings.layout.fixed;
  }
  @HostBinding("class.layout-boxed")
  get isBoxed() {
    return this.settings.layout.boxed;
  }
  @HostBinding("class.aside-collapsed")
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  constructor(
    private settings: SettingsService,
    private router: Router,
  

    private http: HttpClient,
    private titleSrv: TitleService
  ) {
    // this.auth.menus.subscribe((menus: Menu[]) => {
       
    //   //this.menuS.add(extend(true, [], menus));
    // });
   
   
  }

  ngOnInit() {}
}
