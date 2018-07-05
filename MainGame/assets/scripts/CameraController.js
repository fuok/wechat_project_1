let GameConfig = require('GameConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        },
        camera: cc.Camera
    },

    // use this for initialization
    onLoad: function () {
    },

    onEnable: function () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
        cc.director.getCollisionManager().attachDebugDrawToCamera(this.camera);
    },
    onDisable: function () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
        cc.director.getCollisionManager().detachDebugDrawFromCamera(this.camera);
    },

    start () {
        this.resetCameraToTarget();
    },

    resetCameraToCenter() {
        this.node.position = cc.Vec2.ZERO;
    },

    resetCameraToTarget() {
        let targetPos = this.getBoundTargetPos();
        this.node.position = targetPos;
    },

    moveCamera(pos) {
        let action = cc.moveTo(2, pos);
        action.easing(cc.easeExponentialOut());
        this.node.runAction(action);
    },

    moveCameraToCenter() {
        this.moveCamera(cc.Vec2.ZERO);
    },

    moveCameraToTarget() {
        this.moveCamera(this.getBoundTargetPos());
    },

    getBoundTargetPos() {
        let targetPos = this.target.position;
        let rootNode = this.parent;
        let minX = -GameConfig.DEVICE_WIDTH / 2;
        let maxX = GameConfig.DEVICE_WIDTH / 2;
        let minY = -200;
        let maxY = GameConfig.DEVICE_HEIGHT / 2;
        let boundaryX = 240;
        let boundaryY = 50;
        targetPos.x = Math.min(Math.max(targetPos.x, minX + boundaryX), maxX - boundaryX);
        targetPos.y = Math.min(Math.max(targetPos.y, minY + boundaryY), maxY - boundaryY);
        return targetPos;
    },

    updateZoomRatio () {
        let maxZoom = 3;
        let zoomLevel = maxZoom - (this.node.position.y - this.target.position.y) * 0.01;
        zoomLevel = Math.min(Math.max(zoomLevel, 1), maxZoom);
        this.camera.zoomRatio = zoomLevel;
    },
    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        this.updateZoomRatio();
    },

    shakeCamera () {
        if (!this.canShake) return;
        this.anim.play('shake');
        this.scheduleOnce(this.stopShake.bind(this), this.shakeDuration);
    },

    stopShake () {
        this.anim.stop();
        this.camera.node.position = cc.p(0, 0);
    }
});