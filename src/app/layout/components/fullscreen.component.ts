import { Component, HostListener } from "@angular/core";
import * as screenfull from "screenfull";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "header-fullscreen",
  template: `
    <i class="anticon anticon-{{status ? 'shrink' : 'arrows-alt'}}"></i>
    {{(status ? '取消全屏' : '全屏')  }}
    `,
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    "[class.d-block]": "true"
  }
})
export class HeaderFullScreenComponent {
  status = false;

  @HostListener("window:resize")
  _resize() {
    this.status = screenfull.isFullscreen;
  }

  @HostListener("click")
  _click() {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
}
