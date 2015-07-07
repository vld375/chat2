var crypto = require('crypto');
var mongoose = require('libs/mongoose'),

    Schema = mongoose.Schema;
var schema = new Schema({
    username: {
        type: String,
        unique: true,     // указывает что поле должно быть уникально в БД (проверку делае сама БД)создается индекс
        required: true    // указывает на обязательность поля в БД
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')  // virtual - поле в БД сохраняться не будет
    .set(function (password) {        //вызывается user.set('password','.....')
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

exports.User = mongoose.model('User', schema);
