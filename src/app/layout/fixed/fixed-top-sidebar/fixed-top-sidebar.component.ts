import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  HostBinding
} from "@angular/core";
import { SettingsService, ScrollService } from "fui-theme";
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError
} from "@angular/router";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "layout-fixed-top-sidebar",
  templateUrl: "./fixed-top-sidebar.component.html",
  styleUrls: ["./fixed-top-sidebar.component.less"]
})
export class FixedTopSidebarComponent implements OnInit {
  isFetching = false;

  @HostBinding("class.aside-collapsed")
  get isCollapsed() {
    return this.settings.layout.collapsed;
  }

  constructor(
    private router: Router,
    scroll: ScrollService,
    public settings: SettingsService,
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
        // scroll.scrollToTop();
        this.isFetching = false;
      }, 100);
    });
  }
  ngOnInit() {}
}
