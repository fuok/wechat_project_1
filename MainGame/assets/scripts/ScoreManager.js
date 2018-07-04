
let ScoreManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        },

        currentScore: {
            get () {
                return this._currentScore;
            }
        },

        // TODO: 定义本地存储的maxscore
        maxScore: 0
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ScoreManager.instance = this;
        this.GameManager = require('GameManager');
    },

    start () {
        this.init();
    },

    init () {
        // 初始化计分
        this._currentScore = 0;
    },

    gainScore (score) {
        this._currentScore += score;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this._currentScore.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);

        this.GameManager.instance.checkNextLevel();
    }
});
