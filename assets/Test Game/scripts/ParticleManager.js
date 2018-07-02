
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
        enemyHitFXPrefab: {
            default: null,
            type: cc.Prefab
        },
        brickHitFXPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        ParticleManager.instance = this;

        this.enemyHitFXPool = new cc.NodePool();
        this.brickHitFXPool = new cc.NodePool();
    },

    start () {

    },

    destroyEnemyHitFX(fxNode) {
        this.enemyHitFXPool.put(fxNode);
    },

    createEnemyHitFX (pos) {
        let fxNode = null;

        if (this.enemyHitFXPool.length > 0) {
            fxNode = this.enemyHitFXPool.get();
        } else {
            fxNode = cc.instantiate(this.enemyHitFXPrefab);
        }
        fxNode.getComponent(cc.ParticleSystem).scheduleOnce(this.destroyEnemyHitFX.bind(this, fxNode), 2);
        this.rootNode.addChild(fxNode);
        // pos参数是相对于rootNode的pos
        fxNode.position = pos;
    },

    destroyBrickHitFX(fxNode) {
        this.brickHitFXPool.put(fxNode);
    },

    createBrickHitFX (pos) {
        let fxNode = null;

        if (this.brickHitFXPool.length > 0) {
            fxNode = this.brickHitFXPool.get();
        } else {
            fxNode = cc.instantiate(this.brickHitFXPrefab);
        }
        fxNode.getComponent(cc.ParticleSystem).scheduleOnce(this.destroyBrickHitFX.bind(this, fxNode), 2);
        this.rootNode.addChild(fxNode);
        // pos参数是相对于rootNode的pos
        fxNode.position = pos;
    },
});
