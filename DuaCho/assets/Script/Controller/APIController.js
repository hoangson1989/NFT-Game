(function() {
    var APIController;

    APIController = (function() {
        var instance;

        function APIController() {

        }

        instance = void 0;

        APIController.getInstance = function() {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };


        APIController.prototype.login = function(params, controller) {
            var url = 'user/login';

            return cc.ServerConnector.getInstance().sendRequestPOST(url, params, function(response) {
                var obj = JSON.parse(response);

                if (obj.status_code != undefined && obj.status_code != 200) {
                    return controller.onLoginFail(obj);
                } else {
                    return controller.onLoginSuccess(obj);
                }

            });
        };

        APIController.prototype.openSilverBox = function(params, controller) {
            var url = 'open_silver_box';

            return cc.ServerConnector.getInstance().sendRequestPOST(url, params, function(response) {
                var obj = JSON.parse(response);

                if (obj.status_code != undefined && obj.status_code != 200) {
                    return controller.onOpenSilverBoxFail(obj);
                } else {
                    return controller.onOpenSilverBoxSuccess(obj);
                }

            });
        };

        APIController.prototype.getConfig = function(params, controller) {
            var url = 'get_config';

            return cc.ServerConnector.getInstance().sendRequest(url, params, function(response) {
                var obj = JSON.parse(response);

                if (obj.status_code != undefined && obj.status_code != 200) {
                    return controller.onGetConfigFail(obj);
                } else {
                    return controller.onGetConfigSuccess(obj);
                }

            });
        };

        APIController.prototype.deposit = function(params, controller) {
            var url = 'user/deposit';

            return cc.ServerConnector.getInstance().sendRequestPOST(url, params, function(response) {
                var obj = JSON.parse(response);

                if (obj.status_code != undefined && obj.status_code != 200) {
                    return controller.onDepositFail(obj);
                } else {
                    return controller.onDepositSuccess(obj);
                }

            });
        };

        return APIController;

    })();

    cc.APIController = APIController;

}).call(this);