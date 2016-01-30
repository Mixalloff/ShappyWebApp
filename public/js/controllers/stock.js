'use strict';

var app = angular.module('app',[]);

$(".fancybox").fancybox();
app.controller('Stock', function($scope,$http) {

    $scope.editStock = function() {

        var form = $("#edit_stock");
        var formData = new FormData(form[0]);
        formData.append("token",getCookie("token"));
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
    }
});

