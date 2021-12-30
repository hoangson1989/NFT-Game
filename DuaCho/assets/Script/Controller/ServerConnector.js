var netConfig = require('NetConfig');

(function() {
    var ServerConnector;

    const Debug = false;

    ServerConnector = (function() {
        var instance;

        function ServerConnector() {}

        instance = void 0;

        ServerConnector.getInstance = function() {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        //GET
        ServerConnector.prototype.sendRequest = function(url, params, callback) {
            var e, request;
            try {
                var host = netConfig.API_HOST;

                request = cc.loader.getXMLHttpRequest();
                var urlRequest = 'https://' + host + '/' + url;

                if (Debug) {
                    console.log('sendRequest');
                    console.log(urlRequest);
                }

                request.timeout = 60000;
                request.open('GET', urlRequest); //+ '?' + Math.random()
                request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

                //set token
                if (cc.AccountController.getInstance().getAccessToken()) {
                    const token = cc.AccountController.getInstance().getAccessToken();
                    request.setRequestHeader('Authorization', 'Bearer ' + token);
                }

                request.onreadystatechange = function() {
                    //&& request.status === 200
                    if (request.readyState === 4) {
                        if (Debug) {
                            console.log('sendRequest responseText: ');
                            console.log(request.responseText);
                        }

                        return callback(request.responseText);
                    }
                };
                if (params != null) {
                    return request.send(params);
                } else {
                    return request.send();
                }
            } catch (error) {
                e = error;
                return console.log('Caught Exception: ' + e.message);
            }
        };

        //POST
        ServerConnector.prototype.sendRequestPOST = function(url, params, callback) {
            var e, request;
            try {
                var host = netConfig.API_HOST;

                request = cc.loader.getXMLHttpRequest();
                var urlRequest = 'https://' + host + '/' + url;

                if (Debug) {
                    console.log('sendRequestPOST');
                    console.log(urlRequest);
                    console.log('sendRequestPOST params: ');
                    console.log(params);
                }

                request.timeout = 60000;
                request.open('POST', urlRequest);
                request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

                //set token
                if (cc.AccountController.getInstance().getAccessToken()) {
                    const token = cc.AccountController.getInstance().getAccessToken();
                    request.setRequestHeader('Authorization', 'Bearer ' + token);
                }
                // if (!cc.sys.isNative)
                //     request.withCredentials = true;
                // else if (cc.ServerConnector.getInstance().getCookie()) {
                //     request.setRequestHeader('cookie', cc.ServerConnector.getInstance().getCookie());
                // }

                request.onreadystatechange = function() {
                    //request.status === 200
                    if (request.readyState === 4) {
                        if (cc.sys.isNative) {

                        }
                        if (Debug) {
                            console.log('sendRequestPOST responseText');
                            console.log(request.responseText);
                        }
                        return callback(request.responseText);
                    }
                };
                return request.send(params);
            } catch (error) {
                e = error;
                return console.log('Caught Exception: ' + e.message);
            }
        };

        ServerConnector.prototype.getToken = function() {
            return this.token;
        };

        ServerConnector.prototype.setToken = function(token) {
            return this.token = token;
        };

        ServerConnector.prototype.setLatitude = function(latitude) {
            return this.latitude = latitude;
        };

        ServerConnector.prototype.getLatitude = function() {
            return this.latitude;
        };

        ServerConnector.prototype.setLongitude = function(longitude) {
            return this.longitude = longitude;
        };

        ServerConnector.prototype.getLongitude = function() {
            return this.longitude;
        };

        ServerConnector.prototype.setCookie = function(cookie) {
            return this.cookie = cookie;
        };

        ServerConnector.prototype.getCookie = function() {
            return this.cookie;
        };

        ServerConnector.prototype.setCookie = function(cookie) {
            return this.cookie = cookie;
        };

        ServerConnector.prototype.getDeviceId = function() {
            return this.deviceId;
        };

        ServerConnector.prototype.setDeviceId = function(deviceId) {
            return this.deviceId = deviceId;
        };

        ServerConnector.prototype.getCaptchaPrivateKey = function() {
            return this.captchaPrivateKey;
        };

        ServerConnector.prototype.setCaptchaPrivateKey = function(captchaPrivateKey) {
            return this.captchaPrivateKey = captchaPrivateKey;
        };

        return ServerConnector;

    })();

    cc.ServerConnector = ServerConnector;

}).call(this);