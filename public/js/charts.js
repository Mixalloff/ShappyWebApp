var stats = Stats.getByType(statistics);
var test_users = {
    type:'countperstock'
, data: {
    'Акция1':10,
    'Акция2':20,
    'Акция3':6,
    'Акция4': 13
}};
var pie_users = Stats.getByType(test_users);
var GraphicF = Visualizer.getByType(statistics.type);
var GraphicS = Visualizer.getByType(users.type);
new GraphicF(stats).createCanvas(600,200).appendTo('charts');
new GraphicS(pie_users).createCanvas(600,200).appendTo('charts');