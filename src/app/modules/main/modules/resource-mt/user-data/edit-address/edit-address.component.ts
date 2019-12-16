import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: "app-edit-address",
  templateUrl: "./edit-address.component.html",
  styleUrls: ["./edit-address.component.less"]
})
export class EditAddressComponent implements OnInit {
  menuForm: any;
  data; // 接收的所有数据
  info; // 弹框数据
  isVisible = false;
  title = "地址编辑";
  provinceOption = [{ label: "省", value: "省" }];
  cityOption = [{ label: "市", value: "市" }];
  areaOption = [{ label: "区/县", value: "区/县" }];
  streetOption = [{ label: "办事处/街道", value: "办事处/街道" }];
  villageOption = [{ label: "社区/村", value: "社区/村" }];
  roadOption = [{ label: "小区/街路巷", value: "小区/街路巷" }];
  @Input("getdata")
  get getdata() {
    return this.getdata;
  }
  set getdata(val: any) {
    this.menuForm.reset();
    this.data = val;
    this.isVisible = val.isOpen;
    this.title = "地址编辑";
  }
  @Output() infoemit: EventEmitter<any> = new EventEmitter();

  constructor(private fb: FormBuilder, private msg: NzMessageService) {
    this.menuForm = this.fb.group({
      form_province: [null],
      form_city: [null],
      form_area: [null],
      form_street: [null],
      form_village: [null],
      form_road: [null]
    });
  }

  ngOnInit() {}

  // 取消弹框
  handleCancel() {
    this.isVisible = false;
  }
  // 确定
  handleOK() {
    this.isVisible = false;
    console.log(this.menuForm);
  }
}
