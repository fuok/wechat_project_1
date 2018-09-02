let BackgroundManager = cc.Class({
    extends: cc.Component,

    statics: {
        instance: null,
    },

    properties: {
        mountain1Node: {
            default: null,
            type:cc.Node
        },
        mountain2Node: {
            default: null,
            type:cc.Node
        },
        cloud1Node: {
            default: null,
            type:cc.Node
        },
        cloud2Node: {
            default: null,
            type:cc.Node
        },
        cloud3Node: {
            default: null,
            type:cc.Node
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
        BackgroundManager.instance = this;
    },

    
    stageOpen () {
        this.scheduleOnce(this.immediateStageOpen.bind(this), 0.5);
    },

    stageClose () {
        let mountain1Pos = new cc.Vec2(-897, 572);
        let mountain2Pos = new cc.Vec2(742, 516);
        let cloud1Pos = new cc.Vec2(-754, 503);
        let cloud2Pos = new cc.Vec2(695, 432);
        let cloud3Pos = new cc.Vec2(650, 637);
        let duration = 1;

        this.moveNode(this.mountain1Node, mountain1Pos, duration);
        this.moveNode(this.mountain2Node, mountain2Pos, duration);
        this.moveNode(this.cloud1Node, cloud1Pos, duration);
        this.moveNode(this.cloud2Node, cloud2Pos, duration);
        this.moveNode(this.cloud3Node, cloud3Pos, duration);
    },

    immediateStageOpen() {
        let mountain1Pos = new cc.Vec2(-223, 572);
        let mountain2Pos = new cc.Vec2(334, 516);
        let cloud1Pos = new cc.Vec2(-331, 503);
        let cloud2Pos = new cc.Vec2(278, 432);
        let cloud3Pos = new cc.Vec2(203, 637);
        let duration = 1;

        this.moveNode(this.mountain1Node, mountain1Pos, duration);
        this.moveNode(this.mountain2Node, mountain2Pos, duration);
        this.moveNode(this.cloud1Node, cloud1Pos, duration);
        this.moveNode(this.cloud2Node, cloud2Pos, duration);
        this.moveNode(this.cloud3Node, cloud3Pos, duration);
    },

    moveNode(node, pos, duration) {
        let action = cc.moveTo(duration, pos);
        action.easing(cc.easeExponentialOut());
        node.runAction(action);
    }
});
