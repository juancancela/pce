var uuid = require('node-uuid');
var CronJob = require('cron').CronJob;

new CronJob('*/15 * * * *', function() {
    accounts.forEach(function(account){
        account.token = null;
    })
}, null, true, 'America/Los_Angeles');

var accounts = [{"accountNumber": "12345", "password": "12345", balance: 0, "token": null}];
var transactions = [{"id":"1", "balance":50},{"id":"2", "balance":10},{"id":"3", "balance":100},{"id":"4", "balance":5000}]

function getAccountToken(accountNumber, password) {
    var token = null;
    accounts.forEach(function (account) {
        if (account.accountNumber == accountNumber && account.password == password) {
            if (!account.token) account.token = uuid.v4();
            token = account.token;
        }
    });
    return token;
}

function createAccount(accountNumber, password) {
    accounts.push({"accountNumber": accountNumber, "password": password, balance: 0, "token": uuid.v4()});
}

function getAccount(accountNumber){
    var account = null;
    accounts.forEach(function(acc){
        if(acc.accountNumber == accountNumber) account = acc;
    });
    return account;
}


function updateBalance(accountNumber, transactionId){
    transactions.forEach(function (transaction) {
        if(transaction.id == transactionId) {
            accounts.forEach(function(acc){
                if(acc.accountNumber == accountNumber) acc.balance += transaction.balance;
            });
        }
    })
}

function isValidToken(token){
    var isValidToken = false;
    accounts.forEach(function(account){
        if(account.token == token && account.token != undefined && account.token != null) isValidToken = true;
    });
    return isValidToken;
}

module.exports = {
    getAccountToken : getAccountToken,
    isValidAccount  : getAccountToken,
    createAccount   : createAccount,
    getAccount      : getAccount,
    isValidToken    : isValidToken,
    updateBalance   : updateBalance
};