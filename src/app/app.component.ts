import { Component, HostBinding, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { filter } from "rxjs/operators";
import { TitleService } from "fui-theme";
import { NzModalService } from "ng-zorro-antd";

@Component({
  selector: "app-root",
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private modalSrv: NzModalService,
    private titleSrv: TitleService
  ) {}
  ngOnInit() {
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => {
        this.titleSrv.setTitle();
        this.modalSrv.closeAll();
      });
  }
}
