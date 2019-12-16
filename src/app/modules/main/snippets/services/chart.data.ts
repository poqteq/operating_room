import { format } from 'date-fns';
import { Inject } from '@angular/core';

export class ChartData {
    visitData: any = [];
    visitData2: any = [];
    salesData: any = [];
    searchData: any = [];
    salesTypeData: any = [];
    salesTypeDataOnline: any = [];
    salesTypeDataOffline: any = [];
    offlineData: any = [];
    radarData: any = [];
    radarTitleMap: any = {};
    offlineChartData: any = [];
    radarOriginData: any = [];
    constructor() {
        this.visitData = [];
        const beginDay = new Date().getTime();

        const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
        for (let i = 0; i < fakeY.length; i += 1) {
            this.visitData.push({
                x: format(
                    new Date(beginDay + 1000 * 60 * 60 * 24 * i),
                    'YYYY-MM-DD'
                ),
                y: fakeY[i]
            });
        }

        this.visitData2 = [];
        const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
        for (let i = 0; i < fakeY2.length; i += 1) {
            this.visitData2.push({
                x: format(
                    new Date(beginDay + 1000 * 60 * 60 * 24 * i),
                    'YYYY-MM-DD'
                ),
                y: fakeY2[i]
            });
        }

        this.salesData = [];
        for (let i = 0; i < 12; i += 1) {
            this.salesData.push({
                x: (i + 1) + '月',
                y: Math.floor(Math.random() * 1000) + 200
            });
        }
        this.searchData = [];
        for (let i = 0; i < 50; i += 1) {
            this.searchData.push({
                index: i + 1,
                keyword: '搜索关键词-' + i,
                count: Math.floor(Math.random() * 1000),
                range: Math.floor(Math.random() * 100),
                status: Math.floor((Math.random() * 10) % 2)
            });
        }
        this.salesTypeData = [
            {
                x: '家用电器',
                y: 4544
            },
            {
                x: '食用酒水',
                y: 3321
            },
            {
                x: '个护健康',
                y: 3113
            },
            {
                x: '服饰箱包',
                y: 2341
            },
            {
                x: '母婴产品',
                y: 1231
            },
            {
                x: '其他',
                y: 1231
            }
        ];

        this.salesTypeDataOnline = [
            {
                x: '家用电器',
                y: 244
            },
            {
                x: '食用酒水',
                y: 321
            },
            {
                x: '个护健康',
                y: 311
            },
            {
                x: '服饰箱包',
                y: 41
            },
            {
                x: '母婴产品',
                y: 121
            },
            {
                x: '其他',
                y: 111
            }
        ];

        this.salesTypeDataOffline = [
            {
                x: '家用电器',
                y: 99
            },
            {
                x: '个护健康',
                y: 188
            },
            {
                x: '服饰箱包',
                y: 344
            },
            {
                x: '母婴产品',
                y: 255
            },
            {
                x: '其他',
                y: 65
            }
        ];

        this.offlineData = [];
        for (let i = 0; i < 10; i += 1) {
            this.offlineData.push({
                name: `门店${i}`,
                cvr: Math.ceil(Math.random() * 9) / 10
            });
        }
        this.offlineChartData = [];
        for (let i = 0; i < 20; i += 1) {
            this.offlineChartData.push({
                x: new Date().getTime() + 1000 * 60 * 30 * i,
                y1: Math.floor(Math.random() * 100) + 10,
                y2: Math.floor(Math.random() * 100) + 10
            });
        }

        this.radarOriginData = [
            {
                name: '个人',
                ref: 10,
                koubei: 8,
                output: 4,
                contribute: 5,
                hot: 7
            },
            {
                name: '团队',
                ref: 3,
                koubei: 9,
                output: 6,
                contribute: 3,
                hot: 1
            },
            {
                name: '部门',
                ref: 4,
                koubei: 1,
                output: 6,
                contribute: 5,
                hot: 7
            }
        ];

        //
        this.radarData = [];
        this.radarTitleMap = {
            ref: '引用',
            koubei: '口碑',
            output: '产量',
            contribute: '贡献',
            hot: '热度'
        };
        this.radarOriginData.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== 'name') {
                    this.radarData.push({
                        name: item.name,
                        label: this.radarTitleMap[key],
                        value: item[key]
                    });
                }
            });
        });
    }
    getChartData() {
        return {
            visitData: this.visitData,
            visitData2: this.visitData2,
            salesData: this.salesData,
            searchData: this.searchData,
            offlineData: this.offlineData,
            offlineChartData: this.offlineChartData,
            salesTypeData: this.salesTypeData,
            salesTypeDataOnline: this.salesTypeData,
            salesTypeDataOffline: this.salesTypeDataOffline,
            radarData: this.radarData
        };
    }

}
