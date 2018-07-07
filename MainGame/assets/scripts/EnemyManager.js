let BrickManager = require('BrickManager');

let EnemyManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        timeScale: 1,
        enemyWaveInterval: 0,
        enemyBreakInterval: 0,
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

        this.curLevel = this.GameManager.instance.curLevel;
        this.curLevelEnemyCountPerWave = this.enemyWaveInterval / this.curLevel.normalEnemyInterval;
        this.curWaveGeneratedNormalEnemyCount = 0;

        this.schedule(this.controlGenerateNewNormalEnemy, this.curLevel.normalEnemyInterval);
        this.schedule(this.createNewSingleRecovery, this.curLevel.singleRecoveryInterval);
        this.schedule(this.createNewFullRecovery, this.curLevel.fullRecoveryInterval);
    },

    controlGenerateNewNormalEnemy () {
        if (this.curWaveGeneratedNormalEnemyCount == -1) {
            this.curWaveGeneratedNormalEnemyCount = 0;
            this.unschedule(this.controlGenerateNewNormalEnemy);
            this.schedule(this.controlGenerateNewNormalEnemy, this.curLevel.normalEnemyInterval);
            return;
        }

        this.curWaveGeneratedNormalEnemyCount += 1;
        this.createOneOrTwoEnemies();
        if (this.curWaveGeneratedNormalEnemyCount > this.curLevelEnemyCountPerWave) {
            this.curWaveGeneratedNormalEnemyCount = -1;
            this.unschedule(this.controlGenerateNewNormalEnemy);
            this.schedule(this.controlGenerateNewNormalEnemy, this.enemyBreakInterval);
        }

    },

    getAllEnemies () {
        return this.enemies;
    },

    cancelAllTimeSchedules() {
        this.unschedule(this.controlGenerateNewNormalEnemy);
        this.unschedule(this.createNewSingleRecovery);
        this.unschedule(this.createNewFullRecovery);
    },

    clearAllEnemies () {
        this.unscheduleAllCallbacks();
        while(this.enemies.length > 0) {
            this.enemies[this.enemies.length - 1].eliminate();
        }
    },

    initEnemy (enemyNode) {
        enemyNode.getComponent('Enemy').init(cc.v2(BrickManager.instance.getRandomPosX(), 1200), this.randomSpeed());
    },

    randomSpeed() {
        let minSpeed = this.curLevel.minSpeed;
        let maxSpeed = this.curLevel.maxSpeed;
        return Math.random() * (maxSpeed - minSpeed) + minSpeed;
    },

    addEnemy (enemyNode) {
        this.rootNode.addChild(enemyNode);
        this.enemies.push(enemyNode.getComponent('Enemy'));
    },

    removeEnemy (enemyNode) {
        let enemy = enemyNode.getComponent('Enemy');
        let index = this.enemies.indexOf(enemy);
        if (index > -1) {
            this.enemies.splice(index, 1);
        }
    },

    createOneOrTwoEnemies () {
        if (Math.random() >= 0.5) {
            this.createNewNormalEnemy();
        } else {
            this.createTwoEnemies();
        }
    },

    createTwoEnemies () {
        let indexDis = Math.floor(Math.random() * 10) + 1;
        let firstIndex = Math.floor(Math.random() * (BrickManager.instance.brickCount - 2 * indexDis) + indexDis);
        let secondIndex = Math.random() >= 0.5 ? firstIndex + indexDis : firstIndex - indexDis;
        let firstY = 1100 + Math.random() * 300;
        let secondY = firstY + Math.abs(secondIndex - firstIndex) * BrickManager.instance.brickSize;
        
        let enemy1 = this.createNewNormalEnemy();
        let enemy2 = this.createNewNormalEnemy();
        let speed = this.randomSpeed();

        enemy1.getComponent('Enemy').init(cc.v2(BrickManager.instance.getBrickPosX(firstIndex), firstY), speed);
        enemy2.getComponent('Enemy').init(cc.v2(BrickManager.instance.getBrickPosX(secondIndex), secondY), speed);
    },
    
    createNewNormalEnemy () {
        let normalEnemyNode = null;

        if (this.enemyPool.length > 0) {
            normalEnemyNode = this.enemyPool.get();
        } else {
            normalEnemyNode = cc.instantiate(this.normalEnemyPrefab);
        }
        this.addEnemy(normalEnemyNode);
        this.initEnemy(normalEnemyNode);
        return normalEnemyNode;
    },

    createNewSingleRecovery () {
        let singleRecoveryNode = cc.instantiate(this.singleRecoveryPrefab);
        this.addEnemy(singleRecoveryNode);
        this.initEnemy(singleRecoveryNode);
    },

    createNewFullRecovery () {
        let fullRecoveryNode = cc.instantiate(this.fullRecoveryPrefab);
        this.addEnemy(fullRecoveryNode);
        this.initEnemy(fullRecoveryNode);
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
        var getScoreLabel=cc.instantiate(this.getScoreLabelPrefab);
        this.rootNode.addChild(getScoreLabel);
        getScoreLabel.setPosition(enemyNode);
        //延迟销毁
        setTimeout(function () {
            getScoreLabel.destroy();
          }.bind(this), 500);
        //回收对象
        this.destroyNormalEnemy(enemyNode);
    },

    slowMotion() {
        this.getComponent(cc.Animation).play();
    }
});
