let GameManager = require('GameManager')

cc.Class({
    extends: cc.Component,

    properties: {

        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        // 摩擦系数
        friction: 0,
        // 跳跃音效资源
        jumpAudio: {
            default: null,
            url: cc.AudioClip
        },
        //控制左右移动按钮
        btnLeft: {
            default: null,
            type: cc.Button
        },
        btnRight: {
            default: null,
            type: cc.Button
        },
        btnShoot: {
            default: null,
            type: cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction();
        //this.node.runAction(this.jumpAction);

        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        // 方向, 0:左, 1:右
        this.direction = 0;

        // 初始化键盘输入监听
        this.setInputControl();
    },

    start() {

    },

    update(dt) {

        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 应用摩擦系数
        if (this.xSpeed > 0) {
            this.xSpeed -= this.friction * dt
            this.xSpeed = Math.max(0, this.xSpeed)
        } else if (this.xSpeed < 0) {
            this.xSpeed += this.friction * dt
            this.xSpeed = Math.min(0, this.xSpeed)
        }
        
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;

    },

    shoot () {
        let enemies = GameManager.instance.getAllEnemies();
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            // 注意这里目前使用的是bounding box而不是collider，用世界坐标系判断
            let a1 = this.node.parent.convertToWorldSpace(this.node.position);
            let newX = this.direction == 0 ? this.node.x - 1000 : this.node.x + 1000;
            let newY = this.node.y + 1000;
            let a2 = this.node.parent.convertToWorldSpace(cc.v2(newX, newY));
            let rect = enemy.getBoundingBoxToWorld();
            if (cc.Intersection.lineRect(a1, a2, rect)) {
                GameManager.instance.killEnemy(enemy);
            }
        }
    },

    setJumpAction: function () {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    },

    playJumpSound: function () {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    setInputControl: function () {
        var self = this;

        //监听屏幕上两个按钮
        self.btnLeft.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.accLeft = true;
            self.direction = 0;
        });
        self.btnLeft.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // self.accLeft = false;
        });
        self.btnLeft.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.accLeft = false;
        });
        self.btnRight.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.accRight = true;
            self.direction = 1;
        });
        self.btnRight.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // self.accRight = false;
        });
        self.btnRight.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.accRight = false;
        });
        self.btnShoot.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.shoot();
        });
    },

});
