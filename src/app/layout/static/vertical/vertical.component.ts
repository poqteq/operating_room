import { Component, AfterViewInit, TemplateRef, Input } from "@angular/core";
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError
} from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";
import { SettingsService, MenuService, ScrollService } from "fui-theme";

import { Menu } from "fui-theme";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "layout-static-vertical",
  templateUrl: "./vertical.component.html",
  styleUrls: ["./vertical.component.less"]
})
export class VerticalComponent implements AfterViewInit {
  @Input()
  menus: Menu[] = [];
  isFetching = false;
  @Input()
  right = false;
  searchToggleStatus: boolean;
  constructor(
    router: Router,
    scroll: ScrollService,
    private _message: NzMessageService
  ) {
    // scroll to top in change page
    router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError) {
        this.isFetching = false;
        _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      setTimeout(() => {
       
        this.isFetching = false;
      }, 100);
    });
  }
  ngAfterViewInit() {
    if (document.querySelector(".preloader")) {
      document.querySelector(".preloader").className = "preloader-hidden";
    }
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }
}
