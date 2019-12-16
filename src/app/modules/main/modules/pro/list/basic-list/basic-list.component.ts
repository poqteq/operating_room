import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { ApiDataService } from '../../../../snippets/services/api.data.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'pro-basic-list',
    templateUrl: './basic-list.component.html',
    styleUrls: [ './basic-list.component.less' ]
})
export class ProBasicListComponent implements OnInit {
    q: any = {
        status: 'all'
    };
    loading = false;
    data: any[] = [];

    constructor(private http: ApiDataService, public msg: NzMessageService) {}

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.loading = true;
        this.http.getApiList(5).subscribe((res: any) => {
            this.data = res;
            this.loading = false;
        });
    }
}
