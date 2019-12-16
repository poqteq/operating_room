import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { ApiDataService } from '../../../../snippets/services/api.data.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'pro-list-card-list',
    templateUrl: './card-list.component.html',
    styles: [`
    :host ::ng-deep .ant-card-meta-title {
        margin-bottom: 12px;
    }
    `],
    encapsulation: ViewEncapsulation.Emulated
})
export class ProCardListComponent implements OnInit {

    list: any[] = [ null ];

    loading = true;

    constructor(private http: ApiDataService, public msg: NzMessageService) {}

    ngOnInit() {
        this.loading = true;
        this.http.getApiList(8).subscribe((res: any) => {
            this.list = this.list.concat(res);
            this.loading = false;
        });
    }
}
