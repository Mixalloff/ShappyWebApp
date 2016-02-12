'use strict';

var app = angular.module('app',['ngMaterial','ngMdIcons']);

app.controller('Stats', function($scope) {

});

$(document).ready(()=> {
    var stats_obj = Stats.getByType(stats_data);
    var users_obj = Stats.getByType(users_data);
    var GraphicF = Visualizer.getByType(stats_data.type);
    var GraphicS = Visualizer.getByType(users_data.type);
    new GraphicF(stats_obj).createCanvas(600, 200, 'Общее количество добавленных пользователями акций').appendTo('countAdditionsPerDate');
    new GraphicS(users_obj).createCanvas(300, 200, 'Количество пользователей по каждой акции').appendTo('countAdditionsPerStock');
});

