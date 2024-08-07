class Slime extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'slimeIdle0');
        this.setOrigin(0.5, 0.5); // Ajusta esto según la necesidad
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(false);
        this.body.setSize(32, 24);
        this.body.setOffset(0, 0); // Ajusta si es necesario
        this.body.setImmovable(true);


        this.createAnimations();
        this.play('slimeIdle');

        this.direction = 'left';
        this.movingDistance = 64;
        this.speed = 50;
        this.moveTimer = this.scene.time.addEvent({
            delay: 2000,
            callback: this.move,
            callbackScope: this,
            loop: true
        });
    }

    createAnimations() {
        this.scene.anims.create({
            key: 'slimeMove',
            frames: [
                { key: 'slimeMove0' },
                { key: 'slimeMove1' },
                { key: 'slimeMove2' },
                { key: 'slimeMove3' }
            ],
            frameRate: 10,
            repeat: -1
        });
    
        this.scene.anims.create({
            key: 'slimeIdle',
            frames: [
                { key: 'slimeIdle0' },
                { key: 'slimeIdle1' },
                { key: 'slimeIdle2' },
                { key: 'slimeIdle3' }
            ],
            frameRate: 5,
            repeat: -1
        });
    
        this.scene.anims.create({
            key: 'slimeDie',
            frames: [
                { key: 'slimeDie0' },
                { key: 'slimeDie1' },
                { key: 'slimeDie2' },
                { key: 'slimeDie3' }
            ],
            frameRate: 10,
            repeat: 0
        });
    }  

    move() {
        if (this.direction === 'left') {
            this.body.velocity.x = -this.speed;
        } else {
            this.body.velocity.x = this.speed;
        }
        this.play('slimeMove', true);
    
        // Cancela cualquier timer existente antes de crear uno nuevo
        if (this.moveTimer) {
            this.moveTimer.remove();
        }
    
        this.moveTimer = this.scene.time.delayedCall(2000, () => {
            // Verifica si el slime aún existe antes de intentar modificar sus propiedades
            if (!this.body || !this.active) return;
    
            this.body.velocity.x = 0;
            this.play('slimeIdle');
            this.direction = this.direction === 'left' ? 'right' : 'left';
        }, null, this);
    }    

    die() {
        // Elimina cualquier temporizador o evento específico vinculado al slime
        if (this.moveTimer) {
            this.moveTimer.remove();
            this.moveTimer = null;
        }
    
        // Detén cualquier animación y movimiento actual
        this.play('slimeDie');
        this.body.velocity.x = 0;
    
        // Asegura la eliminación completa después de la animación de muerte
        this.scene.time.delayedCall(1000, () => {
            this.destroy(); // Elimina completamente el objeto de la escena
        }, null, this);
    }    

    update() {
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.jugador.x, this.scene.jugador.y);
    
        // Reacciona si el jugador está cerca
        if (distanceToPlayer < 100) {
            this.speed = 100; // Aumenta la velocidad si el jugador está cerca
        }
    
        // Cambia la velocidad basado en el estado del juego
        if (this.scene.gameState === 'frenzy') {
            this.speed = 100; // Cambia la velocidad basada en el estado del juego
        }
    
        // Ataca si el jugador está suficientemente cerca y en el suelo
        if (distanceToPlayer < 50 && this.body.onFloor()) {
        }
    }    
}
