class Bat extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'batIdle0');
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setGravityY(0);
        this.body.setCollideWorldBounds(false);
        this.createAnimations();
        this.play('batIdle');
        this.body.setImmovable(true);
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'batIdle',
            frames: [
                { key: 'batIdle0' },
                { key: 'batIdle1' },
                { key: 'batIdle2' },
                { key: 'batIdle3' }
            ],
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'batDeath',
            frames: [
                { key: 'batDeath0' },
                { key: 'batDeath1' },
                { key: 'batDeath2' },
                { key: 'batDeath3' },
                { key: 'batDeath4' }
            ],
            frameRate: 10,
            repeat: 0
        });
    }

    move() {
        // Simula el movimiento del murciélago aquí
        this.body.velocity.x = this.speed;
        this.play('batIdle', true);

        // Invierte la dirección al final del timer
        this.moveTimer.reset({
            delay: 2000,
            callback: () => {
                this.speed = -this.speed;
                this.body.velocity.x = this.speed;
            },
            callbackScope: this,
            loop: true
        });
    }

    die() {
        this.play('batDeath');
        this.body.velocity.x = 0;

        // Elimina al murciélago después de la animación de muerte
        this.scene.time.delayedCall(1000, () => {
            this.destroy();
        }, null, this);
    }
}