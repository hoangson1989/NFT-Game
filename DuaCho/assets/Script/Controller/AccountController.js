(function() {
    var AccountController;

    AccountController = (function() {
        var instance;

        function AccountController() {

        }

        instance = void 0;

        AccountController.getInstance = function() {
            if (instance === void 0) {
                instance = this;
                //
                instance.prototype._address = null;
                instance.prototype._accessToken = null;
                instance.prototype._ballance = null;

            }
            return instance.prototype;
        };


        AccountController.prototype.getMetamaskAddress = function() {
            return this._address;
        };

        AccountController.prototype.setMetamaskAddress = function(address) {
            this._address = address;
        };

        AccountController.prototype.getAccessToken = function() {
            return this._accessToken;
        };

        AccountController.prototype.setAccessToken = function(token) {
            this._accessToken = token;
        };

        AccountController.prototype.getBallance = function() {
            return this._ballance;
        };

        AccountController.prototype.setBallance = function(value) {
            this._ballance = value;
        };

        return AccountController;

    })();

    cc.AccountController = AccountController;

}).call(this);