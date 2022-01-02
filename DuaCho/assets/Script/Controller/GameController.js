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

        GameController.prototype.getMainView = function() {
            return this._mainView;
        };

        GameController.prototype.setMainView = function(value) {
            this._mainView = value;
        };

        GameController.prototype.backToLobby = function() {
            this._mainView.showLobbyView();
        };

        GameController.prototype.showBattleView = function() {
            this._mainView.showBattleView();
        };

        GameController.prototype.getPetToRace = function() {
            return this._petToRace;
        };

        GameController.prototype.setPetToRace = function(value) {
            this._petToRace = value;
        };

        return GameController;

    })();

    cc.GameController = GameController;

}).call(this);