import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ResourceMtService } from "../resource-mt.service";

@Component({
  selector: 'app-household',
  templateUrl: './household.component.html',
  styleUrls: ['./household.component.less']
})
export class HouseholdComponent implements OnInit {
  // 搜索表单
  formModel: FormGroup;
  // 分页
  currentPage = 1;
  perPage = 20;
  totalAmount = 2;
  // 展开收起
  expandForm = false;
  // 选中的信息
  loading = false;
  // 表格
  dataSet = [];
  communityOption = [{ label: "社区", value: "社区" }];
  gridOption = [{ label: "网格", value: "网格" }];
  tagOption = [{ label: "普通户", value: "1" }];
  sInfo = "";

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private msg: NzMessageService,
      private service: ResourceMtService
  ) {}

  ngOnInit() {
    this.formModel = this.fb.group({
      form_tag: ["1"],
      form_community: ["社区"],
      form_grid: ["网格"]
    });
    this.searchInfo();
  }

  // 查询||获取数据列表
  searchInfo() {
    this.dataSet = [
      {
        bh: "6748639141058552159",
        sssq: "华阳新区",
        sswg: "111",
        ld: "4号楼",
        dy: "1单元",
        fh: "101",
        fwmj: "2300",
        zp: ":暂无",
        bq: "普通户",
        ms: "暂无"
      },
      {
        bh: "6748639141058552159",
        sssq: "华阳新区",
        sswg: "111",
        ld: "4号楼",
        dy: "1单元",
        fh: "101",
        fwmj: "2300",
        zp: "暂无",
        bq: "普通户",
        ms: "暂无"
      }
    ];
  }

  // 重置
  resetInfo() {
    this.formModel.reset();
    this.currentPage = 1;
    this.searchInfo();
  }
  // 分页相关
  pageSizeChange(pageSize) {
    this.perPage = pageSize;
    this.currentPage = 1;
    this.searchInfo();
  }
  pageIndexChange(page) {
    this.currentPage = page;
    this.searchInfo();
  }
}
