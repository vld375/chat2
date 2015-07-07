mongoose = require('libs/mongoose');
var async = require('async');

// Определяем перечень функций
async.series([    // Получаем массив функций
  open,
  dropDatabase,   // удаляет существующу базу
  requireModels,
  createUsers
  ], function(err) {
  console.log(arguments);
  mongoose.disconnect();
  //process.exit(err ? 255 : 0);
});

// Открывает соединение к БД
function open(callback) {
  mongoose.connection.on('open', callback);
}

// Убивает БД
function dropDatabase(callback) {
  var db = mongoose.connection.db;
  db.dropDatabase(callback);
}

// Создали отдельную функцию по подключению модели и создании индексов для уникальных полей
function requireModels(callback) {
  require('models/user');

  async.each(Object.keys(mongoose.models), function(modelName, callback) {
  // вызов ensureIndexes для каждой модели которая создает
  // требуемые индексы и после их создания делает callback
   mongoose.models[modelName].ensureIndexes(callback);
  }, callback);
}

// Создаем массив наших пользователей
function createUsers(callback) {
  require('models/user');

  var users = [
    {username: 'Вася', password: 'supervasya'},
    {username: 'Петя', password: '123'},
    {username: 'admin', password: 'thetruehero'}
  ];

  async.each(users, function(userData, callback) {
    // массив элементов,
    // функция приминимая к каждому элементу массива (
    var user = new mongoose.models.User(userData); // создает соответствующего пользователя
    user.save(callback); // и сохраняет его в БД
  },callback);
}


function close(callback) {
}