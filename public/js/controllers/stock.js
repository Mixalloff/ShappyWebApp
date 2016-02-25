'use strict';

angular.module('app').controller('Stock', function($scope) {
    $scope.submit = function() {
        var formData =new FormData($("form#edit_stock")[0]);
        formData.append("category",$("form#edit_stock a.active").attr("id"));
        formData.append("token",getCookie("token"));
        if ($scope.logo[0]) formData.append("logo",$scope.logo[0].lfFile);
        formData.append("startDate",$scope.stock.startDate);
        formData.append("endDate",$scope.stock.endDate);
        $.ajax({
            url: Config.editStock,
            type: "post",
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        }).success(function (image) {
            alertify.notify("Акция успешно обновлена","success");
            $scope.stock.logo = image.data;
            $scope.$apply();
        }).error(function (data) {

        })
    };
    $scope.prepareStock = ()=> {
     $scope.stock.startDate = new Date($scope.stock.startDate);
     $scope.stock.endDate = new Date($scope.stock.endDate);
    };

    //$scope.onTabSelected = (tab)=> {
    //
    //    if (!enable_graphics)
    //    {
    //        var statist = Stats.getByType(statistics);
    //        var Graphic = Visualizer.getByType(statistics.type);
    //        new Graphic(statist).createCanvas(600,200,"Количество добавлений этой акции пользователями по дням").appendTo('charts');
    //
    //        var funnel_statist = Stats.getByType(funnel_stats);
    //        Graphic = Visualizer.getByType(funnel_stats.type);
    //        new Graphic(funnel_statist).createCanvas(600,200,"Воронка").appendTo('funnel');
    //
    //        enable_graphics = true;
    //    }
    //
    //
    //}

});

