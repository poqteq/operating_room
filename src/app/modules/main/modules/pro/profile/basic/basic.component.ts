import { Component } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";

import { tap } from "rxjs/operators";
import { SimpleTableColumn } from "fui-abc";
import { HttpClient } from "@angular/common/http";
import { ProfileService } from "../../../../snippets/services/profile.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "pro-profile-basic",
  templateUrl: "./basic.component.html"
})
export class ProProfileBaseComponent {
  basicNum = 0;
  amountNum = 0;
  goods = this.http.getProfileGoods().pipe(
    tap((list: any[]) => {
      list.forEach(item => {
        this.basicNum += Number(item.num);
        this.amountNum += Number(item.amount);
      });
    })
  );
  goodsColumns: SimpleTableColumn[] = [
    {
      title: "商品编号",
      index: "id",
      type: "link",
      click: (item: any) => this.msg.success(`show ${item.id}`)
    },
    { title: "商品名称", index: "name" },
    { title: "商品条码", index: "barcode" },
    { title: "单价", index: "price", type: "currency" },
    { title: "数量（件）", index: "num", className: "text-right" },
    { title: "金额", index: "amount", type: "currency" }
  ];
  progress = this.http.getProfileProgress();
  progressColumns: SimpleTableColumn[] = [
    { title: "时间", index: "time" },
    { title: "当前进度", index: "rate" },
    { title: "状态", render: "status" },
    { title: "操作员ID", index: "operator" },
    { title: "耗时", index: "cost" }
  ];

  constructor(private http: ProfileService, private msg: NzMessageService) {}
}
