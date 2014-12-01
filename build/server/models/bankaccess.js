// Generated by CoffeeScript 1.8.0
var BankAccess, BankAccount, americano, async, weboob;

americano = require('americano');

async = require('async');

BankAccount = require('./bankaccount');

weboob = require('../lib/weboob-manager');

module.exports = BankAccess = americano.getModel('bankaccess', {
  bank: String,
  login: String,
  password: String
});

BankAccess.all = function(callback) {
  return BankAccess.request("all", callback);
};

BankAccess.allFromBank = function(bank, callback) {
  var params;
  params = {
    key: bank.uuid
  };
  return BankAccess.request("allByBank", params, callback);
};

BankAccess.allLike = function(access, callback) {
  var params;
  params = {
    key: [access.bank, access.login, access.password]
  };
  return BankAccess.request("allLike", params, callback);
};

BankAccess.addNewAccess = function(access, callback) {
  return BankAccess.allLike(access, function(err, accesses) {
    var msg;
    if ((err != null) || (accesses == null)) {
      msg = "Coudldn't retrieved accesses -- " + err;
      console.log(msg);
      return callback(msg);
    } else {
      if (accesses.length !== 0) {
        return callback({
          alreadyExist: true
        });
      } else {
        return BankAccess.create(access, function(err, access) {
          if (err != null) {
            return callback(err);
          } else {
            return access.retrieveAccounts(function(err) {
              if (err != null) {
                access.destroy();
              }
              return callback(err, access);
            });
          }
        });
      }
    }
  });
};

BankAccess.removeIfNoAccountBound = function(access, callback) {
  return BankAccount.allFromBankAccess(access, (function(_this) {
    return function(err, accounts) {
      var msg;
      if ((err != null) || (accounts == null)) {
        msg = "Couldn't retrieve accounts by bank -- " + err;
        return callback(msg);
      } else {
        if (accounts.length === 0) {
          return BankAccess.find(access.id, function(err, access) {
            if ((err == null) && (access != null)) {
              access.destroy();
              console.log("\t\t-> Access destroyed");
              return callback();
            } else {
              return callback(err);
            }
          });
        } else {
          return callback();
        }
      }
    };
  })(this));
};

BankAccess.prototype.destroyAccounts = function(callback) {
  console.log("Removing access " + this.id + " for bank " + this.bank + " from database...");
  return BankAccount.allFromBankAccess(this, (function(_this) {
    return function(err, accounts) {
      var process;
      process = function(account, callback) {
        return account.destroyWithOperations(callback);
      };
      return async.eachSeries(accounts, process, callback);
    };
  })(this));
};

BankAccess.prototype.retrieveAccounts = function(callback) {
  return weboob.retrieveAccountsByBankAccess(this, (function(_this) {
    return function(err) {
      if (err != null) {
        return callback(err);
      } else {
        return _this.retrieveOperations(callback);
      }
    };
  })(this));
};

BankAccess.prototype.retrieveOperations = function(callback) {
  return weboob.retrieveOperationsByBankAccess(this, callback);
};

BankAccess.retrieveOperationsForAllAccesses = function(callback) {
  return BankAccess.all(function(err, accesses) {
    var process;
    if (err == null) {
      process = function(access, callback) {
        return access.retrieveOperations(callback);
      };
      return async.eachSeries(accesses, process, callback);
    } else {
      return callback();
    }
  });
};

BankAccess.prototype.getAuth = function() {
  return {
    login: this.login,
    password: this.password
  };
};