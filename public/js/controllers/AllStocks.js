'use strict';

angular.module('stockApp').controller('AllStocks', function($scope,$http) {

    $scope.prepareStocks= () => {
        $scope.stocks.forEach((stock)=> {
            $http({
                method: 'GET',
                url: server + '/company/stats/stockinfo' + "?token=" + getCookie('token') + "&id=" + stock.id
            }).then(response=> {
              stock.stats = response.data.data;
            });
            stock.startDate = new Date(stock.startDate);
            stock.endDate = new Date(stock.endDate);
        });
    };

    $scope.bricks = ['../../img/emailerror.jpg','../../img/logo.png','../../img/googleplay.png'];
});

