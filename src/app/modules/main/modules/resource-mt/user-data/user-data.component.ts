import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ResourceMtService } from "../resource-mt.service";

@Component({
  selector: "app-user-data",
  templateUrl: "./user-data.component.html",
  styleUrls: ["./user-data.component.less"]
})
export class UserDataComponent implements OnInit {
  // 搜索表单
  formModel: FormGroup;
  // 分页
  currentPage = 1;
  perPage = 20;
  totalAmount = 9;
  // 展开收起
  expandForm = false;
  // 选中的信息
  loading = false;
  // 表格
  dataSet = [];
  addressOption = [
    { label: "办事处", value: "办事处" },
    { label: "姚家街道", value: "姚家街道" }
  ];
  communityOption = [{ label: "社区", value: "社区" }];
  gridOption = [{ label: "网格", value: "网格" }];
  sInfo = "";

  emitData = { isOpen: false };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private msg: NzMessageService,
    private service: ResourceMtService
  ) {}

  ngOnInit() {
    this.formModel = this.fb.group({
      form_address: ["办事处"],
      form_community: ["社区"],
      form_grid: ["网格"]
    });
    this.searchInfo();
  }

  // 查询||获取数据列表
  searchInfo() {
    this.dataSet = [
      {
        xh: "321300000000005213",
        yhxm: "孙某某",
        sfzh: "320321198804040888",
        drdz: "华阳社区海信都市阳光花园小区1号楼1单元0602",
        lxfs: "15001008933"
      }
    ];
    for (let i = 0; i < 9; i++) {
      this.dataSet.push({
        xh: "3213000000000052" + i,
        yhxm: "孙某" + i,
        sfzh: "320321198804040888" + i,
        drdz: "华阳社区海信都市阳光花园小区1号楼1单元06" + i,
        lxfs: "1500100893" + i
      });
    }
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

  // 地址编辑
  editAddress(item) {
    this.emitData = { isOpen: true };
  }

  dataEmit(item) {}
}
