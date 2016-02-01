var koa = require('koa');
var route = require('koa-route');
var app = koa();
var bodyParser = require('koa-bodyparser');
var utils = require('./utils');


app.use(bodyParser());

// check token is provided as a custom header. Skip if its login or sign up, or token=false param is provided
app.use(function *(next) {
    var _skipTokenRequest = function(request){
        return request.originalUrl.indexOf("token=false") > -1;
    }
    
    if(_skipTokenRequest(this.request)){
        yield next;
    } else {
     if (this.originalUrl == "/login" || this.originalUrl == "/sign_up" || this.originalUrl == "/") {
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
    }
});


app.use(route.get('/', index));
app.use(route.post('/login', login));
app.use(route.post('/sign_up', signUp));
app.use(route.post('/sign_out', signOut));
app.use(route.post('/get_balance', getBalance));
app.use(route.post('/upd_balance', updBalance));
app.use(route.post('/get_bank_details', getBankDetails));
app.use(route.post('/get_services', getServices));
app.use(route.post('/create_transaction', createTransaction));
app.use(route.post('/get_transactions', getTransactions));
app.use(route.post('/get_profile', getProfile));
app.use(route.post('/upd_profile', updProfile));




function *index() {
    this.body = {
        "description": "PCE test services",
        "_links": {
            "self": this.request.href,
            "login": `${this.request.origin}/login`,
            "sign_up": `${this.request.origin}/sign_up`,
            "get_balance": `${this.request.origin}/get_balance`,
            "upd_balance": `${this.request.origin}/upd_balance`,
            "get_bank_details": `${this.request.origin}/get_bank_details`,
            "get_services": `${this.request.origin}/get_services`,
            "create_transaction": `${this.request.origin}/create_transaction`,
            "get_transactions": `${this.request.origin}/get_transactions`,
            "get_profile": `${this.request.origin}/get_profile`,
            "upd_profile": `${this.request.origin}/upd_profile`
        }
    };
}


function *signOut() {
    var accountNumber = this.request.body.accountNumber;
    utils.deleteAccountToken(accountNumber);
    this.body = {
        "msg":"OK"
    };
    this.status = 200;
}

function *login() {
    var accountNumber = this.request.body.accountNumber;
    var password = this.request.body.password;
    if (utils.isValidAccount(accountNumber, password)) {
        var token = utils.getAccountToken(accountNumber, password);
        this.set('token', token);
        this.body = {
            "msg":"OK"
        };
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
    this.body = {
        "msg":"OK"
    };
    this.status = 200;
}

function *getBalance() {
    var accountNumber = this.request.body.accountNumber;
    if (accountNumber) {
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
    if (accountNumber && transactionId) {
        utils.updateBalance(accountNumber, transactionId);
        this.body = {
            "msg":"OK"
        };
        this.status = 200;
    } else {
        this.status = 422;
    }
}

function *getBankDetails() {
    this.body = {
        "cta_nro": "1233532523499854932",
        "cbu": "42345gdfgf4323Gfgdfgdfgd"
    }
}

function *createTransaction() {
    var serviceId = this.request.body.serviceId;
    var subserviceId = this.request.body.subserviceId;
    var accountNumber = this.request.body.accountNumber;
    var subserviceValues = this.request.body.subserviceValues;

    if (accountNumber && subserviceValues) {
        utils.createTransaction(serviceId, subserviceId, accountNumber, subserviceValues);
        this.body = {
            "msg":"OK"
        };
        this.status = 200;
    } else {
        this.status = 422;
    }

}

function *getTransactions() {
    var accountNumber = this.request.body.accountNumber;
    if (accountNumber) {
        this.body = utils.getTransactionsByAccount(accountNumber);
    } else {
        this.status = 422;
    }

}

function *getProfile() {
    var accountNumber = this.request.body.accountNumber;
    if (accountNumber) {
        var profile = utils.getProfile(accountNumber);
        if(profile) {
            this.body = profile;
        } else {
            this.status = 404;
        }
    } else {
        this.status = 422;
    }
}

function *updProfile() {
    var accountNumber = this.request.body.accountNumber;
    var updProfile = this.request.body;
    if (updProfile && accountNumber) {
        utils.updateProfile(accountNumber, updProfile);
        this.body = {
          "msg":"OK"
        };
        this.status = 200;
    } else {
        this.status = 422;
    }
}

function *getServices() {
    this.body = utils.getServices();
}

app.listen(7750);
