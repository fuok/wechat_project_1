
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

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event){
            switch(event.keyCode) {
                case cc.KEY.a:
                    self.btnDirection.node.scaleX = -1;
                    self.player.moveLeft();
                    break;
                case cc.KEY.d:
                    self.btnDirection.node.scaleX = 1;
                    self.player.moveRight();
                    break;
                case cc.KEY.j:
                    self.player.shoot();
                    break;
            }
        });

        // 松开按键时，停止向该方向的加速
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event){
            switch(event.keyCode) {
                case cc.KEY.a:
                    self.player.stopMove();
                    break;
                case cc.KEY.d:
                    self.player.stopMove();
                    break;
            }
        });
    },
});
