import { Component, OnInit } from "@angular/core";
import { NzMessageService, NzTabChangeEvent } from "ng-zorro-antd";
import { SimpleTableColumn } from "fui-abc";
import { HttpClient } from "@angular/common/http";
import { ProfileService } from "../../../../snippets/services/profile.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "pro-profile-advanced",
  templateUrl: "./advanced.component.html",
  styleUrls: ["./advanced.component.less"]
})
export class ProProfileAdvancedComponent implements OnInit {
  list: any[] = [];

  data = {
    advancedOperation1: [],
    advancedOperation2: [],
    advancedOperation3: []
  };

  opColumns: SimpleTableColumn[] = [
    { title: "操作类型", index: "type" },
    { title: "操作人", index: "name" },
    { title: "执行结果", index: "status", render: "status" },
    { title: "操作时间", index: "updatedAt", type: "date" },
    { title: "备注", index: "memo", default: "-" }
  ];
  constructor(public msg: NzMessageService, private http: ProfileService) {}

  ngOnInit() {
    this.getData();
  }

  // tslint:disable-next-line:member-ordering
  q = { ps: 10 };
  // tslint:disable-next-line:member-ordering
  loading = false;
  getData() {
    this.loading = true;
    this.http.getProfileAdvanced(this.q.ps).subscribe((res: any) => {
      this.data = res;
      this.change({ index: 0, tab: null });
      this.loading = false;
    });
  }
  change(args: NzTabChangeEvent) {
    this.list = this.data[`advancedOperation${args.index + 1}`];
  }
}
