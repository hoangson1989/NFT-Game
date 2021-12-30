(function() {
    var LocalStorage;

    LocalStorage = (function() {
        var instance;

        function LocalStorage() {}

        instance = void 0;

        LocalStorage.getInstance = function() {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        LocalStorage.prototype.getData = function(key) {
            return cc.sys.localStorage.getItem(key);
        };

        LocalStorage.prototype.setData = function(key, data) {
            cc.sys.localStorage.setItem(key, data);
        };

        return LocalStorage;

    })();

    cc.LocalStorage = LocalStorage;

}).call(this);