'use strict';

angular.module('stockApp').controller('AllStocks', function($scope,$http,$mdDialog) {

    $scope.prepareStocks= () => {
        $scope.stocks.forEach((stock)=> {
            $http({
                method: 'GET',
                url: server + '/company/stats/stockinfo' + "?token=" + getCookie('token') + "&id=" + stock.id
            }).then(response=> {
              stock.stats = response.data.data;
            });
            stock.startDate = new Date(stock.startDate).getTime();
            stock.endDate = new Date(stock.endDate).getTime();
        });
    };

    $scope.changeStart = () => {
        $scope.search.startDate = $scope.search.startDate.getTime();
    };

    $scope.changeEnd = () => {
        $scope.search.endDate = $scope.search.endDate.getTime();
    };

    $scope.getFullDescription = (description) => {
        var confirm = $mdDialog.confirm()
            .title('Описание акции')
            .textContent(description)
            .ariaLabel('Description')
            .ok('ЗАКРЫТЬ');
        $mdDialog.show(confirm);
    }
});

