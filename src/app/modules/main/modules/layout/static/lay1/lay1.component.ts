import { Component, OnInit } from "@angular/core";
import { Menu } from "fui-theme";

@Component({
  selector: "app-lay1",
  templateUrl: "./lay1.component.html",
  styleUrls: ["./lay1.component.less"]
})
export class Lay1Component implements OnInit {
  menus: Menu[] = [
    {
      link: "/app/layout/static/lay2",
      text: "首页"
    },
    {
      link: "/app/dashboard/analysis",
      text: "舆情分析"
    },
    {
      link: "/app/pro/form/advanced-form",
      text: "专项监测"
    },
    {
      link: "/app/dashboard/monitor",
      text: "舆情预警"
    },
    {
      link: "/app/extras/settings",
      text: "用户设置"
    }
  ];
  ngOnInit() {}
}
