
cc.Class({
    extends: cc.Component,

    properties: {
        playerNode: {
            default: null,
            type: cc.Node
        },
        btnDirection: {
            default: null,
            type: cc.Button
        },
        btnShoot: {
            default: null,
            type: cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 获得方向键按钮x
        this.btnDirectionCenterX = this.btnDirection.node.getBoundingBoxToWorld().center.x;
        this.player = this.playerNode.getComponent('Player');
        this.setupInputControl();
    },

    start () {

    },

    checkDirectionButtonTouchEvent (locationWS) {
        if (locationWS.x <= this.btnDirectionCenterX) {
            this.btnDirection.node.scaleX = -1;
            this.player.moveLeft();
        } else {
            this.btnDirection.node.scaleX = 1;
            this.player.moveRight();
        }
    },

    // update (dt) {},
    setupInputControl () {
        let self = this;
        //监听屏幕上两个按钮
        self.btnDirection.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.checkDirectionButtonTouchEvent(event.getLocation());
        });
        self.btnDirection.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            self.checkDirectionButtonTouchEvent(event.getLocation());
        });
        self.btnDirection.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.player.stopMove();
        });
        self.btnDirection.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.player.stopMove();
        });
        self.btnShoot.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.player.shoot();
        });
    },
});
