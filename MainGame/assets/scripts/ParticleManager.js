
let ParticleManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        gameCanvasNode: {
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
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ParticleManager.instance = this;

        this.enemyHitFX1Pool = new cc.NodePool();
        this.enemyHitFX2Pool = new cc.NodePool();
        this.enemyHitFX3Pool = new cc.NodePool();
        this.brickHitFXPool = new cc.NodePool();
    },

    start () {

    },

    createFX (pos, nodePool, FXPrefab, direction=-1) {
        let fxNode = null;

        if (nodePool.length > 0) {
            fxNode = nodePool.get();
        } else {
            fxNode = cc.instantiate(FXPrefab);
        }
        fxNode.getComponent(cc.ParticleSystem).scheduleOnce(this.destroyFX.bind(this, fxNode, nodePool), 2);
        this.gameCanvasNode.addChild(fxNode);
        // pos参数是相对于rootNode的pos
        fxNode.position = pos;
        if (direction == 0 /* left */) {
            fxNode.scaleX = -Math.abs(fxNode.scaleX);
        } else if (direction == 1 /* right */) {
            fxNode.scaleX = Math.abs(fxNode.scaleX);
        }
    },

    destroyFX(fxNode, nodePool) {
        nodePool.put(fxNode);
    },

    createEnemyHitFX1 (pos, direction) {
        this.createFX(pos, this.enemyHitFX1Pool, this.enemyHitFX1Prefab, direction);
    },

    createEnemyHitFX2 (pos, direction) {
        this.createFX(pos, this.enemyHitFX2Pool, this.enemyHitFX2Prefab, direction);
    },

    createEnemyHitFX3 (pos, direction) {
        this.createFX(pos, this.enemyHitFX3Pool, this.enemyHitFX3Prefab, direction);
    },

    createBrickHitFX (pos) {
        this.createFX(pos, this.brickHitFXPool, this.brickHitFXPrefab);
    },
});
