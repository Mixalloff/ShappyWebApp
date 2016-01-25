var ctx = $("#myChart").get(0).getContext("2d");

var daysPerMonth = [31,29,31,30,31,30,31,31,30,31,30,31];
var days = [];
var data = [];
for(var i = 1; i <= daysPerMonth[new Date().getMonth()]; i++) {
    days.push(i);
    data.push(0);
}
for(var item in statistics) {
    data[new Date(item).getDate()-1] = statistics[item];
}
var riceData = {
    labels: days,
    datasets: [
        {
            fillColor: "rgba(172,194,132,0.4)",
            strokeColor: "#ACC26D",
            pointColor: "#fff",
            pointStrokeColor: "#9DB86D",
            data: data
        }
    ]
};


var rice = document.getElementById('myChart2').getContext('2d');
new Chart(rice).Line(riceData);
