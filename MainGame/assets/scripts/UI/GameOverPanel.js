let GameConfig = require('GameConfig');
let ScoreManager = require('ScoreManager');
let GameManager = require('GameManager');
let SubDomainManager = require('SubDomainManager');

cc.Class({
    extends: cc.Component,
    // name: 'GameOver',
    properties: {
        scoreLabel: cc.Label,
        rankingButton: cc.Node, //排行榜按钮
        shareButton: cc.Node, //分享按钮
        backButton: cc.Node, //返回按钮
        restartButton: cc.Node, //重新开始按钮
        subDomainCanvas: cc.Sprite,//显示排行榜
    },

    onLoad() {
        this.scoreLabel.string = ScoreManager.instance.currentScore;
        // TODO: 这里应该换成maxscore
        SubDomainManager.instance.submitScore(ScoreManager.instance.currentScore); //提交得分

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

    onBackButtonPressed(event) {
        this.node.destroy();
        GameManager.instance.Opening();
    },

    onRestartButtonPressed(event) {
        this.node.destroy();
        GameManager.instance.gameStart();
    },

    onRankingButtonPressed(event) {
        GameManager.instance.showWechatRankingPanel();
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
        // DEBUG!!!!!!!!!!!
        this._updateSubDomainCanvas();
    },
});
