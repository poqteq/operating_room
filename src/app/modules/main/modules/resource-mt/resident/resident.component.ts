import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ResourceMtService } from "../resource-mt.service";

@Component({
  selector: "app-resident",
  templateUrl: "./resident.component.html",
  styleUrls: ["./resident.component.less"]
})
export class ResidentComponent implements OnInit {
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
  domicileOption = [{ label: "户籍人口", value: "1" },
    { label: "流动人口", value: "2" },
    { label: "未落户人口", value: "3" },
    { label: "境外人口", value: "4" }];
  sInfo = "";

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private msg: NzMessageService,
      private service: ResourceMtService
  ) {}

  ngOnInit() {
    this.formModel = this.fb.group({
      form_grid: ["网格"],
      form_community: ["社区"],
      form_domicile: ["1"]
    });
    this.searchInfo();
  }

  // 查询||获取数据列表
  searchInfo() {
    this.dataSet = [
      {
        bh: "6748639141058552159",
        xm: "张三",
        hjdz: "87号",
        xb: "男",
        hyzk: "已婚",
        sfzh: "370602196601011234",
        gzdw: "厦门鱼肝油厂",
        sjh: "13111111111",
        sssq: "11区",
        fh: "6748639141058552159",
        zp: "暂无",
        bq: "户籍人口",
        bz: "暂无"
      },
      {
        bh: "6748205581289890249",
        xm: "王五",
        hjdz: "87号",
        xb: "男",
        hyzk: "已婚",
        sfzh: "370602196601015678",
        gzdw: "厦门鱼肝油厂",
        sjh: "13111111111",
        sssq: "11区",
        fh: "6748205581289890249",
        zp: "暂无",
        bq: "户籍人口",
        bz: "暂无"
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
