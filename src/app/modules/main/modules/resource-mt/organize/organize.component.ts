import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ResourceMtService } from "../resource-mt.service";

 @Component({
   selector: 'app-organize',
   templateUrl: './organize.component.html',
   styleUrls: ['./organize.component.less']
 })
 export class OrganizeComponent implements OnInit {
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
  classOption = [{ label: "服务", value: "1" }];
  classOption2 = [{ label: "宾馆", value: "1" }];
  classOption3 = [{ label: "服务", value: "1" }];
  sInfo = "";

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private msg: NzMessageService,
      private service: ResourceMtService
  ) {}

  ngOnInit() {
    this.formModel = this.fb.group({
      form_community: ["社区"],
      form_grid: ["网格"],
      form_class: ["1"],
      form_class2: ["1"],
      form_class3: ["1"],
    });
    this.searchInfo();
  }

  // 查询||获取数据列表
  searchInfo() {
    this.dataSet = [
      {
        bh: "6748639141058552159",
        xq: "解放东路",
        ld: "87号",
        cg: "6层",
        jd: "117.08518440000000",
        wd: "36.67278360000000",
        ldzp: "暂无"
      },
      {
        bh: "6748205581289890249",
        xq: "科苑小区南区",
        ld: "32号楼",
        cg: "7层",
        jd: "117.09875280000000",
        wd: "36.69457150000000",
        ldzp: "暂无"
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

