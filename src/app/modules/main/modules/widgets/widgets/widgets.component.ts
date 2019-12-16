import { NzMessageService } from "ng-zorro-antd";
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-widgets",
  templateUrl: "./widgets.component.html",
  styleUrls: ["./widgets.component.less"]
})
export class WidgetsComponent {
  data = [];
  smallData = [];

  todoData: any[] = [
    {
      completed: true,
      avatar: "1",
      name: "苏先生",
      content: `请告诉我，我应该说点什么好？`
    },
    {
      completed: false,
      avatar: "2",
      name: "はなさき",
      content: `ハルカソラトキヘダツヒカリ`
    },
    {
      completed: false,
      avatar: "3",
      name: "yantaizhongke",
      content: `this world was never meant for one as beautiful as you.`
    },
    {
      completed: false,
      avatar: "4",
      name: "Kent",
      content: `my heart is beating with hers`
    },
    {
      completed: false,
      avatar: "5",
      name: "Are you",
      content: `They always said that I love beautiful girl than my friends`
    },
    {
      completed: false,
      avatar: "6",
      name: "Forever",
      content: `Walking through green fields ，sunshine in my eyes.`
    }
  ];

  like = false;

  dislike = false;

  constructor(public msg: NzMessageService, private http: HttpClient) {
    this.data = [
      { x: "2018-11-27", y: 7 },

      { x: "2018-11-28", y: 5 },

      { x: "2018-11-29", y: 4 },

      { x: "2018-11-30", y: 2 },

      { x: "2018-12-01", y: 4 },

      { x: "2018-12-02", y: 7 },

      { x: "2018-12-03", y: 5 },

      { x: "2018-12-04", y: 6 },

      { x: "2018-12-05", y: 5 },

      { x: "2018-12-06", y: 9 },

      { x: "2018-12-07", y: 6 },

      { x: "2018-12-08", y: 3 },

      { x: "2018-12-09", y: 1 },

      { x: "2018-12-10", y: 5 },

      { x: "2018-12-11", y: 3 },

      { x: "2018-12-12", y: 6 },

      { x: "2018-12-13", y: 5 }
    ];
    this.smallData = this.data.slice(0, 6);
    // this.http.get('/chart/visit').subscribe((res: any[]) => {
    //     this.data = res;

    // });
  }
}
