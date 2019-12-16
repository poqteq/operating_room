import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data-ntegration',
  templateUrl: './data-ntegration.component.html',
  styleUrls: ['./data-ntegration.component.less']
})
export class DataNtegrationComponent implements OnInit, AfterViewInit{
  selectedValue: any;
  selectList: any[] = [];
  positionData: any = [];
  positions: any[] = [];
  map: any;
  polygon: any;
  @ViewChildren('containerMap') containerMap: ElementRef;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getDataFromServer();
  }
  ngAfterViewInit(): void {
    this.map = new AMap.Map("containerMap", {
        resizeEnable: true,
        center: [116.397428, 39.90923],// 地图中心点
        zoom: 10 // 地图显示的缩放级别
    });
   
  }
  getDataFromServer() {
      this.http.get('http://10.18.42.100:8010/api/web/grids').subscribe((result: any) => {
            this.positionData = result;
            const selectList = [];
            result.forEach(el => {
                selectList.push({
                    code: el.code,
                    name: el.name
                });
            });
            this.selectList = selectList;
      })
  }
  areaChange($event) {
      if(this.polygon) {
          this.map.remove(this.polygon);
      }
     const pos = [];
     const pp = this.positionData.find(el => el.code === $event).points;
     pp.sort((a, b) => {
         if(a.id < b.id) {
             return 1;
         }
         if(a.id > b.id) {
            return -1;
        }
        return 0;
     })
     pp.forEach(el => {
        pos.push([Number(el.lng), Number(el.lat)]);
     });
     this.polygon = new AMap.Polygon({
        strokeWeight: 1,
        path: pos,
        fillOpacity: 0.4,
        fillColor: '#80d8ff',
        strokeColor: '#0091ea'
    });
    this.map.add(this.polygon);
    this.map.setFitView([this.polygon]); // 视口自适应

  }

}
