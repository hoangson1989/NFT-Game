(function() {
    var PopupController;

    PopupController = (function() {
        var instance;

        function PopupController() {

        }

        instance = void 0;

        PopupController.getInstance = function() {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        PopupController.prototype.setLabel = function(value) {
            this.lblMsg = value;
        };

        PopupController.prototype.setPopup = function(value) {
            this.popupView = value;
        };

        PopupController.prototype.setController = function(value) {
            this.controller = value;
        };

        PopupController.prototype.showPopup = function(value) {
            this.popupView.active = true;
            this.lblMsg.string = value;
        };

        PopupController.prototype.hidePopup = function() {
            this.popupView.active = false;
        };

        PopupController.prototype.hidePopupAfterDelay = function(value) {
            this.controller.scheduleOnce(function() {
                this.popupView.active = false;
            }, value);
        };

        return PopupController;

    })();

    cc.PopupController = PopupController;

}).call(this);