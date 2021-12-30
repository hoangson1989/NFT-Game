(function() {
    var GameController;

    GameController = (function() {
        var instance;

        function GameController() {

        }

        instance = void 0;

        GameController.getInstance = function() {
            if (instance === void 0) {
                instance = this;
                //
                instance.prototype._silverFee = null;
                instance.prototype._battleDuration = null;
            }
            return instance.prototype;
        };


        GameController.prototype.getSilverBoxFee = function() {
            return this._silverFee;
        };

        GameController.prototype.setSilverBoxFee = function(value) {
            this._silverFee = value;
        };

        GameController.prototype.getBattleDuration = function() {
            return this._battleDuration;
        };

        GameController.prototype.setBattleDuration = function(value) {
            this._battleDuration = value;
        };


        return GameController;

    })();

    cc.GameController = GameController;

}).call(this);