import { Component, OnInit, OnDestroy } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";

import { HttpClient } from "@angular/common/http";
import { zip } from "rxjs";
import { yuan } from "@core/utils";
import { ChartService } from "../../../snippets/services/chart.service";
import * as format from "date-fns/format";
import * as addSeconds from "date-fns/add_seconds";

@Component({
  selector: "app-dashboard-monitor",
  templateUrl: "./monitor.component.html",
  styleUrls: ["./monitor.component.less"]
})
export class DashboardMonitorComponent implements OnInit, OnDestroy {
  data: any = {};
  tags = [];
  loading = true;
  q: any = {
    start: null,
    end: null
  };
  config = {
    template: `$!h!:$!m!:$!s!`,
    stopTime: addSeconds(new Date(), 30).valueOf()
  };
  constructor(private charts: ChartService, public msg: NzMessageService) {}

  ngOnInit() {
    zip(this.charts.getChart(), this.charts.getChartTag()).subscribe(
      ([res, tags]: [any, any]) => {
        this.data = res;
        tags.list[
          Math.floor(Math.random() * tags.list.length) + 1
        ].value = 1000;
        this.tags = tags.list;
        this.loading = false;
      }
    );

    // active chart
    this.genActiveData();
    this.activeTime$ = setInterval(() => this.genActiveData(), 1000);
  }

  // region: active chart

  // tslint:disable-next-line:member-ordering
  activeTime$: any;

  // tslint:disable-next-line:member-ordering
  activeYAxis = {
    tickCount: 3,
    tickLine: false,
    labels: false,
    title: false,
    line: false
  };

  // tslint:disable-next-line:member-ordering
  activeData: any[] = [];

  // tslint:disable-next-line:member-ordering
  activeStat = {
    max: 0,
    min: 0,
    t1: "",
    t2: ""
  };

  genActiveData() {
    const activeData = [];
    for (let i = 0; i < 24; i += 1) {
      const _i = (i + "").padStart(2, "0") + ":00";
      activeData.push({
        //  x: `${i.toString().padStart(2, "0")}:00`,
        x: _i,
        y: i * 50 + Math.floor(Math.random() * 200)
      });
    }
    this.activeData = activeData;
    // stat
    this.activeStat.max = [...activeData].sort()[activeData.length - 1].y + 200;
    this.activeStat.min = [...activeData].sort()[
      Math.floor(activeData.length / 2)
    ].y;
    this.activeStat.t1 = activeData[Math.floor(activeData.length / 2)].x;
    this.activeStat.t2 = activeData[activeData.length - 1].x;
  }

  // endregion

  couponFormat(val: any) {
    switch (parseInt(val, 10)) {
      case 20:
        return "差";
      case 40:
        return "中";
      case 60:
        return "良";
      case 80:
        return "优";
      default:
        return "";
    }
  }

  ngOnDestroy(): void {
    if (this.activeTime$) {
      clearInterval(this.activeTime$);
    }
  }
}
