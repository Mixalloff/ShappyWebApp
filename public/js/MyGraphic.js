'use strict';
class AbstractStats {

    constructor() {

    }

    filterDateArray(dates, start, end) {
        var filter = dates.filter((date)=> {
            date = new Date(date);
            return date >= new Date(start) && date <= new Date(end);
        });
        return filter;
    };

    uploadStats(cb, start, end) {
        var self = this;
        self.start = start;
        self.end = end;
        $.ajax({
            type: 'GET',
            url: server + this.route + "?token=" + getCookie('token')
        }).success(response=> {
            return cb.call(self, self.filter(response,start,end))
        });
    }
    updateStats(cb,start,end) {
        return cb(this.filter(this.data, start, end));
    }
}

class DateStats extends AbstractStats {

       filter(response,start,end) {
            this.data = response;
            var data = response.data;
            var filtered = data;
            Object.keys(filtered).forEach((stock)=> {
                filtered[stock] = this.filterDateArray(filtered[stock], start, end);
            });
            return filtered;
    };

    GetRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };


    parseCircleStats (data) {
        var newdata={};
        Object.keys(data).forEach((value) => {
            newdata[value] = data[value].length;
        });
        var result=[];
        Object.keys(newdata).forEach((item)=> {
            result.push({
                value: newdata[item],
                label:item,
                color: this.GetRandomColor()
            })
        });
        this.circleStats = result;
        return this.circleStats;
    };


    parseLineStats(data) {
        var result = {};
        Object.keys(data).forEach((stock)=> {
            data[stock].forEach((date)=> {
                result[date] = result[date] + 1 || 1;
            });
        });
        var fillDate = {};
        for (var i = new Date(this.start); i <= this.end; i.setDate(i.getDate()+1)) {

            var day = i.toDateString();
            var data = result[day];
            fillDate[i.toLocaleString().split(' ')[0]] = data || 0;
        }
        var DataX = [];
        var DataY = [];
        Object.keys(fillDate).forEach((item)=> {
            DataX.push(item);
            DataY.push(fillDate[item]);
        });

        this.lineStats = {
            labels: DataX,
            datasets: [
                {
                    fillColor: "rgba(172,194,132,0.4)",
                    strokeColor: "#ACC26D",
                    pointColor: "#fff",
                    pointStrokeColor: "#9DB86D",
                    data: DataY
                }
            ]
        };
        return this.lineStats;

    };
}
