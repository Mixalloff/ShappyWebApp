'use strict';

class Visualizer {

    static get routes() {
        return {
            'line': LineChart,
            'pie': PieChart
        }
    };

    static getChartTypeByRequestType(RequestType) {
        var routes = {
            'stocksperdate': 'line',
            'usersperstock': 'line',
            'countperstock': 'pie'
        };
        return routes[RequestType] || 'line';
    }

    static getByType(StatsType) {
        return  Visualizer.routes[Visualizer.getChartTypeByRequestType(StatsType)];
    }

}

class AbstractChart {

    constructor(stats) {
        this.stats = stats;
    }

    createCanvas(width,height) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        return this;
    }
    getCanvas() {
        return this.canvas.getContext('2d');
    }

    appendTo(id) {
        document.getElementById(id).appendChild(this.canvas);
        this.fillCanvas();
    }
}

class LineChart extends AbstractChart {

    generateData() {
        this.data = {
            labels: this.stats.getX(),
            datasets: [
                {
                    fillColor: "rgba(172,194,132,0.4)",
                    strokeColor: "#ACC26D",
                    pointColor: "#fff",
                    pointStrokeColor: "#9DB86D",
                    data: this.stats.getY()
                }
            ]
        };
    }

    fillCanvas() {
        this.generateData();
        new Chart(this.getCanvas()).Line(this.data);
    }
}
class PieChart extends  AbstractChart {

    static get colors() {
        return ["#F7464A","#46BFBD","#FDB45C"];
    };

    generateData() {
        var counter = 0;
        this.data=[];
        for (var item in this.stats.data) {
            this.data.push(
            {
                value: this.stats.data[item],
                color:PieChart.colors[counter++],
                highlight: "#FF5A5E",
                label: item
            }
        )
        }
    }

    fillCanvas() {
        this.generateData();
        new Chart(this.getCanvas()).Pie(this.data);
    }
}