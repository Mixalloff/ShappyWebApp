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

    createCanvas(width,height,header) {
        this.canvas = document.createElement('canvas');
        this.table = document.createElement('div');
        this.header = document.createElement('h5');
        this.header.innerHTML = header;
        this.table.className = 'list-group';
        this.table.style.display = 'inline-block';
        this.canvas.width = width;
        this.canvas.height = height;
        return this;
    }
    getCanvas() {
        return this.canvas.getContext('2d');
    }

    appendTo(id) {
        var parent = document.getElementById(id);
        parent.appendChild(this.header);
        parent.appendChild(this.canvas);
        parent.appendChild(this.table);
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

    static GetRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    generateData() {
        this.data=[];
        for (var item in this.stats.data) {
            var button = document.createElement('button');
            button.className='list-group-item';
            button.innerHTML = item;
            this.table.appendChild(button);
            var color = PieChart.GetRandomColor();
            var label = document.createElement('div');
            label.style.width = '10px';
            label.style.height = '10px';
            label.style.backgroundColor = color;
            label.style.display = 'inline-block';
            label.style.marginLeft = '10px';
            button.appendChild(label);
            this.data.push(
            {
                value: this.stats.data[item],
                color:color,
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