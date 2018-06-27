let GameManager = require('GameManager')

cc.Class({
    extends: cc.Component,

    properties: {
        fallingSpeed : 0,
        xRangeMin : 0,
        xRangeMax : 1080,
        speedMin : 0,
        speedMax : 1080,
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
        this.init();
    },

    init () {
        this.node.x = Math.random() * (this.xRangeMax - this.xRangeMin) + this.xRangeMin;
        this.node.y = 1200;
        this.fallingSpeed = Math.random() * (this.speedMax - this.speedMin) + this.speedMin;
    },

    update (dt) {
        this.node.y -= this.fallingSpeed * dt;
    },
    
    onCollisionEnter: function(other) {
        if (other.node.name == "Ground") {
            GameManager.instance.killEnemy(this.node);
        } else if (other.node.name == "Player") {
            GameManager.instance.gameOver();
        }
    }
});
