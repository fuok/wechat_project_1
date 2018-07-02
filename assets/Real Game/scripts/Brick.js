let BrickManager = require('BrickManager');
let EnemyManager = require('EnemyManager');
let ParticleManager = require('ParticleManager');

cc.Class({
    extends: cc.Component,

    properties: {
        isBroken: {
            get () {
                return this._isBroken;
            },
            set (value) {
                this._isBroken = value;
                if (this.node.active != !this._isBroken) {
                    this.node.active = !this._isBroken;
                }
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
        this.isBroken = false;
    },

    start () {

    },

    // update (dt) {},

    break () {
        // 粒子效果
        ParticleManager.instance.createBrickHitFX(this.node.position);

        this.isBroken = true;
        BrickManager.instance.checkAllBricksBroken();
    },
    onCollisionEnter: function(other) {
        if (other.node.group == 'enemy') {
            this.break();
        }
    }
});
