import { Component, HostListener } from "@angular/core";
import { NzModalService, NzMessageService } from "ng-zorro-antd";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "header-storage",
  template: `
    <i class="anticon anticon-tool"></i>
    {{ '清除存储'}}`,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    "[class.d-block]": "true"
  }
})
export class HeaderStorageComponent {
  constructor(
    private confirmServ: NzModalService,
    private messageServ: NzMessageService
  ) {}

  @HostListener("click")
  _click() {
    this.confirmServ.confirm({
      nzTitle: "Make sure clear all local storage?",
      nzOnOk: () => {
        localStorage.clear();
        this.messageServ.success("Clear Finished!");
      }
    });
  }
}
