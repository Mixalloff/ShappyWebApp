'use strict';

class Stats {

    static get routes() {
    return {
        'stocksperdate': StocksPerDate,
        'usersperstock': StocksPerDate,
        'countperstock': UsersPerStock
    }
    };

    static getByType(stats) {
      return new Stats.routes[stats.type](stats.data);
    }

}

class AbstractStats {

    static get daysPerMonth() {
        return [31,29,31,30,31,30,31,31,30,31,30,31];
    };

    constructor(data) {
        this.data = data;
        this.DataX = [];
        this.DataY = [];
        this.init(data);
    }
    getX() {
        return this.DataX;
    }

    getY() {
        return this.DataY
    }

}

class StocksPerDate extends  AbstractStats{

    init(data) {
        for(var i = 1; i <= AbstractStats.daysPerMonth[new Date().getMonth()]; i++) {
            this.DataX.push(i);
            this.DataY.push(0);
        }
        for(var item in data) {
            this.DataY[new Date(item).getDate()-1] = data[item];
        }
    }
}

class CountPerStock extends  AbstractStats{

    init(data) {
        for(var i = 1; i <= AbstractStats.daysPerMonth[new Date().getMonth()]; i++) {
            this.DataX.push(i);
            this.DataY.push(0);
        }
        for(var item in data) {
            this.DataY[new Date(item).getDate()-1] = data[item];
        }
    }
}
class UsersPerStock extends  AbstractStats{

    init(data) {
       this.data = data;
    }
}











