'use strict';

angular.module('app').controller('Stats', function($scope,$http) {
    $scope.isOpen = true;
    $scope.selectedMode = 'md-fling';

    $scope.numbers = [31,29,31,30,31,30,31,31,30,31,30,31];
    $scope.showDetail = (ev)=> {
        var attrs = ev.currentTarget.parentNode.attributes;
        window.location.href=`/stats/details?${attrs[1].name}=${attrs[1].value}&${attrs[2].name}=${attrs[2].value}&${attrs[3].name}=${attrs[3].value}`;
    };

    $scope.getMonth= () => {
        var month = new Date().getMonth() ;
        var daysPerMonth = $scope.numbers[month];
        var year = new Date().getFullYear();
        $scope.start = new Date(year,month,1);
        $scope.end = new Date(year,month,daysPerMonth);

    };
    $scope.addDays = (days) => {
        return new Date(new Date().setDate(new Date().getDate() + days));
    };

    $scope.getToday = () => {
        $scope.start = new Date();
        $scope.end =  $scope.addDays(1);
    };

    $scope.getYesterday= ()=> {
        $scope.start = $scope.addDays(-1);
        $scope.end = new Date();
    };

    $scope.getWeek= ()=> {
        var current_day = new Date().getDay();
        var plus = (current_day==0) ? 0 :  7 - current_day;
        var minus = (current_day==0) ? 7 :  current_day;
        $scope.start =  $scope.addDays(1-minus);
        $scope.end =  $scope.addDays(plus);
    };

    $scope.toggleClass = (active)=> {
        $(".choose").removeClass("md-raised");
        $(active).addClass("md-raised");
    };

    $scope.periods = {
        'month': $scope.getMonth,
        'week': $scope.getWeek,
        'today': $scope.getToday,
        'yesterday': $scope.getYesterday
    };
    $scope.getStats = (type,ev,route)=> {
        $scope.toggleClass(ev.currentTarget);
        $scope.periods[type]();
        $scope.update(route);
    };


    $scope.filterDateArray = (dates, start, end) => {
        var filter = dates.filter((date)=> {
            date = new Date(date);
            return date >= new Date(start) && date <= new Date(end);
        });
        return filter;
    };
    $scope.filter = (data) => {
        function deepCopy(oldObj) {
            var newObj = oldObj;
            if (oldObj && typeof oldObj === 'object') {
                newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
                for (var i in oldObj) {
                    newObj[i] = deepCopy(oldObj[i]);
                }
            }
            return newObj;
        }
        var filtered =  deepCopy(data);
        Object.keys(filtered).forEach((stock)=> {
            filtered[stock] = $scope.filterDateArray(filtered[stock], $scope.start, $scope.end);
        });
        return filtered;
    };

    $scope.uploadStats = (route,extra_data) => {
        var extra_arguments = "";
        extra_data.forEach((data)=> {
            var key = Object.keys(data)[0];
            extra_arguments+=`&${key}=${data[key]}`;
        });
        $scope.stats = {};
        $http({
            method: 'GET',
            url: server + route + "?token=" + getCookie('token') + extra_arguments
        }).then(response=> {
            var route_part = route.split('/').pop();
            $scope.getMonth();
            $scope.stats[route_part]={};
            $scope.stats[route_part].source = response.data.data;
            $scope.update(route_part);
        });
    };

    $scope.update = (route) => {
        var filtered = $scope.filter($scope.stats[route].source);
        $scope.stats[route].filtered = filtered;
    };

    $scope.changeDate = (route) => {
        $scope.update(route);
    };

    $scope.init = (routes,...fields) => {
        $scope.routes = routes;
        $scope.routes.forEach((route) => {
            $scope.uploadStats("/company/stats/" + route,fields);
        });
    };


    $scope.addLegenda = (parent,val) => {
        var legenda = document.createElement('div');
        parent.appendChild(legenda);
        legend(legenda, val);
    };

    $scope.addHeader = (parent,val) => {
        var header = document.createElement('h4');
        header.innerHTML = val;
        parent.appendChild(header);
    }

});


