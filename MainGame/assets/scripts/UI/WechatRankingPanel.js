let GameConfig = require('GameConfig');
let ScoreManager = require('ScoreManager');
let GameManager = require('GameManager');
let SubDomainManager = require('SubDomainManager');

cc.Class({
    extends: cc.Component,
    // name: "RankingListView",
    properties: {
        rankingLabel: cc.Label,
        backButton: cc.Node,
        shareButton: cc.Node,
        subDomainCanvas: cc.Sprite,//显示排行榜
        shareTicket: null,
    },

    onLoad() {
    },

    start() {
        if (this.shareTicket != null) {
            this.rankingLabel.string = "群排行";
        }
        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = GameConfig.DEVICE_WIDTH;
            window.sharedCanvas.height = GameConfig.DEVICE_HEIGHT;
            // 发消息给子域
            cc.log(this.shareTicket);
            if (this.shareTicket != null) {
                window.wx.postMessage({
                    messageType: 5,
                    MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                    shareTicket: this.shareTicket
                });
            } else {
                window.wx.postMessage({
                    messageType: 1,
                    MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
                });
            }
        } else {
            this.rankingLabel.string = "暂无排行榜数据";
            cc.log("获取排行榜数据。" + GameConfig.MAIN_MENU_NUM);
        }
    },

    shareButtonFunc: function (event) {
        setTimeout(() => {
            SubDomainManager.instance.sharePicture("shareTicket");
        }, 100);
    },

    backButtonFunc: function (event) {
        SubDomainManager.instance.removeRankData();
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
            });
        }
        this.node.destroy();
        GameManager.instance.restartGame();
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (CC_WECHATGAME) {
            if (window.sharedCanvas != undefined) {
                this.tex.initWithElement(window.sharedCanvas);
                this.tex.handleLoadedTexture();
                this.subDomainCanvas.spriteFrame = new cc.SpriteFrame(this.tex);
            }
        }
    },

    update() {
        this._updateSubDomainCanvas();
    }
});
