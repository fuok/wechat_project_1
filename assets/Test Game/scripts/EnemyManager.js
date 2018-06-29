let GameManager = require('GameManager')

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

        this.enemyPool = new cc.NodePool();
        this.enemies = [];
        this.spawnEnemyInterval = 0.5;

    },

    start () {
        this.schedule(function() {
            this.createNewNormalEnemy();
        }, 0.5);
        this.schedule(function() {
            this.createNewFullRecovery();
        }, 3);
    },

    // update (dt) {},

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

    createNewFullRecovery () {
        let fullRecoveryNode = cc.instantiate(this.fullRecoveryPrefab);
        this.addEnemy(fullRecoveryNode);
    },

    destroyNormalEnemy (enemyNode) {
        this.removeEnemy(enemyNode);
        this.enemyPool.put(enemyNode);
    },

    destroyFullRecovery (fullRecoveryNode) {
        this.removeEnemy(fullRecoveryNode);
        fullRecoveryNode.destroy();
    },

    killNormalEnemy (enemyNode) {
        this.destroyNormalEnemy(enemyNode);
        GameManager.instance.gainScore();
    }
});
