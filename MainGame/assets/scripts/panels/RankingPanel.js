let GameConfig = require('GameConfig');
let ScoreManager = require('ScoreManager');
let GameManager = require('GameManager');
let SubDomainManager = require('SubDomainManager');

cc.Class({
    extends: cc.Component,
    properties: {
        rankingLabel: cc.Label, //排行榜按钮
        subDomainCanvas: cc.Sprite,//显示排行榜
    },

    onLoad() {
        // 设置好查看全部排名的回调
        let self = this;
        self.rankingLabel.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.onRankingButtonPressed();
        });
        
        SubDomainManager.instance.submitScore(GameManager.instance.curLevelIndex); //提交得分

        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = GameConfig.DEVICE_WIDTH;
            window.sharedCanvas.height = GameConfig.DEVICE_HEIGHT;
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: GameConfig.MAIN_MENU_NUM,
            });
        } else {
            cc.log("获取排行榜数据。" + GameConfig.MAIN_MENU_NUM);
        }
    },

    onRestartButtonPressed(event) {
        this.node.destroy();
        GameManager.instance.gameStart();
    },

    onRankingButtonPressed(event) {
        this.node.destroy();
        GameManager.instance.showTotalRankingPanel();
    },

    onShareButtonPressed(event) {
        SubDomainManager.instance.sharePicture();
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
    },
});
