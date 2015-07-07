var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module); // добавляем наш модуль-обертку для log-а

var app = express();
//app.set('port', config.get('port'));  не надо т.к. порт берем из конфига при createServer

//app.engine говорит, что файлы с расширением ejs надо обрабатывать шаблонным движком ejs-locals, а не стандартным ejs
app.engine('ejs', require('ejs-locals'));       // движок для шаблонов c layout partial block
// app.set('views', __dirname + '/templates');     // Настройки для системы шаблонизации
app.set('view engine', 'ejs');                  // движок для шаблонов (может быть любой другой)

app.use(express.favicon());                     // если url имеет вид // то выдает иконку /favicon.ico

if (app.get('env') == 'development') {
  app.use(express.logger('dev'));// выводит запись какой пришел запрос (dev - формат логгирования)
} else {
  app.use(express.logger('default'));
}
app.use(express.bodyParser()); // Считывет присланные данные POST в том числе json формы разбирая тело запроса в req.body......

//app.use(express.methodOverride());  не нужен

app.use(express.cookieParser('your secret here')); //парсит куки  req.headers в req.cookies.  МОЖНО ПОДПИСЫВАТЬ КУКИ

//app.use(express.session()); Пока не надо

app.use(app.router);  // Говорит какие запросы как будут обработаны

app.get('/', function(req,res, next) {
  res.render("index");
});

//Подключаем нашу модель
var User = require('models/user').User;

app.get('/users', function(req,res, next) {
  User.find({}, function(err, users) {
    if (err) return next(err);
    res.json(users);
  })
});


app.get('/users/:id', function(req,res, next) { //Вместо :id express будет вставлять req.params.id
  User.findById(req.params.id,function(err, user) {
    if (err) return next(err);
    res.json(user);

  })
});
app.use(express.static(path.join(__dirname, 'public'))); // выдача статика
// Middleware


app.use(function(err, req, res, next) { // четыре аргумента указывают что это обработчик ошибок
                                        //NODE_ENV  = 'production' или 'development'- данная переменная определяет режим работы: продакшен или разработка
  if (app.get('env') == 'development') {
    var errorHandler = express.errorHandler();  // Стандартный обработчик ошибок Express
    errorHandler(err, req, res, next);
  } else {
    app.send(500); // если production то просто посылаем код 500
  }
});


http.createServer(app).listen(config.get('port'), function(){
  //console.log('Express server listening on port ' + config.get('port'));
  log.info('Express server listening on port ' + config.get('port'));
});


// Middleware  (добавляем обработчик к app=express)
// На все запросы - отвечае одинаково Hello-1
/*
// На все запросы - отвечае одинаково Hello-1
app.use(function(req, res) {
  res.end("Hello-1");
});

// Использование параметра next позволяет объеденять в цепочки несколько Middleware
app.use(function(req, res, next) {
  if (req.url == '/') {
    res.end("Hello! Это главная страница");
  } else {
    next(); // передать к следующей app.use
  }
});
app.use(function(req, res, next) {
  if (req.url == '/test') {
    res.end("Hello! Это страница test");
  } else {
    next(); // передать к следующей app.use
  }
});
// Middleware c примером для передачи для обработки ошибок
app.use(function(req, res, next) {
  if (req.url == '/forbidden') {
    next(new Error("Режим разработки, отказ в доступе"));
  } else {
    next(); // передать к следующей app.use
  }
});
// Завершающий цепочку Midelware
app.use(function(req, res) {
  res.send(404, "Страница не найдена"); // Вместо end используем send
});
// Middleware как  обработчик ошибок
app.use(function(err, req, res, next) { // четыре аргумента указывают что это обработчик ошибок
  //NODE_ENV  = 'production' или 'development'- данная переменная определяет режим работы: продакшен или разработка
  if (app.get('env') == 'development') {
    var errorHandler = express.errorHandler();  // Стандартный обработчик ошибок Express
    errorHandler(err, req, res, next);
  } else {
    app.send(500); // если production то просто посылаем код 500
  }
});
*/

/*
var routes = require('./routes');
var user = require('./routes/user');




// all environments



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

*/
