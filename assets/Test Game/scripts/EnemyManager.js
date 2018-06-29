let EnemyManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
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
        EnemyManager.instance = this;
        // 避免循环引用，先用这个写法
        this.GameManager = require('GameManager');
        this.enemyPool = new cc.NodePool();
        this.enemies = [];
    },

    start () {
    },

    // update (dt) {},
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
        this.destroyNormalEnemy(enemyNode);
        this.GameManager.instance.gainScore();
    }
});
