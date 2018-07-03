
let ParticleManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        rootNode: {
            default: null,
            type: cc.Node
        },
        enemyHitFX1Prefab: {
            default: null,
            type: cc.Prefab
        },
        enemyHitFX2Prefab: {
            default: null,
            type: cc.Prefab
        },
        enemyHitFX3Prefab: {
            default: null,
            type: cc.Prefab
        },
        brickHitFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        brickRepairFXPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ParticleManager.instance = this;

        this.enemyHitFX1Pool = new cc.NodePool();
        this.enemyHitFX2Pool = new cc.NodePool();
        this.enemyHitFX3Pool = new cc.NodePool();
        this.brickHitFXPool = new cc.NodePool();
        this.brickRepairFXPool = new cc.NodePool();
    },

    start () {

    },

    createFX (pos, nodePool, FXPrefab) {
        let fxNode = null;

        if (nodePool.length > 0) {
            fxNode = nodePool.get();
        } else {
            fxNode = cc.instantiate(FXPrefab);
        }
        fxNode.getComponent(cc.ParticleSystem).scheduleOnce(this.destroyFX.bind(this, fxNode, nodePool), 2);
        this.rootNode.addChild(fxNode);
        // pos参数是相对于rootNode的pos
        fxNode.position = pos;
    },

    destroyFX(fxNode, nodePool) {
        nodePool.put(fxNode);
    },

    createEnemyHitFX1 (pos) {
        this.createFX(pos, this.enemyHitFX1Pool, this.enemyHitFX1Prefab);
    },

    createEnemyHitFX2 (pos) {
        this.createFX(pos, this.enemyHitFX2Pool, this.enemyHitFX2Prefab);
    },

    createEnemyHitFX3 (pos) {
        this.createFX(pos, this.enemyHitFX3Pool, this.enemyHitFX3Prefab);
    },

    createBrickHitFX (pos) {
        this.createFX(pos, this.brickHitFXPool, this.brickHitFXPrefab);
    },

    createBrickRepairFX (pos) {
        this.createFX(pos, this.brickRepairFXPool, this.brickRepairFXPrefab);
    },
});
