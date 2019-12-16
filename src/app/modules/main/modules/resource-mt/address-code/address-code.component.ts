import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ResourceMtService } from "../resource-mt.service";

@Component({
  selector: "app-medical-workers",
  templateUrl: "./medical-workers.component.html",
  styleUrls: ["./medical-workers.component.less"]
})
export class AddressCodeComponent implements OnInit {
  // 搜索表单
  formModel: FormGroup;
  // 分页
  currentPage = 1;
  perPage = 20;
  totalAmount = 0;
  // 展开收起
  expandForm = false;
  // 选中的信息
  loading = false;
  // 表格
  dataSet = [];
  deptOption = [
    { label: "办事处", value: "办事处" },
    { label: "姚家街道", value: "姚家街道" }
  ];
  sInfo = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private msg: NzMessageService,
    private service: ResourceMtService
  ) {}

  ngOnInit() {
    this.formModel = this.fb.group({
      form_province: [null],
      form_city: [null],
      form_area: [null],
      form_street: [null],
      form_village: [null],
      form_road: [null]
    });
    this.searchInfo();
  }

  // 查询||获取数据列表
  searchInfo() {
    this.dataSet = [];
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
