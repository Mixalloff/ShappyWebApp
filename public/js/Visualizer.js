'use strict';

class Visualizer {

    static get routes() {
        return {
            'line': LineChart,
            'pie': PieChart,
            'funnel': FunnelChart
        }
    };

    static getChartTypeByRequestType(RequestType) {
        var routes = {
            'stocksperdate': 'line',
            'usersperstock': 'line',
            'countperstock': 'pie',
            'stockinfo': 'funnel'
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
        this.header = document.createElement('h5');
        this.header.innerHTML = header;
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
            var color = PieChart.GetRandomColor();
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
class Doughnut extends PieChart {

    constructor(stats,color,highlight)
    {
        super(stats);
        this.color = color;
        this.highlight = highlight;
    }
    generateData() {

            this.data=[];
            this.data.push(
                {
                    value: this.stats,
                    color:this.color
                }
            );
            this.data.push(
                {
                    value: 100 - this.stats,
                    color: this.highlight
                }
            )
        }
    fillCanvas() {
        this.generateData();
        var ctx = this.getCanvas();
        var val = this.stats;
        new Chart(this.getCanvas()).Doughnut(this.data, {
            percentageInnerCutout: 70,
        });
    };
}

class FunnelChart extends  AbstractChart {


    generateData() {
        var settings = {
            viewsInFeed: {
                color: "#441AAD",
                highlight: "#967ADE",
                tip: "Выдачи"
            },
            views: {
                color: "#521573",
                highlight: "#A678BF",
                tip: "Просмотры"
            },
            subscribes: {
                color: "#259C13",
                highlight: "#7CDE6D",
                tip: "Подписки"
            },
            uses: {
                color: "#D4D408",
                highlight: "#FCF9AE",
                tip: "Использования"
            },
            reuses: {
                color: "#DE1818",
                highlight: "#FFD4D4",
                tip: "Повторные использования"
            }
        };
        this.doughnuts = [];
        Object.keys(this.stats.data).forEach((item)=> {
            this.doughnuts.push(new Doughnut(this.stats.data[item],settings[item].color,settings[item].highlight).createCanvas(180,180,settings[item].tip))
        });
    }
    fillCanvas() {
        this.generateData();
    };
    createCanvas(width,height,header) {
        return this;
    }
    appendTo(id) {
        this.fillCanvas();
        var parent = document.getElementById(id);
        this.doughnuts.forEach((item)=> {
            var block  = document.createElement("div");
            block.className = "doughnut";
            var percent = document.createElement("span");
            percent.className = "percent";
            percent.innerHTML = item.stats+"%";
            block.appendChild(percent);

            block.appendChild(item.header);
            block.appendChild(item.canvas);
            parent.appendChild(block);
            item.fillCanvas();
        });

    }
}

