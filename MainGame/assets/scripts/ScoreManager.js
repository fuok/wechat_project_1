
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

        rootNode: {
            default: null,
            type: cc.Node
        },

        scoreFXPrefab: {
            default: null,
            type: cc.Prefab
        },

        currentScore: {
            get () {
                return this._currentScore;
            }
        },

        // TODO: 定义本地存储的maxscore
        maxScore: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ScoreManager.instance = this;
        this.GameManager = require('GameManager');
        this.scoreFXPool = new cc.NodePool();
    },

    start () {
        this.init();
    },

    init () {
        // 初始化计分
        this._currentScore = 0;
    },

    createScoreFX (pos, score) {
        let fxNode = null;

        if (this.scoreFXPool.length > 0) {
            fxNode = this.scoreFXPool.get();
        } else {
            fxNode = cc.instantiate(this.scoreFXPrefab);
        }
        // pos参数是相对于rootNode的pos
        fxNode.position = pos;
        fxNode.getComponent(cc.Label).string = score;
        this.rootNode.addChild(fxNode);
        fxNode.getComponent(cc.Animation).scheduleOnce(this.destroyFX.bind(this, fxNode), 2);
    },

    destroyFX (fxNode) {
        this.scoreFXPool.put(fxNode);
    },

    clearScore () {
        this._currentScore = 0;
        this.scoreDisplay.string = '';
    },

    setScore(score) {
        this._currentScore = score;
        this.scoreDisplay.string = this._currentScore.toString();
    },

    gainScore (score) {
        this._currentScore += score;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = this._currentScore.toString();
        this.GameManager.instance.checkScoreForLevel(this._currentScore);
    }
});
