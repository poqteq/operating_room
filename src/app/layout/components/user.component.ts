import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { SettingsService } from "fui-theme";


@Component({
  // tslint:disable-next-line:component-selector
  selector: "header-user",
  template: `
    <nz-dropdown nzPlacement="bottomRight">
      <div class="item d-flex align-items-center px-sm" nz-dropdown title>
        <nz-avatar
          [nzSrc]="'./assets/_/img/avatar.jpg'"
          nzSize="small"
          class="mr-sm"
        ></nz-avatar>
        <span
          >{{  "管理员"
          }}<i nz-icon type="down" theme="outline" class="ml-sm" style="font-size:14px;"></i
        ></span>
      </div>
      <div nz-menu class="width-sm">
        <div nz-menu-item [nzDisabled]="true">
          <i class="anticon anticon-user mr-sm"></i>个人中心
        </div>
        <div nz-menu-item [nzDisabled]="true">
          <i class="anticon anticon-setting mr-sm"></i>设置
        </div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i class="anticon anticon-setting mr-sm"></i>退出登录
        </div>
      </div>
    </nz-dropdown>
  `
})
export class HeaderUserComponent implements OnInit {
  constructor(
    public settings: SettingsService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    // this.tokenService.clear();
    this.router.navigateByUrl("/passport/login");
  }
}
