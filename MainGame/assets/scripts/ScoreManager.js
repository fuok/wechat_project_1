let scoreFXParams = [
    {
        color: '#FFFFFF',
        size: 40
    },
    {
        color: '#49FF41',
        size: 50
    },
    {
        color: '#D941FF',
        size: 60
    },
    {
        color: '#FFB443',
        size: 70
    },
];

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

    createScoreFX (pos, score, comboCount) {
        let fxNode = null;

        if (this.scoreFXPool.length > 0) {
            fxNode = this.scoreFXPool.get();
        } else {
            fxNode = cc.instantiate(this.scoreFXPrefab);
        }
        // 获取该score的color和size
        let paramIndex = 0;
        if (comboCount >= 2 && comboCount <= 9) {
            paramIndex = 1;
        } else if (comboCount > 9 && comboCount <=30) {
            paramIndex = 2;
        } else if (comboCount > 30) {
            paramIndex = 3;
        }

        // pos参数是相对于rootNode的pos
        fxNode.position = pos;
        fxNode.color = fxNode.color.fromHEX(scoreFXParams[paramIndex].color);
        let fxLabel = fxNode.getComponent(cc.Label);
        fxLabel.string = score;
        fxLabel.fontSize = scoreFXParams[paramIndex].size;
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
