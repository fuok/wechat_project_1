let ScoreManager = require('ScoreManager');
let AudioManager = require('AudioManager');
let BarrageManager = require('BarrageManager');
let GameManager = require('GameManager')
let EnemyManager = require('EnemyManager')
let ParticleManager = require('ParticleManager');
let BrickManager = require('BrickManager')

const PlayerState = {
    Idle: 0,
    Running: 1,
    Shooting: 2,
    NoAmmo: 3,
    Dead: 4
};

const DirectionKeyState = {
    Idle: 0,
    Left: 1,
    Right: 2,
};

const PlayerDirection = {
    Left: 0,
    Right: 1,
};

cc.Class({
    extends: cc.Component,

    properties: {
        // 当前移动速度
        moveSpeed: 0,
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
        onFire: {
            get () {
                return this._onFire;
            }, 
            set (value) {
                if (this._onFire != value) {
                    this._onFire = value;
                    // 节省效率，我们暂时不开启onfire模式
                    this.onFireNode.active = this._onFire;
                }
            }
        },
        state: {
            get () {
                return this.playerState;
            },
            set (value) {
                if (value == PlayerState.Shooting) {
                    // 射击动画会强制取消前边的动画
                    this.playerArmatureDisplay.playAnimation('attack', 1);
                    this.playerState = value;
                } else if (this.playerState != value) {
                    this.playerState = value;
                    switch (this.playerState) {
                        case PlayerState.Idle:
                            this.playerArmatureDisplay.playAnimation('idle', 0);
                            break;
                        case PlayerState.Running:
                            this.playerArmatureDisplay.playAnimation('walk', 0);
                            break;
                        case PlayerState.NoAmmo:
                            this.playerArmatureDisplay.playAnimation('reload', 1);
                            break;
                        case PlayerState.Dead:
                            this.playerArmatureDisplay.playAnimation('dead', 0);
                            break;
                    };
                }
            }
        },
        bulletTraceAnim: {
            default: null,
            type: cc.Animation
        },
        ammoLabel: {
            default: null,
            type: cc.Label
        },
        ammoLabelAnim: {
            default: null,
            type: cc.Animation
        },
        comboNode: {
            default: null,
            type: cc.Node
        },
        onFireNode: {
            default: null,
            type: cc.Node
        },
        comboLabel: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 获得负责动画渲染的子节点
        this.playerArmatureDisplay = this.node.getChildByName('Player Animation').getComponent(dragonBones.ArmatureDisplay);
        this.playerArmatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.playerAnimComplete, this);
        this.inputEnabled = false;
    },

    updatePlayerPos(dt) {
        // 根据当前加速度方向每帧更新速度
        let speed = 0;
        if (this.directionKeyState == DirectionKeyState.Left) {
            speed = -this.moveSpeed;
        } else if (this.directionKeyState == DirectionKeyState.Right) {
            speed = this.moveSpeed;
        } else {
            AudioManager.instance.stopFootstep();
            return;
        }
        // 播放走路的循环音效
        AudioManager.instance.playFootstep();

        // 根据当前速度更新主角的位置
        let newPosX = this.node.x + speed * dt;
        // 判断地板砖块是否允许移动
        if (BrickManager.instance.isPosXWalkable(newPosX) &&
            BrickManager.instance.isPosXWalkable(newPosX)) {
            this.node.x = newPosX;
        }
    },

    update (dt) {
        if (this.state != PlayerState.Shooting) {
            this.updatePlayerPos(dt);
        }
        this.updateAmmoLabelPos();
    },

    reset () {
        // 初始状态：idle
        this.state = PlayerState.Idle;
        // 方向, 0:左, 1:右
        this.direction = PlayerDirection.Left;
        this.node.position.x = 0;
        // 初始化键盘输入监听
        this.inputEnabled = false;
        this.doubleKillCount = 0;
        this.comboCount = 0;
        this.directionKeyState = DirectionKeyState.Idle;
        this.onFire = false;
        this.bulletCount = 0;
    },

    resetLevel () {
        this.moveSpeed = GameManager.instance.curLevel.playerMoveSpeed;
        this.setBulletCount(GameManager.instance.curLevel.bulletCount, true);
    },

    setBulletCount(newCount, reset=false) {
        this.bulletCount = newCount;
        this.ammoLabel.string = newCount;
        if (reset) {
            this.ammoLabelAnim.stop();
            this.ammoLabel.node.scaleX = 1;
            this.ammoLabel.node.scaleY = 1;
            this.ammoLabel.node.color = cc.Color.WHITE;
        } else if (this.bulletCount == 5) {
            this.ammoLabelAnim.play();
        }
    },
    die () {
        this.stopMove();
        this.disableInput();
        this.state = PlayerState.Dead;
        this.onFire = false;
        GameManager.instance.gameOver();
        this.scheduleOnce(this.dieAnimComplete, 1);
    },

    updateAmmoLabelPos () {
        this.ammoLabel.node.x = this.node.x;
        this.ammoLabel.node.y = this.node.y + 150;
    },

    outOfAmmo () {
        this.stopMove();
        this.disableInput();
        this.state = PlayerState.NoAmmo;
        this.onFire = false;
        GameManager.instance.gameOver();
    },

    shoot () {
        if (!this.inputEnabled) {
            return;
        }

        let levelComplete = false;

        // 先把状态设置成shooting
        this.state = PlayerState.Shooting;
        // 减少弹药
        this.setBulletCount(this.bulletCount - 1);
        // 播放弹道动画
        this.bulletTraceAnim.play();
        // 播放音效
        AudioManager.instance.playShoot();

        let enemies = EnemyManager.instance.getAllEnemies();
        let hitCount = 0;
        let hitEnemies = [];
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            // 注意这里目前使用的是bounding box而不是collider，用世界坐标系判断
            let a1 = this.node.parent.convertToWorldSpace(this.node.position);
            let newX = this.direction == PlayerDirection.Left ? this.node.x - 1000 : this.node.x + 1000;
            let newY = this.node.y + 1000;
            let a2 = this.node.parent.convertToWorldSpace(cc.v2(newX, newY));
            let rect = enemy.node.getBoundingBoxToWorld();
            // 我们这里判断两条线，相当于一束有宽度的激光，增加命中率
            let a3 = cc.v2(a1.x, a1.y + 30);
            let a4 = cc.v2(a2.x, a2.y + 30);
            if (cc.Intersection.lineRect(a1, a2, rect) || cc.Intersection.lineRect(a3, a4, rect)) {
                hitEnemies.push(enemy);
            } 
        }
        // 计算分数
        if (hitEnemies.length > 0) {
            // 先播放打碎水果的音效
            AudioManager.instance.playSquashFruit();

            if (hitEnemies.length >= 2) {
                this.doubleKillCount += 1;
                this.comboCount += hitEnemies.length;
                this.comboNode.position = hitEnemies[0].node.position;
                this.comboLabel.string = this.comboCount + "连";
                this.comboNode.getComponent(cc.Animation).play();
                this.onFire = true;
                // tutorial关不显示连击
                if (GameManager.instance.curLevelIndex >= 1) {
                    BarrageManager.instance.addCombo(this.comboCount);
                }
            } else {
                this.doubleKillCount = 0;
                this.comboCount = 0;
                this.onFire = false;
            }
            // let singleEnemyScore = hitEnemies.length * 10;
            let singleEnemyScore = hitEnemies.length >= 2 ? this.comboCount * 10 : 10;
            levelComplete = ScoreManager.instance.gainScore(hitEnemies.length * singleEnemyScore);
            if (this.doubleKillCount >= 2) {
                EnemyManager.instance.slowMotion();
            }
            for (let i = 0; i < hitEnemies.length; i++) {
                ScoreManager.instance.createScoreFX(hitEnemies[i].node.position, singleEnemyScore, this.comboCount);
                hitEnemies[i].onHitByBullet(this.direction);
            }
        } else {
            this.doubleKillCount = 0;
            this.comboCount = 0;
            this.onFire = false;
        }

        if (this.bulletCount <= 0 && !levelComplete) {
            this.outOfAmmo();
        }
    },

    playerAnimComplete() {
        switch (this.state) {
            case PlayerState.Shooting:
                this.shootingAnimComplete();
                break;
            case PlayerState.Dead:
                // 因为当前死亡动画是循环的，就不调用这个
                //this.dieAnimComplete();
                break;
            case PlayerState.NoAmmo:
                this.noAmmoComplete();
                break;
        }
    },

    shootingAnimComplete () {
        this.state = PlayerState.Idle;
        if (this.directionKeyState == DirectionKeyState.Left) {
            this.moveLeft();
        } else if (this.directionKeyState == DirectionKeyState.Right) {
            this.moveRight();
        } else {
            // 什么也不做
        }
    },

    dieAnimComplete () {
        GameManager.instance.showGameOverPanel();
    },

    noAmmoComplete () {
        GameManager.instance.showGameOverPanel();
    },

    onCollisionEnter (other) {
        if (other.node.group == 'enemy') {
            this.die();
        }
    },

    moveLeft () {
        if (!this.inputEnabled) {
            return;
        }

        this.directionKeyState = DirectionKeyState.Left;
        if (this.state != PlayerState.Shooting) {
            this.state = PlayerState.Running;
            this.direction = PlayerDirection.Left;
        }
    },

    moveRight () {
        if (!this.inputEnabled) {
            return;
        }

        this.directionKeyState = DirectionKeyState.Right;
        if (this.state != PlayerState.Shooting) {
            this.state = PlayerState.Running;
            this.direction = PlayerDirection.Right;
        }
    },

    stopMove () {
        if (!this.inputEnabled) {
            return;
        }

        this.directionKeyState = DirectionKeyState.Idle;
        if (this.state != PlayerState.Shooting) {
            this.state = PlayerState.Idle;
        }
    },

    enableInput () {
        this.inputEnabled = true;
    },

    disableInput () {
        this.inputEnabled = false;
    },
});
