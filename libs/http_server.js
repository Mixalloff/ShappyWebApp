'use strict';
var express = require('express'),
    Controller = require("../controllers");
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var body_parser = require('body-parser');
var HttpError = require('../error/http_error');
var ErrorHandler = require('errorhandler');
var cookieParser = require('cookie-parser');
var fasad = require('../middlewares/fasad');

var app = express();

class Server {

    constructor(port, host) {
        this.port =  port;
        this.host = host;
    }

    init() {
        app.locals.pretty = true;
        app.set('view engine', 'jade');
        app.use(require("../middlewares/sendHttpError"));
        app.use(cookieParser('secret'));
        app.use(body_parser.urlencoded({
            extended: true
        }));
        app.use(body_parser.json());

        app.use(sassMiddleware({
            src: path.join(__dirname, '../public/sass'),
            dest: path.join(__dirname, '../public/css'),
            indentedSyntax: true,
            outputStyle: 'compressed',
            prefix: '/css'
        }));
        app.use(express.static('public'));


        app.use('/verify', function(req,res,next) {
            fasad.checkToken(req.query.token, function(err) {
                if (err) return next(err);
                res.cookie('token', req.query.token, { maxAge: 900000 });
                res.render('verify');
            });
        });

        app.use('/auth',function(req,res,next) {
            fasad.auth(req.body, function(err,token) {
               if (err) return next(err);
                res.cookie('token',token.data, { maxAge: 900000 });
                res.end();
            });
        });

        app.use('/logout', function(req,res,next) {
            res.clearCookie('token');
            res.redirect('main');
        });

        app.use('/company', function(req,res,next) {
            fasad.checkToken(req.cookies.token, function(err,companyInfo) {
                if (err) return next(err);
                fasad.getStocks(req.cookies.token, function(err,stocks) {
                    if (err) return next(err);
                    console.log(stocks);
                    res.render('company',{
                        company: companyInfo,
                        stocks: stocks.data
                    });
                });
            });
        });

        app.use('/', function(req,res) {
            res.render('main');
        });



        app.use(function(err,req,res,next) {
            if (typeof err == "number")
            {
                err = new HttpError(err);
            }
            if (err instanceof HttpError)
            {
                res.sendHttpError(err);
            }
            else {
                if (app.get('env')=="development")
                {
                    ErrorHandler()(err, req, res, next);
                }
                else {
                    console.log(err);
                    err = new HttpError(500);
                    res.sendHttpError(err);
                }
            }
        });
    }

    run() {
        this.init();
        app.listen(this.port, () => {
            console.log("Сервер запущен");
        });
    }
}

module.exports = Server;