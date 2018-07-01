let GameManager = require('GameManager')
let EnemyManager = require('EnemyManager')
let BrickManager = require('BrickManager')

const PlayerState = {
    Idle: 0,
    Running: 1,
    Shooting: 2,
    Dead: 3
};

const PlayerDirection = {
    Left: 0,
    Right: 1,
};

cc.Class({
    extends: cc.Component,

    properties: {
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        // 摩擦系数
        friction: 0,
        direction: {
            get () {
                return this.playerDirection;
            },
            set (value) {
                if (this.playerDirection != value) {
                    this.playerDirection = value;
                    if (this.playerDirection == PlayerDirection.Left) {
                        this.node.scaleX = -Math.abs(this.node.scaleX);
                    } else {
                        this.node.scaleX = Math.abs(this.node.scaleX);
                    }
                }
            }
        },
        state: {
            get () {
                return this.playerState;
            },
            set (value) {
                if (this.playerState != value) {
                    this.playerState = value;
                    switch (this.playerState) {
                        case PlayerState.Idle:
                            this.getComponent(cc.Animation).play('idle');
                            break;
                        case PlayerState.Running:
                            this.getComponent(cc.Animation).play('run');
                            break;
                        case PlayerState.Shooting:
                            this.getComponent(cc.Animation).play('shoot');
                            break;
                        case PlayerState.Dead:
                            this.getComponent(cc.Animation).play('die');
                            break;
                    };
                }
            }
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
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        // 初始状态：idle
        this.state = PlayerState.Idle;
        // 方向, 0:左, 1:右
        this.direction = PlayerDirection.Right;

        // 初始化键盘输入监听
        this.setInputControl();
    },

    start() {
        this.xSpeed = 0;
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
        if (this.xSpeed == 0 && this.state == PlayerState.Running) {
            this.state = PlayerState.Idle;
        }
        
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        let newPosX = this.node.x + this.xSpeed * dt;
        let halfBrickSize = BrickManager.instance.brickSize / 2;
        // 判断地板砖块是否允许移动
        if (BrickManager.instance.isPosXWalkable(newPosX + halfBrickSize) &&
            BrickManager.instance.isPosXWalkable(newPosX - halfBrickSize)) {
            this.node.x += this.xSpeed * dt;
        }
    },

    shoot () {
        let enemies = EnemyManager.instance.getAllEnemies();
        for (let i = 0; i < enemies.length; i++) {
            let enemyNode = enemies[i];
            // 注意这里目前使用的是bounding box而不是collider，用世界坐标系判断
            let a1 = this.node.parent.convertToWorldSpace(this.node.position);
            let newX = this.direction == PlayerDirection.Left ? this.node.x - 1000 : this.node.x + 1000;
            let newY = this.node.y + 1000;
            let a2 = this.node.parent.convertToWorldSpace(cc.v2(newX, newY));
            let rect = enemyNode.getBoundingBoxToWorld();
            if (cc.Intersection.lineRect(a1, a2, rect)) {
                enemyNode.getComponent('Enemy').onHitByBullet();
            }
        }
    },

    shootingAnimComplete () {
        this.state = PlayerState.Idle;
    },

    dieAnimComplete () {
        GameManager.instance.gameOver();
    },

    onCollisionEnter (other) {
        if (other.node.group == 'enemy') {
            this.state = PlayerState.Dead;
        }
    },

    setInputControl: function () {
        var self = this;

        //监听屏幕上两个按钮
        self.btnLeft.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (!self.accRight) {
                self.accLeft = true;
                self.state = PlayerState.Running;
                self.direction = PlayerDirection.Left;
            }
        });
        self.btnLeft.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.accLeft = false;
        });
        self.btnRight.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (!self.accLeft) {
                self.accRight = true;
                self.state = PlayerState.Running;
                self.direction = PlayerDirection.Right;
            }
        });
        self.btnRight.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.accRight = false;
        });
        self.btnShoot.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.state = PlayerState.Shooting;
            self.shoot();
        });
    },

});
