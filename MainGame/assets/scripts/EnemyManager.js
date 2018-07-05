let ScoreManager = require('ScoreManager');

let EnemyManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        timeScale: 1,
        rootNode: {
            default: null,
            type: cc.Node
        },
        normalEnemyPrefab: {
            default: null,
            type: cc.Prefab
        },
        singleRecoveryPrefab: {
            default: null,
            type: cc.Prefab
        },
        fullRecoveryPrefab: {
            default: null,
            type: cc.Prefab
        },
        getScoreLabelPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        EnemyManager.instance = this;
        // 避免循环引用，先用这个写法
        this.GameManager = require('GameManager');
        this.enemyPool = new cc.NodePool();
        this.enemies = [];
    },

    start () {
    },

    resetLevel () {
        this.unscheduleAllCallbacks();

        let curLevel = this.GameManager.instance.curLevel;
        this.schedule(function() {
            this.createNewNormalEnemy();
        }, curLevel.normalEnemyInterval);
        this.schedule(function() {
            this.createNewSingleRecovery();
        }, curLevel.singleRecoveryInterval);
        this.schedule(function() {
            this.createNewFullRecovery();
        }, curLevel.fullRecoveryInterval);

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].getComponent('Enemy').resetSpeed();
        }
    },

    getAllEnemies () {
        return this.enemies;
    },

    clearAllEnemies () {
        this.unscheduleAllCallbacks();
        while(this.enemies.length > 0) {
            this.enemies[this.enemies.length - 1].getComponent('Enemy').eliminate();
        }
    },

    addEnemy (enemyNode) {
        this.rootNode.addChild(enemyNode);
        this.enemies.push(enemyNode);
        enemyNode.getComponent('Enemy').init();
    },

    removeEnemy (enemyNode) {
        let index = this.enemies.indexOf(enemyNode);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    },

    createNewNormalEnemy () {
        let normalEnemyNode = null;

        if (this.enemyPool.length > 0) {
            normalEnemyNode = this.enemyPool.get();
        } else {
            normalEnemyNode = cc.instantiate(this.normalEnemyPrefab);
        }
        this.addEnemy(normalEnemyNode);
    },

    createNewSingleRecovery () {
        let singleRecoveryNode = cc.instantiate(this.singleRecoveryPrefab);
        this.addEnemy(singleRecoveryNode);
    },

    createNewFullRecovery () {
        let fullRecoveryNode = cc.instantiate(this.fullRecoveryPrefab);
        this.addEnemy(fullRecoveryNode);
    },

    destroyNormalEnemy (enemyNode) {
        this.removeEnemy(enemyNode);
        this.enemyPool.put(enemyNode);
    },

    destroyRecovery (recoveryNode) {
        this.removeEnemy(recoveryNode);
        recoveryNode.destroy();
    },

    killNormalEnemy (enemyNode) {
        //显示击中得分
        var score=10;
        var getScoreLabel=cc.instantiate(this.getScoreLabelPrefab);
        this.rootNode.addChild(getScoreLabel);
        getScoreLabel.setPosition(enemyNode);
        //延迟销毁
        setTimeout(function () {
            getScoreLabel.destroy();
          }.bind(this), 500);
          
        //回收对象
        this.destroyNormalEnemy(enemyNode);
        // TODO: 击中目标不同得分不同
        ScoreManager.instance.gainScore(score);
    },

    slowMotion() {
        this.getComponent(cc.Animation).play();
    }
});
