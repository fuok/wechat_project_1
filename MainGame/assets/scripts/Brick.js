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

    repair () {
        if (this.isBroken == true) {
            this._isBroken = false;
            this.node.active = true;
            ParticleManager.instance.createBrickRepairFX(this.node.position);
        }
    }
});
