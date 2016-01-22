var uuid = require('node-uuid');
var CronJob = require('cron').CronJob;
var now = new Date();

new CronJob('*/15 * * * *', function() {
    accounts.forEach(function(account){
        account.token = null;
    })
}, null, true, 'America/Los_Angeles');

var accounts = [{"accountNumber": "12345", "password": "12345", balance: 0, "token": null}];

var transactions = [{"id":"1", "accountNumber":"12345", "balance":50, "phone": "1235235232", "date": now},{"id":"2", "accountNumber":"12345", "balance":10, "phone": "453534535", "date": now},{"id":"3", "accountNumber":"12345", "balance":100, "phone": "4354353453", "date": now},{"id":"4", "accountNumber":"12345", "balance":5000, "phone": "35345345", "date": now}];

var profiles = [{
    "accountNumber":"12345",
    "name": "Juan",
    "lastname": "Cance",
    "dni": "3423423423",
    "email": "cancela@sdkfd.com",
    "password": "fsdkjfdksf",
    "type": "comercio o persona",
    "commerce_name": "Pizzeria los HDP",
    "commerce_address": "San Aere 34234",
    "phone": "1554543424"
}];


function getProfile(accountNumber){
    var profile = null;
    profiles.forEach(function(prof){
        if(prof.accountNumber == accountNumber) profile = prof;
    });
    return profile;
}

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

function getTransactionsByAccount(accountNumber){
    var accountTransactions = [];
    transactions.forEach(function(transaction){
        if(transaction.accountNumber == accountNumber) accountTransactions.push(transaction);
    });

    return accountTransactions;
}

function updateProfile(accountNumber, updatedProfile){
    profiles.forEach(function(profile){
        if(profile.accountNumber == accountNumber) profile = updatedProfile;
    })
}

function createTransaction(serviceId, subserviceId, accountNumber, valueHash){
    var transaction = {};
    var now = new Date();
    var profile = getProfile(accountNumber);
    var phone = null;
    if(profile) phone = profile.phone;
    valueHash.forEach(function(entry){
        transaction[entry.key] = entry.value;
    });
    transaction.date = now;
    transaction.phone = phone;
    transaction.id = transactions.length + 1;
    transaction.accountNumber = accountNumber;

    if (!transaction.balance) transaction.balance = 0;

    transactions.push(transaction);
}

function getServices() {
    return {
        "services": [{
            "id": "1",
            "name": "phone_load",
            "subservices": [{
                "id": "11",
                "name": "Claro",
                "fields": [{
                    "name": "phone_number",
                    "type": "Number",
                    "validation": ""
                }, {
                    "name": "balance",
                    "type": "Number",
                    "validation": ""
                }]
            }, {
                "id": "12",
                "name": "Personal",
                "fields": [{
                    "name": "phone_number",
                    "type": "Number",
                    "validation": ""
                }, {
                    "name": "balance",
                    "type": "Number",
                    "validation": ""
                }]
            }, {
                "id": "13",
                "name": "Movistar",
                "fields": [{
                    "name": "phone_number",
                    "type": "Number",
                    "validation": ""
                }, {
                    "name": "balance",
                    "type": "Number",
                    "validation": ""
                }]
            }]
        }, {
            "id": "2",
            "name": "pce",
            "subservices": [{
                "id": "21",
                "name": "balance_load",
                "fields": [{
                    "name": "pce_account_number",
                    "type": "Number",
                    "validation": ""
                }, {
                    "name": "balance",
                    "type": "Number",
                    "validation": ""
                }]
            }, {
                "id": "22",
                "name": "transference",
                "fields": [{
                    "name": "origin_pce_account_number",
                    "type": "Number",
                    "validation": ""
                }, {
                    "name": "destiny_pce_account_number",
                    "type": "Number",
                    "validation": ""
                }, {
                    "name": "balance",
                    "type": "Number",
                    "validation": ""
                }]
            }]
        }]
    }
}


module.exports = {
    getAccountToken : getAccountToken,
    isValidAccount  : getAccountToken,
    createAccount   : createAccount,
    getAccount      : getAccount,
    isValidToken    : isValidToken,
    updateBalance   : updateBalance,
    getTransactionsByAccount : getTransactionsByAccount,
    getProfile      : getProfile,
    updateProfile   : updateProfile,
    getServices     : getServices,
    createTransaction : createTransaction
};