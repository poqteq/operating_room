import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";

import { SimpleTableColumn } from "fui-abc";
import { yuan, getTimeDistance } from "@core/utils";
import { ChartService } from "../../../snippets/services/chart.service";

@Component({
  selector: "app-dashboard-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.less"]
})
export class DashboardAnalysisComponent implements OnInit {
  data: any = {
    salesData: [],
    offlineData: []
  };
  loading = true;
  q: any = {
    start: null,
    end: null
  };
  rankingListData: any[] = Array(7)
    .fill({})
    .map((item, i) => {
      return {
        title: `工专路 ${i} 号店`,
        total: 323234
      };
    });
  searchColumn: SimpleTableColumn[] = [
    { title: "排名", index: "index" },
    {
      title: "搜索关键词",
      index: "keyword",
      click: (item: any) => this.msg.success(item.keyword)
    },
    {
      type: "number",
      title: "用户数",
      index: "count",
      sorter: (a, b) => a.count - b.count
    },
    {
      type: "number",
      title: "周涨幅",
      index: "range",
      render: "range",
      sorter: (a, b) => a.range - b.range
    }
  ];
  constructor(
    private chartSrvice: ChartService,
    public msg: NzMessageService
  ) {}

  ngOnInit() {
    this.chartSrvice.getChart().subscribe((res: any) => {
      res.offlineData.forEach((item: any) => {
        item.chart = Object.assign([], res.offlineChartData);
      });
      this.data = res;
      this.loading = false;
      this.changeSaleType();
    });
  }

  setDate(type: any) {
    const rank = getTimeDistance(type);
    this.q.start = rank[0];
    this.q.end = rank[1];
  }

  // tslint:disable-next-line:member-ordering
  salesType = "all";
  // tslint:disable-next-line:member-ordering
  salesPieData: any;
  // tslint:disable-next-line:member-ordering
  salesTotal = 0;
  changeSaleType() {
    this.salesPieData =
      this.salesType === "all"
        ? this.data.salesTypeData
        : this.salesType === "online"
        ? this.data.salesTypeDataOnline
        : this.data.salesTypeDataOffline;
    if (this.salesPieData) {
      this.salesTotal = this.salesPieData.reduce((pre, now) => now.y + pre, 0);
    }
  }

  handlePieValueFormat(value: any) {
    return yuan(value);
  }

  // tslint:disable-next-line:member-ordering
  _activeTab = 0;
  _tabChange(value: any) {
    console.log("tab", this._activeTab, value);
  }
}
