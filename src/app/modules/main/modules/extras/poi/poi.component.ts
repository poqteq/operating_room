import { Component, ViewChild } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";

import { ExtrasPoiEditComponent } from "./edit/edit.component";
import { SimpleTableComponent, SimpleTableColumn } from "fui-abc";
import { ModalHelper } from "fui-theme";

@Component({
  selector: "app-extras-poi",
  templateUrl: "./poi.component.html"
})
export class ExtrasPoiComponent {
  @ViewChild("st") st: SimpleTableComponent;
  s: any = {
    pi: 1,
    ps: 10,
    s: ""
  };
  url = "/pois";
  columns: SimpleTableColumn[] = [
    { title: "编号", index: "id", width: "100px" },
    { title: "门店名称", index: "name" },
    { title: "分店名", index: "branch_name" },
    { title: "状态", index: "status_str", width: "100px" },
    {
      title: "操作",
      width: "180px",
      buttons: [
        {
          text: "编辑",
          type: "modal",
          component: ExtrasPoiEditComponent,
          paramName: "i",
          click: () => this.msg.info("回调，重新发起列表刷新")
        },
        { text: "图片", click: () => this.msg.info("click photo") },
        { text: "经营SKU", click: () => this.msg.info("click sku") }
      ]
    }
  ];

  constructor(public msg: NzMessageService, private modal: ModalHelper) {}

  add() {
    this.modal
      .static(ExtrasPoiEditComponent, { i: { id: 0 } })
      .subscribe(() => {
        this.st.load();
        this.msg.info("回调，重新发起列表刷新");
      });
  }
}
