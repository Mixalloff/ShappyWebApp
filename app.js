var conf = require('./config/config');
var Server = require('./libs/http_server');
var port = process.env.PORT || conf.get("port");
var server = new Server(port, conf.get("host"));

server.run();