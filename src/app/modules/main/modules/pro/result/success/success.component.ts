import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'pro-result-success',
    templateUrl: './success.component.html'
})
export class ProResultSuccessComponent {
    constructor(public msg: NzMessageService) {}
}
