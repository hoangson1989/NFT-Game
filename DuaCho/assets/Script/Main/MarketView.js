// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        myItemOnlyCheckMark: cc.Node,
        checkMarkTabPet: cc.Node,
        checkMarkTabFragment: cc.Node,

        indicatorLess: cc.Node,
        indicatorMore: cc.Node,

        marketScrollView: cc.ScrollView,
        marketContentView: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.myItemOnly = false;
        this.myItemOnlyCheckMark.active = false;

        this.itemType = "pet";
        this.checkMarkTabPet.active = true;
        this.checkMarkTabFragment.active = false;

        this.marketScrollView.mOriginHeight = this.marketScrollView.node.getContentSize().height;
        this.marketContentView.mOriginHeight = this.marketContentView.getContentSize().height;
        this.marketData = null;
    },

    // update (dt) {},

    showMarketListData() {
        if (this.marketData != null) {
            this.dataList = this.marketData;

            //
            this.selectedScrollView = this.marketScrollView;
            this.selectedContentView = this.marketContentView;
            this.selectedScrollView.node.active = true;
            //
            this.showIndicatorIfNeed();
        }
    },

    // Tab
    selectMyItemOnly() {
        this.myItemOnly = !this.myItemOnly;
        this.myItemOnlyCheckMark.active = this.myItemOnly;
    },

    selectTabPet() {
        if (this.itemType != "pet") {
            this.itemType = "pet";
            this.checkMarkTabPet.active = true;
            this.checkMarkTabFragment.active = false;
        }
    },

    selectTabFragment() {
        if (this.itemType != "fragment") {
            this.itemType = "fragment";
            this.checkMarkTabPet.active = false;
            this.checkMarkTabFragment.active = true;
        }
    },

    // Indicator 
    selectPage1() {
        this.showPageIndex(0);
    },

    selectPage2() {
        this.showPageIndex(1);
    },

    selectPage3() {
        this.showPageIndex(2);
    },

    selectPageLast() {
        var numberOfPages = Math.floor(this.dataList.length / 8);
        if ((this.dataList.length % 8) > 0) {
            numberOfPages += 1;
        }
        this.showPageIndex(numberOfPages - 1);
    },

    selectPageNext() {
        var numberOfPages = Math.floor(this.dataList.length / 8);
        if ((this.dataList.length % 8) > 0) {
            numberOfPages += 1;
        }
        if (this.currentPage < numberOfPages - 1) {
            this.showPageIndex(this.currentPage + 1);
        }
    },

    selectPagePrev() {
        if (this.currentPage > 0) {
            this.showPageIndex(this.currentPage - 1);
        }
    },

    showPageIndex(index) {
        if (this.indicatorLess.active) {
            for (var i = 0; i < this.indicatorLess.children.length; ++i) {
                let btn = this.indicatorLess.children[i].getComponent(cc.Button);
                if (i == index) {
                    btn.interactable = false;
                } else {
                    btn.interactable = true;
                }
            }
        } else if (this.indicatorMore.active) {
            var numberOfPages = Math.floor(this.dataList.length / 8);
            if ((this.dataList.length % 8) > 0) {
                numberOfPages += 1;
            }

            let page1Node = this.indicatorMore.getChildByName('page1');
            let pageCurrentNode = this.indicatorMore.getChildByName('pageCurrent');
            let pageLastNode = this.indicatorMore.getChildByName('pageLast');
            if (index == 0) {
                let btn = page1Node.getComponent(cc.Button);
                btn.interactable = false;
                //
                let btnLast = pageLastNode.getComponent(cc.Button);
                btnLast.interactable = true;
                //
                let lbl = pageCurrentNode.children[0].children[0].getComponent(cc.Label);
                lbl.string = '2'
                    //
                let btnCurrent = pageCurrentNode.getComponent(cc.Button);
                btnCurrent.interactable = true;
            } else if (index == numberOfPages - 1) {
                let btn1 = page1Node.getComponent(cc.Button);
                btn1.interactable = true;
                //
                let btnLast = pageLastNode.getComponent(cc.Button);
                btnLast.interactable = false;
                //
                let lbl = pageCurrentNode.children[0].children[0].getComponent(cc.Label);
                lbl.string = '2'
                    //
                let btnCurrent = pageCurrentNode.getComponent(cc.Button);
                btnCurrent.interactable = true;
            } else {
                let btn1 = page1Node.getComponent(cc.Button);
                btn1.interactable = true;
                //
                let btnLast = pageLastNode.getComponent(cc.Button);
                btnLast.interactable = true;
                //
                let lbl = pageCurrentNode.children[0].children[0].getComponent(cc.Label);
                lbl.string = '' + (index + 1)
                    //
                let btnCurrent = pageCurrentNode.getComponent(cc.Button);
                btnCurrent.interactable = false;
            }
        }
        this.currentPage = index;

        // Change Items cho ScrollView
        var countVisible = 0
        for (var i = 0; i < this.selectedContentView.children.length; ++i) {
            let marketItemNode = this.selectedContentView.children[i];
            let dataIndex = (index * 8) + i;
            if (dataIndex < this.dataList.length) {
                countVisible += 1;
                marketItemNode.active = true;
                let dataItem = this.dataList[dataIndex];
            } else {
                marketItemNode.active = false;
            }
        }
        if (countVisible <= 4) {
            var contentSize = this.selectedContentView.getContentSize();
            contentSize.height = this.selectedContentView.mOriginHeight / 2;
            this.selectedContentView.setContentSize(contentSize);
        } else {
            var contentSize = this.selectedContentView.getContentSize();
            contentSize.height = this.selectedContentView.mOriginHeight;
            this.selectedContentView.setContentSize(contentSize);
        }

        //
        if (this.selectedScrollView != null) {
            this.selectedScrollView.scrollToTop(0.3);
        }
    },

    showIndicatorIfNeed() {
        var numberOfPages = Math.floor(this.dataList.length / 8);
        if ((this.dataList.length % 8) > 0) {
            numberOfPages += 1;
        }
        if (numberOfPages > 1) {
            if (numberOfPages <= 3) {
                this.indicatorLess.active = true;
                this.indicatorMore.active = false;
            } else {
                this.indicatorLess.active = false;
                this.indicatorMore.active = true;

                let pageLastNode = this.indicatorMore.getChildByName('pageLast');
                let lbl = pageLastNode.children[0].children[0].getComponent(cc.Label);
                lbl.string = '' + numberOfPages
            }
            var size = this.selectedScrollView.node.getContentSize();
            size.height = this.selectedScrollView.mOriginHeight - 150;
            this.selectedScrollView.node.setContentSize(size);
        } else {
            this.indicatorLess.active = false;
            this.indicatorMore.active = false;

            var size = this.selectedScrollView.node.getContentSize();
            size.height = this.selectedScrollView.mOriginHeight;
            this.selectedScrollView.node.setContentSize(size);
        }
        //
        this.showPageIndex(0);
    },
});