'use strict';

class AbstractStats {

    static get daysPerMonth() {
        return [31,29,31,30,31,30,31,31,30,31,30,31];
    };

    constructor(data, startDate, endDate) {
        this.data = data;
        this.DataX = [];
        this.DataY = [];
        this.filtered={};
        this.startDate = startDate;
        this.endDate = endDate;
    }

    filter(start,end){
        Object.keys(this.filtered).forEach((stock)=> {
            this.filtered[stock] = this.filterDateArray(this.filtered[stock],start,end);
        });
    }

    filterDateArray(dates,start,end) {
        return dates.filter((date)=> {
            date = new Date(date);
            return date>=new Date(start) && date<=new Date(end);
        })
    }

    updateDate(startDate,endDate) {
        this.filtered = this.data;
        this.filter(startDate,endDate);
        this.init(startDate,endDate);
    }

    getX() {
        return this.DataX; //po start date end date
    }

    getY() {
        return this.DataY
    }


}

class StocksPerDate extends  AbstractStats
{
    init(startDate,endDate) {

        this.generate();

        var fillDate = {};

        for (var i = new Date(startDate); i <= endDate; i.setDate(i.getDate()+1)) {

            var day = i.toDateString();
            var data = this.filtered[day];
            fillDate[i.toLocaleString().split(' ')[0]] = data || 0;
        }

        this.DataX = [];
        this.DataY = [];

        Object.keys(fillDate).forEach((item)=> {
            this.DataX.push(item);
            this.DataY.push(fillDate[item]);
        });
    }
    generate() {
            var result = {};
            Object.keys(this.filtered).forEach((stock)=> {
                this.filtered[stock].forEach((date)=> {
                    if (!result[date]) result[date]=1; else  result[date] += 1;
                    result[date] = result[date] + 1 || 1;
                });
            });
            this.filtered = result;
    }
}


class UsersPerStock extends  AbstractStats{

    init(startDate,endDate) {
        Object.keys(this.filtered).map((value) => {
            this.filtered[value] = this.filtered[value].length;
        });
    }
}

class FunnelStock extends AbstractStats {
    init(data) {
       var sum_users = Object.keys(data).reduce((pv,cv)=> {
           return pv + data[cv];
       },0);
       Object.keys(data).forEach((item)=>{
          data[item]=Math.round(data[item]/sum_users*100);
       });
       this.data = data;
    }
}











