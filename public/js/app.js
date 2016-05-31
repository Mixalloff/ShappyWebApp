'use strict';


var app = angular.module('app',['ngMaterial','ngMdIcons','lfNgMdFileInput'])

    .directive("lfFiles", function () {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.lfFiles, function(val) {
                    scope.logo = val;
                });
            }
        };
    })
    .directive("circleGraph", function() {

        return {
            restrict: 'EA',
            template: '<div class="md-whiteframe-4dp stat_block"><md-button ng-click="showDetail($event)" aria-label="more_vert" class="md-icon-button"> <ng-md-icon icon="more_vert"></ng-md-icon> </md-button></div>',
            replace: true,

            link: function(scope, element, attrs) {
                var GetRandomColor = () => {
                    var letters = '0123456789ABCDEF'.split('');
                    var color = '#';
                    for (var i = 0; i < 6; i++ ) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                };

                var  parseCircleStats =  (data) => {
                    var newdata={};
                    Object.keys(data).forEach((value) => {
                        newdata[value] = data[value].length;
                    });
                    var result=[];
                    Object.keys(newdata).forEach((item)=> {
                        result.push({
                            value: newdata[item],
                            label:item,
                            color: GetRandomColor()
                        })
                    });
                    return result;
                };


                scope.$watch(attrs.circleGraph, function(newVal, oldVal){
                    if (newVal!==oldVal)
                    {
                        var val = parseCircleStats(newVal);
                        var canvas = document.createElement('canvas');
                        for (var i = element[0].childNodes.length-1; i >=0; i--) {
                            if (element[0].childNodes[i].tagName!="BUTTON")
                            {
                                element[0].removeChild(element[0].childNodes[i]);
                            }
                        }
                        scope.addHeader(element[0], attrs['header']);
                        element[0].appendChild(canvas);
                        scope.addLegenda(element[0],val);
                        new Chart(canvas.getContext('2d')).Pie(val);
                    }

                },false);
            }
        }
    })
    .directive("lineGraph", function() {

        return {
            restrict: 'EA',
            template: '<div class="md-whiteframe-4dp stat_block"><md-button ng-click="showDetail($event)" aria-label="more_vert" class="md-icon-button"> <ng-md-icon icon="more_vert"></ng-md-icon> </md-button></div>',
            replace: true,
            link: function(scope, element, attrs) {
                var parseLineStats =  (data) =>  {
                    var result = {};
                    Object.keys(data).forEach((stock)=> {
                        data[stock].forEach((date)=> {
                            result[date] = result[date] + 1 || 1;
                        });
                    });
                    var fillDate = {};
                    for (var i = new Date(scope.start); i <= scope.end; i.setDate(i.getDate()+1)) {

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
                    return {
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
                };

                scope.$watch(attrs.lineGraph, function(newVal, oldVal){
                    if (newVal!==oldVal)
                    {
                        var val = parseLineStats(newVal);
                        var canvas = document.createElement('canvas');
                        for (var i = element[0].childNodes.length-1; i >=0; i--) {
                            if (element[0].childNodes[i].tagName!="BUTTON")
                            {
                                element[0].removeChild(element[0].childNodes[i]);
                            }
                        }
                        scope.addHeader(element[0], attrs['header']);
                        element[0].appendChild(canvas);
                        new Chart(canvas.getContext('2d')).Line(val);
                    }

                },false);
            }
        }
    })
    .directive("funnelGraph", function() {

        return {
            restrict: 'EA',
            template: '<div></div>',
            replace: true,

            link: function(scope, element, attrs) {

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

                var convertToPercent = (data) => {
                    var sum_users = data.viewsInFeed;

                    Object.keys(data).forEach((item)=>{
                        data[item]=Math.round(data[item]/sum_users*100);
                    });
                };

                var  parseFunnelStats =  (data) => {
                    convertToPercent(data);
                    var result = {};
                    Object.keys(data).forEach((item)=> {
                        var doughnut_parts = [];
                        doughnut_parts.push({
                            value: data[item],
                            color:settings[item].color
                        });
                        doughnut_parts.push({
                            value: 100 - data[item],
                            color:settings[item].highlight
                        });
                        result[item] = doughnut_parts;
                    });
                    return result;
                };


                scope.$watch(attrs.funnelGraph, function(newVal, oldVal){
                    if (newVal!==oldVal)
                    {
                        var val = parseFunnelStats(newVal);

                        while (element[0].hasChildNodes()) {
                            element[0].removeChild(element[0].lastChild);
                        }
                        Object.keys(val).forEach((doughnut) => {
                            var parent_canvas = document.createElement("div");
                            parent_canvas.className="p_canvas";
                            var canvas = document.createElement('canvas');
                            var header = document.createElement('span');
                            header.innerHTML = settings[doughnut].tip;
                            var percent = document.createElement('b');
                            percent.innerHTML = val[doughnut][0].value+"%";
                            parent_canvas.appendChild(percent);
                            parent_canvas.appendChild(header);
                            parent_canvas.appendChild(canvas);
                            element[0].appendChild(parent_canvas);
                            new Chart(canvas.getContext('2d')).Doughnut(val[doughnut], {percentageInnerCutout: 70});
                        });
                    }
                },true);
            }
        }
    });

    var stockApp = angular.module('stockApp',['app','wu.masonry']);


