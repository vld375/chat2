var winston = require('winston');
var ENV=process.env.NODE_ENV; //Получаем окружение (раньше исп. app.get('env') не забыть добавить NODE_ENV в настройка

function getLogger(modele) {
   var path = module.filename.split('/').slice(-2).join('/'); // имя файла и последние два элемента пути

   return  new winston.Logger ({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: ENV == 'development' ? 'debug' : 'error',
                label: path   // Показать из какого файла информация по log
            })
        ]
    });
}

module.exports = getLogger;






 /*
winston.log('info', 'Hello distributed log files!');
winston.info('Hello again distributed logs');

winston.level = 'debug';
winston.log('debug', 'Now my debug messages are written to console!');

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'somefile.log' })
    ]
});

var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'filelog-info.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'filelog-error.log',
            level: 'error'
        })
    ]
});
     */
