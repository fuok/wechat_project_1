let BackgroundManager = require('BackgroundManager');
let ScoreManager = require('ScoreManager');
let BrickManager = require('BrickManager');
let EnemyManager = require('EnemyManager');
let BarrageManager = require('BarrageManager');

const GameState = {
    Opening: 0,
    Playing: 1,
    GameOver: 2,
};

let initLevel = {
    scoreLimit: 200,
    playerMoveSpeed: 500,
    normalEnemyInterval: 2,
    singleRecoveryInterval: 7,
    fullRecoveryInterval: 25,
    minSpeed: 100,
    maxSpeed: 200,
    bulletCount: 16,
    //TODO
    burstNumber: 5,
};

let GameManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        // 地面节点，用于确定星星生成的高度
        cameraNode: {
            default: null,
            type: cc.Node
        },
        uiNode: {
            default: null,
            type: cc.Node
        },
        gamepadNode: {
            default: null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node
        },
        nextLevelLabel: {
            default: null,
            type: cc.Node
        },
        groundPosY: 0,
        curLevelIndex: 0,
        levelCount: 999,
        startingLevel: 0,
        gameState: {
            get () {
                return this._gameState;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad: function () {
        GameManager.instance = this;

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;

    },

    start() {
        this.Opening();
    },

    Opening () {
        this._gameState = GameState.Opening;
        this.player.getComponent('Player').reset();
        BrickManager.instance.resetAllBricks();
        EnemyManager.instance.clearAllEnemies();
        ScoreManager.instance.hideStatusBar();
        this.gamepadNode.active = false;
        this.cameraNode.getComponent('CameraController').resetCameraToTarget();
        this.loadPanel('prefabs/panels/OpeningPanel');
    },

    gameStart () {
        this._gameState = GameState.Playing;
        this.player.getComponent('Player').reset();
        this.player.getComponent('Player').enableInput();
        BrickManager.instance.resetAllBricks();
        EnemyManager.instance.clearAllEnemies();
        // 调试用
        this.curLevelIndex = this.startingLevel;
        BarrageManager.instance.setTutorialBarrages();
        this.nextLevelAnimDone();
        this.gamepadNode.active = true;
        this.cameraNode.getComponent('CameraController').moveCameraToCenter();
    },

    gameOver () {
        this._gameState = GameState.GameOver;
        this.player.getComponent('Player').disableInput();
        EnemyManager.instance.clearAllEnemies();
        BackgroundManager.instance.stageClose();
        this.cameraNode.getComponent('CameraController').moveCameraToTarget();
    },

    setNextLevelLabel () {
        this.nextLevelLabel.active = true;
        let curLevelLabel = this.nextLevelLabel.getChildByName('curLevel');
        let nextLevelLabel = this.nextLevelLabel.getChildByName('nextLevel');
        curLevelLabel.getComponent(cc.Label).string = this.curLevelIndex;
        nextLevelLabel.getComponent(cc.Label).string = this.curLevelIndex + 1;
        this.nextLevelLabel.getComponent(cc.Animation).play();
    },

    nextLevel () {
        // 这个函数只是用来清除当前场景
        EnemyManager.instance.clearAllEnemies();
        BarrageManager.instance.cancelAllBarrageSchedules();
        this.setNextLevelLabel();
        this.generateNextLevelBarrages();
        this.curLevelIndex += 1;
        this.scheduleOnce(this.nextLevelAnimDone, 3);
    },

    generateNextLevelBarrages() {
        this.schedule(this.generateOneNextLevelBarrage, 0.7, 1);
    },

    generateOneNextLevelBarrage() {
        BarrageManager.instance.generateNextLevelBarrage();
    },

    nextLevelAnimDone () {
        // 这个函数是真正的初始化当前level的地方
        this.nextLevelLabel.active = false;
        this.generateCurLevel(this.curLevelIndex);
        BackgroundManager.instance.stageOpen();
        EnemyManager.instance.resetLevel();
        ScoreManager.instance.resetLevel(this.curLevelIndex, this.curLevel.scoreLimit);
        this.player.getComponent('Player').resetLevel();
    },

    showGameOverPanel () {
        this.loadPanel('prefabs/panels/GameOverPanel');
    },

    showRankingPanel () {
        this.loadPanel('prefabs/panels/RankingPanel');
    },

    showTotalRankingPanel () {
        this.loadPanel('prefabs/panels/TotalRankingPanel');
    },

    loadPanel(panelName) {//加载图层
        cc.loader.loadRes(panelName, (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                this.uiNode.addChild(node);
            }
        });
    },

    generateCurLevel(index) {
        if (index == 0) {
            this.curLevel = Object.assign({}, initLevel);
            this.curLevel.scoreLimit = 100;
        } else if (index == 1) {
            this.curLevel = Object.assign({}, initLevel);
            this.curLevel.minSpeed = 120;
            this.curLevel.maxSpeed = 220;
        } else {
            this.previousLevel = Object.assign({}, this.curLevel);
            // this.curLevel.scoreLimit = Math.floor(this.previousLevel.scoreLimit + 100 * this.curLevelIndex);
            this.curLevel.scoreLimit = this.previousLevel.scoreLimit + 200;
            this.curLevel.playerMoveSpeed = this.previousLevel.playerMoveSpeed * 1.03;
            // this.curLevel.normalEnemyInterval = this.previousLevel.normalEnemyInterval * 0.9;
            this.curLevel.normalEnemyInterval = this.previousLevel.normalEnemyInterval - 0.05;
            this.curLevel.singleRecoveryInterval = this.previousLevel.singleRecoveryInterval * 0.9;
            this.curLevel.fullRecoveryInterval = this.previousLevel.fullRecoveryInterval * 0.95;
            this.curLevel.minSpeed = this.previousLevel.minSpeed * 1.04;
            this.curLevel.maxSpeed = this.previousLevel.maxSpeed * 1.04;
            // this.curLevel.bulletCount = Math.floor(this.previousLevel.bulletCount * 1.2);
            this.curLevel.bulletCount = Math.floor(this.previousLevel.bulletCount + 4);
            this.curLevel.burstNumber = this.previousLevel.burstNumber * 1.1;
        }
    }
});