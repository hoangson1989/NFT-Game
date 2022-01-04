cc.Class({
    extends: cc.Component,

    properties: {
        loginView: cc.Node,
        mainView: cc.Node,
        accountInfoView: cc.Node,

        // these are child of Main View
        lobbyView: cc.Node,
        shopView: cc.Node,
        battleView: cc.Node,
        marketView: cc.Node,
        myFarmView: cc.Node,

        //Tab Buttons
        btnShop: cc.Button,
        btnBattle: cc.Button,
        btnMarket: cc.Button,
        btnMyFarm: cc.Button,

        //popup
        popupView: cc.Node,
        popupLabel: cc.Label,

        //Token
        adminAddress: "0x00b3b4982ec9ecc9bb49305af1dc50c4dc693046",
        contractAddress: "0xcd1740512213c0316C5a99FaeB18580FbdF1F048",
        contractABI: cc.JsonAsset,
    },

    // LIFE-CYCLE CALLBACKS:

    start() {
        this.lobbyView.active = true;
        //
        cc.GameController.getInstance().setMainView(this);
        //
        cc.PopupController.getInstance().setLabel(this.popupLabel);
        cc.PopupController.getInstance().setPopup(this.popupView);
        cc.PopupController.getInstance().setController(this);
        //
        cc.MetamaskController.getInstance().setAdminAddress(this.adminAddress);
        //
        if (cc.AccountController.getInstance().getMetamaskAddress() != null) {
            this.loginView.active = false;
            this.mainView.active = true;
        } else {
            this.loginView.active = true;
            this.mainView.active = false;
        }

        this.selectedBtn = null;
        this.selectedTabView = null;
    },

    onLoad() {

    },

    update(dt) {

    },

    //show Lobby 
    showLobbyView() {
        this.lobbyView.active = true;
        this.accountInfoView.active = true;
        if (this.selectedTabView != null) {
            this.selectedTabView.active = false;
            this.selectedTabView = null;
        }
        if (this.selectedBtn != null) {
            this.selectedBtn.interactable = true;
            this.selectedBtn = null;
        }
    },

    // Thay đổi Tab
    showShopView() {
        this.accountInfoView.active = true;
        if (this.selectedTabView != null) {
            this.selectedTabView.active = false;
        }
        this.lobbyView.active = false;
        this.shopView.active = true;

        if (this.selectedBtn != null) {
            this.selectedBtn.interactable = true;
        }
        this.btnShop.interactable = false;

        this.selectedBtn = this.btnShop;
        this.selectedTabView = this.shopView;
        //update ui cho shop view

    },

    showMyPetView() {
        this.accountInfoView.active = true;
        if (this.selectedTabView != null) {
            this.selectedTabView.active = false;
        }
        this.lobbyView.active = false;
        if (this.selectedBtn != null) {
            this.selectedBtn.interactable = true;
        }

        this.myFarmView.active = true;
        this.selectedTabView = this.myFarmView;
        this.btnMyFarm.interactable = false;
        this.selectedBtn = this.btnMyFarm;
    },

    showMarketView() {
        this.accountInfoView.active = true;
        if (this.selectedTabView != null) {
            this.selectedTabView.active = false;
        }
        this.lobbyView.active = false;
        if (this.selectedBtn != null) {
            this.selectedBtn.interactable = true;
        }

        this.marketView.active = true;
        this.selectedTabView = this.marketView;
        this.btnMarket.interactable = false;
        this.selectedBtn = this.btnMarket;
    },

    showBattleView() {
        const petToRace = cc.GameController.getInstance().getPetToRace();
        if (petToRace == undefined || petToRace == null) {
            cc.PopupController.getInstance().showPopup("Please select Pet to race");
            cc.PopupController.getInstance().hidePopupAfterDelay(2);
        } else {
            this.accountInfoView.active = false;
            if (this.selectedTabView != null) {
                this.selectedTabView.active = false;
            }
            this.lobbyView.active = false;
            if (this.selectedBtn != null) {
                this.selectedBtn.interactable = true;
            }

            this.battleView.active = true;
            this.selectedTabView = this.battleView;
            this.btnBattle.interactable = false;
            this.selectedBtn = this.btnBattle;
        }

    },

    // Login Metamask
    loginMetamaskPressed() {
        if (cc.MetamaskController.getInstance().isInstalled()) {
            // login
            cc.MetamaskController.getInstance().login(this);
        } else {
            //
            cc.MetamaskController.getInstance().openDownloadLink();
        }
    },

    onLoginMetamaskSuccess(address, message, signature) {
        console.log('login metamask thanh cong');
        cc.MetamaskController.getInstance().createTokenContract(this.contractABI, this.contractAddress);
        //
        var params = JSON.stringify({
            address: address,
            message: message,
            messageHash: signature.messageHash,
            signature: signature.signature,
            v: signature.v,
            r: signature.r,
            s: signature.s,
        });
        cc.APIController.getInstance().login(params, this);
    },

    onLoginMetamaskFail(error) {
        cc.PopupController.getInstance().showPopup("Can not connect to Metamask");
        cc.PopupController.getInstance().hidePopupAfterDelay(3);
        console.log('login metamask that bai');
    },

    // Login Lên Server response
    onLoginSuccess(obj) {
        console.log('login server thanh cong');

        cc.AccountController.getInstance().setMetamaskAddress(obj.eth_address);
        cc.AccountController.getInstance().setAccessToken(obj.access_token);
        cc.AccountController.getInstance().setBallance(obj.balance);

        this.loginView.active = false;
        this.mainView.active = true;

        // get config của Box Items
        var params = JSON.stringify({
            address: obj.eth_address,
        });
        cc.APIController.getInstance().getConfig(params, this);
    },
    onLoginFail(obj) {
        console.log('login server that bai ' + obj);
        if (obj.message != undefined) {
            cc.PopupController.getInstance().showPopup(obj.message);
        } else {
            cc.PopupController.getInstance().showPopup('Login fail');
        }
        cc.PopupController.getInstance().hidePopupAfterDelay(2);
    },

    //open Box
    openSilverBox() {

    },

    // GetConfig Response
    onGetConfigSuccess(obj) {
        console.log('get config thanh cong');
        cc.GameController.getInstance().setSilverBoxFee(obj.silver_box_fee);
        cc.GameController.getInstance().setBattleDuration(obj.battlefield_duration);

    },
    onGetConfigFail(error) {
        console.log('get config that bat ' + error);

        if (error.message != undefined) {
            cc.PopupController.getInstance().showPopup(error.message);
        } else {
            cc.PopupController.getInstance().showPopup('Cannot get the server configuration');
        }
        cc.PopupController.getInstance().hidePopupAfterDelay(3);
    },
});