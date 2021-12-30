const Web3 = require('web3.min');

(function() {
    var MetamaskController;

    MetamaskController = (function() {
        var instance;

        function MetamaskController() {

        }

        instance = void 0;

        MetamaskController.getInstance = function() {
            if (instance === void 0) {
                instance = this;
            }

            return instance.prototype;
        };

        MetamaskController.prototype.isInstalled = function() {
            const isWeb3Enabled = () => !!window.web3;
            if (isWeb3Enabled()) {
                return true;
            } else {
                return false;
            }
        };

        MetamaskController.prototype.setAdminAddress = function(value) {
            this._adminAddress = value
        };

        MetamaskController.prototype.login = function(listener) {
            this.web3 = null;
            this.web3Provider = null;

            const isWeb3Enabled = () => !!window.web3;
            if (isWeb3Enabled()) {
                this.web3 = new Web3();

                //Request account access for modern dapp browsers
                if (window.ethereum) {
                    this.web3Provider = window.ethereum;
                    this.web3.setProvider(this.web3Provider);
                    window.ethereum
                        .request({ method: 'eth_requestAccounts' })
                        .then(accounts => {
                            //call get account here
                            cc.MetamaskController.getInstance().requestAccount(listener);
                        })
                        .catch(error => {
                            console.error(error);
                            listener.onLoginMetamaskFail(error)
                        });
                }
                //Request account access for legacy dapp browsers
                else if (window.web3) {
                    this.web3Provider = window.web3.currentProvider;
                    this.web3.setProvider(this.web3Provider);
                    //call get account here
                    cc.MetamaskController.getInstance().requestAccount(listener);
                }
            } else {
                listener.onLoginMetamaskFail(error)
            }
        };

        MetamaskController.prototype.requestAccount = function(listener) {
            this.web3.eth.getAccounts()
                .then(accounts => {
                    if (accounts.length > 0) {
                        this.address = accounts[0].toLowerCase();
                        const message = 'hello great saxi butas deple titoi bunda soahs dept meta cong sadte';
                        const signatureObject = this.web3.eth.accounts.sign(message, this.address);
                        // return thong qua callback
                        listener.onLoginMetamaskSuccess(this.address, message, signatureObject)
                    } else {
                        console.error('You must enable and login into your Wallet or MetaMask accounts!');
                        listener.onLoginMetamaskFail(error)
                    }
                })
                .catch(error => {
                    console.error(error);
                    listener.onLoginMetamaskFail(error)
                });
        };

        MetamaskController.prototype.openDownloadLink = function() {
            window.open('https://metamask.app.link/dapp/app.lovemypets.io', '_blank').focus();
        };

        MetamaskController.prototype.createTokenContract = function(contractJson, contractAddress) {
            var json = contractJson.json.result;
            const abi = JSON.parse(json);
            this.web3.eth.net.getNetworkType().then(netId => {
                this.contract = new this.web3.eth.Contract(
                    abi,
                    contractAddress
                );
            });
        };

        MetamaskController.prototype.depositToken = function(amount, controller) {
            if (this._adminAddress == undefined) {
                cc.PopupController.getInstance().showPopup("Không tìm thấy ví Admin");
                cc.PopupController.getInstance().hidePopupAfterDelay(2);
            } else if (this.contract == undefined) {
                cc.PopupController.getInstance().showPopup("Không tìm thấy Token Contract");
                cc.PopupController.getInstance().hidePopupAfterDelay(2);
            } else {
                const bn = new this.web3.utils.BN(amount);

                const decimals = 18
                const decimalsBN = new this.web3.utils.BN(decimals)
                const divisor = new this.web3.utils.BN(10).pow(decimalsBN)

                const tokenNumber = bn.mul(divisor)
                cc.PopupController.getInstance().showPopup("Đang nạp token...");
                this.transactionHash = null;
                this.contract.methods.transfer(this._adminAddress, tokenNumber.toString())
                    .send({ from: this.address })
                    .on('transactionHash', hash => {
                        console.log('transactionHash: ', hash);
                    })
                    .on('receipt', receipt => {
                        console.log('transactionReceipt: ', receipt);
                        const tranHash = receipt.transactionHash
                        if (tranHash !== this.transactionHash) {
                            this.transactionHash = tranHash;
                            //return
                            controller.onDepositTransactionReceipt(amount, this.transactionHash)
                        }
                    })
                    .on('error', error => {
                        cc.PopupController.getInstance().showPopup(error.message);
                        cc.PopupController.getInstance().hidePopupAfterDelay(2);
                    });

            }
        };

        return MetamaskController;

    })();

    cc.MetamaskController = MetamaskController;

}).call(this);