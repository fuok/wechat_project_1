let EnemyManager = require('EnemyManager')

let levels = [
    {
        scoreLimit: 10,
        normalEnemyInterval: 2,
        singleRecoveryInterval: 8,
        fullRecoveryInterval: 15,
        minSpeed: 100,
        maxSpeed: 120,
    },
    {
        scoreLimit: 30,
        normalEnemyInterval: 1.5,
        singleRecoveryInterval: 5,
        fullRecoveryInterval: 10,
        minSpeed: 120,
        maxSpeed: 150,
    },
    {
        scoreLimit: 100,
        normalEnemyInterval: 1,
        singleRecoveryInterval: 5,
        fullRecoveryInterval: 10,
        minSpeed: 150,
        maxSpeed: 200,
    }
];

let GameManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        // 地面节点，用于确定星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        groundPosY: 0,
        // score label 的引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        curLevel: {
            get() {
                return levels[this.curLevelIndex];
            }
        },
        // 得分音效资源
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad: function () {
        GameManager.instance = this;

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

        // 初始化计分
        this.score = 0;
    },

    start() {
        this.curLevelIndex = -1;
        this.nextLevel();
    },

    update(dt) {
    },

    gainScore (score) {
        this.score += score;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);

        if (this.score > levels[this.curLevelIndex].scoreLimit) {
            this.nextLevel();
        }
    },

    nextLevel () {
        if (this.curLevelIndex >= levels.length - 1) {
            return;
        }
        
        this.curLevelIndex += 1;
        EnemyManager.instance.resetLevel();
    },

    gameOver () {
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('game');
    }
});