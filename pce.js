var koa = require('koa');
var route = require('koa-route');
var app = koa();
var bodyParser = require('koa-bodyparser');
var utils = require('./utils');



app.use(bodyParser());

// check token is provided as a custom header. Skip if its login or sign up
app.use(function *(next) {
    if (this.originalUrl == "/login" || this.originalUrl == "/sign_up") {
        yield next;
    } else {
        var token = this.header.token;
        if (!utils.isValidToken(token)) {
            this.status = 403;
            this.body = {
                "msg": "token is not valid / provided"
            }
        } else {
            yield next;
        }
    }
});


app.use(route.get('/', index));
app.use(route.post('/login', login));
app.use(route.post('/sign_up', signUp));
app.use(route.post('/get_balance', getBalance));
app.use(route.post('/upd_balance', updBalance));
app.use(route.post('/get_bank_details', getBankDetails));


function *index() {
    this.body = {
        "description": "PCE test services",
        "_links": {
            "self": this.request.href,
            "login": `${this.request.origin}/login`,
            "sign_up": `${this.request.origin}/sign_up`,
            "get_balance": `${this.request.origin}/get_balance`,
            "upd_balance": `${this.request.origin}/upd_balance`,
            "get_bank_details": `${this.request.origin}/get_bank_details`
        }
    };
}

function *login() {
    var accountNumber = this.request.body.accountNumber;
    var password = this.request.body.password;
    if (utils.isValidAccount(accountNumber, password)) {
        var token = utils.getAccountToken(accountNumber, password);
        this.set('token', token);
        this.status = 200;
    } else {
        this.status = 403;
    }
}

function *signUp() {
    var accountNumber = this.request.body.accountNumber;
    var password = this.request.body.password;
    utils.createAccount(accountNumber, password);
    var token = utils.getAccountToken(accountNumber, password);
    this.set('token', token);
    this.status = 200;
}

function *getBalance() {
    var accountNumber = this.request.body.accountNumber;
    if(accountNumber){
        var account = utils.getAccount(accountNumber);
        this.body = {
            "msg": account.balance
        }
    } else {
        this.status = 422;
    }

}

function *updBalance() {
    var accountNumber = this.request.body.accountNumber;
    var transactionId = this.request.body.transactionId;
    if(accountNumber && transactionId){
        utils.updateBalance(accountNumber, transactionId);
        this.status = 200;
    } else {
        this.status = 422;
    }
}

function *getBankDetails() {
    this.body = {
        "cta_nro": "1233532523499854932",
        "cbu":"42345gdfgf4323Gfgdfgdfgd"
    }
}

app.listen(7750);
