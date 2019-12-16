import { Component, OnInit } from "@angular/core";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "layout-footer",
  template: `<global-footer class="mt-md mb-md text-center">
    烟台中科网络技术研究所 <i class="anticon anticon-copyright"></i> 2018
</global-footer>`
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
