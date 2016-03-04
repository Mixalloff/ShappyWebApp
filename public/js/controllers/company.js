'use strict';
var menu_items = Config.menuCompanyItems;

$(".menu li").hover(
    function () {
        var index = $(this).index("li");
        var top_offset = Config.menuItemOffset * (index + 1);
        $("<div class='hint' style='display:none top:" + top_offset + "px'>" + menu_items[index] + "</div>").
        insertAfter($(this)).fadeIn(Config.menuFadeIn);
    },
    function () {
        var hint = $(this).next().remove();
    }
);
angular.module('app').controller('Company', function($scope,$mdDialog, $mdMedia) {


    $scope.isOpen = false;
    $scope.selectedMode = 'md-scale';

    $scope.showDialog = (ev,id) => {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
            locals: {
                stocks : $scope.stocks
            },
            onComplete: ()=> {
                if (id) {
                    var current;
                    $scope.stocks.forEach((item)=> {
                        if (item.id==id) current = item;
                    });
                    $scope.obj = current;
                    $scope.update(id);
                }
            }
        });
    };
    $scope.showAddDialog = function(ev) {
        $scope.showDialog(ev,null);
    };

function DialogController($scope, $mdDialog, $http, stocks) {

    $scope.stocks = stocks;
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.submit  = function() {
        $scope.obj.category = $("form#stocks a.active").attr("id");
        $scope.obj.token = getCookie("token");
        var formData = convertToFormData($scope.obj);
         formData.append("logo",$scope.logo[0].lfFile);

        $http({
            method: 'POST',
            url: Config.createStock,
            data: formData,
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function successCallback(resultJSON) {
            resultJSON = resultJSON.data;
            if (resultJSON.type == 'stock') {
                var new_obj = new Object();
                Object.keys($scope.obj).forEach((item)=> {
                    new_obj[item] = $scope.obj[item];
                });
                new_obj['id'] = resultJSON.data.id;
                new_obj['logo'] = resultJSON.data.logo;
                $scope.stocks.unshift(new_obj);
                $scope.hide();
            }
        }, function errorCallback(response) {
            alertify.notify(Config.mesWrongAddStock, 'error');
        });
    };
}
    //обновление акции

    $scope.update = function(stock_id) {

        var stockForm = document.getElementsByClassName(stock_id)[0];
        var formEdit = document.getElementById("stocks");

        [].forEach.call(formEdit.childNodes,function(element){
            if (element.nodeType != Node.TEXT_NODE)
            {
                var name = element.getAttribute("name");
                var value = stockForm.getAttribute("data-" + name);
                if (value) {
                    if (element.name=="startDate" || element.name=="endDate")
                    {
                        var temp = value.split('-');
                        element.value = temp[1] + "/" + temp[2].substring(0,2) + "/" + temp[0].substring(1);
                    }
                    else
                    element.value = value;
                }
            }
        });

        formEdit.onsubmit = function(e)
        {
            e.preventDefault();
            var form = $(this);
            var formData = new FormData(form[0]);
            formData.append("token",getCookie("token"));
            formData.append("id",stock_id);
            $.ajax({
                type: 'POST',
                url: Config.editStock,
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            }).success(function(dataParsed) {
                $scope.stocks.forEach(function(item) {

                    if (item.id == stock_id)
                    {
                        form.serializeArray().forEach(function(form_item) {
                                item[form_item.name] = form_item.value;
                        });
                        var elem = document.getElementsByClassName(item.id)[0];
                        elem.style.background = "url(" +server + dataParsed.data + ")";
                        $scope.$apply();
                    }
                });
            }).error(function(data) {
                alertify.notify(Config.mesWrongEditStock, 'error');
            })
        };
        };

    //удаление акции

    $scope.remove = function(ev,stock_id) {
            var confirm = $mdDialog.confirm()
                .title('Вы действительно хотите удалить акцию?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Да')
                .cancel('Нет');
            $mdDialog.show(confirm).then(function() {
                $.ajax({
                    type: "post",
                    url: Config.removeStock,
                    data: {token: getCookie("token"), id: stock_id}
                }).success(function (data) {
                    $scope.stocks.forEach(function(item,index) {
                        if (item['id']==stock_id)
                        {
                            $scope.stocks.splice(index,1);
                        }
                    });
                    $scope.$apply();
                    alertify.notify(Config.mesSuccessRemoveStock, 'success');
                }).error(function (data) {
                    alertify.notify(Config.mesWrongRemoveStock, 'error');
                });
            }, function() {
            });
        };
    $scope.go = function ( path,param ) {
        window.location.href=path + param;
    };
    //сортировка акции по дате
    $scope.sortField = 'startDate';
    $scope.reverse  = true;

    $scope.sort = function(name)
    {
        $scope.reverse = !$scope.reverse;
    };
    $scope.isDown = function(name) {
        return $scope.sortField == name && $scope.reverse;
    };
    $scope.isUp = function(name) {
        return $scope.sortField == name && !$scope.reverse;
    };
    $scope.prepareStocks= () => {
        $scope.stocks.forEach((stock)=> {
            stock.startDate = new Date(stock.startDate);
            stock.endDate = new Date(stock.endDate);
        })
    }


});
