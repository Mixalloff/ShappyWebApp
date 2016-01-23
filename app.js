var conf = require('./config/config');
var Server = require('./libs/http_server');
var server = new Server(conf.get("port"),conf.get("host"));

server.run();