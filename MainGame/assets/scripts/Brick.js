let BrickManager = require('BrickManager');
let EnemyManager = require('EnemyManager');
let ParticleManager = require('ParticleManager');

cc.Class({
    extends: cc.Component,

    properties: {
        isBroken: {
            get () {
                return this._isBroken;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._isBroken = false;
    },

    start () {

    },

    // update (dt) {},

    break () {
        // 粒子效果
        ParticleManager.instance.createBrickHitFX(this.node.position);

        this._isBroken = true;
        this.node.active = false;
        BrickManager.instance.checkAllBricksBroken();
    },
    onCollisionEnter: function(other) {
        if (other.node.group == 'enemy') {
            this.break();
        }
    },

    repair (playFX=true) {
        if (this.isBroken == true) {
            this._isBroken = false;
            this.node.active = true;
            if (playFX) {
                ParticleManager.instance.createBrickRepairFX(this.node.position);
            }
        }
    }
});
