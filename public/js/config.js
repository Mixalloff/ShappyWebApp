
var server = "http://ec2-54-200-218-253.us-west-2.compute.amazonaws.com:8080";
var localServer = "/html/";

var Config = {

  //для запросов
  createStock: server + "/company/stocks/create", //создание акции
  editStock: server + "/company/stocks/edit", //редактирование акции
  removeStock: server + "/company/stocks/remove", //удаление акции
  registerCompany: server + "/company/register", //регистрация компании
  authorizeCompany: "/auth", //авторизация компании

  //спиннер
  spinner: {
    start: function(el){
      window._spinner = new Spinner({color:'#000', lines: 12}).spin(document.getElementById(el));
    },
    stop: function(){
      window._spinner.stop();
    }
  },

  //числовые константы
  cookieExpiredDays: 100,
  menuItemOffset: 35,
  menuFadeIn: 500,

  //локальный сервер (после продакшена поменять)

  pageCompany: localServer + "company.html",
  pageMain: localServer + "main.html",
  pageVerify: localServer + "verify.html",


  //сообщения (уведомления)
  mesWrongRegister: "Не удалось зарегистрироваться",
  mesWrongAuthorize: "Не удалось авторизоваться",
  mesWrongGetStocks: "Не удалось получить акции компании",
  mesWrongGetCompanyInfo: "Не удалось полуить информацию о компании",
  mesWrongAddStock: "Не удалось добавить акцию",
  mesWrongEditStock: "Не удалось обновить акцию",
  mesWrongRemoveStock: "Не удалось удалить акцию",
  mesSuccessRemoveStock: "Акция успешно удалена",
  mesSuccessActivationEmail: "Пожалуйста, подведите регистрацию по email",


  //пункты меню
  menuCompanyItems: ["Домой", "Акции", "Статистика"]



};