class Jugador extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'parado1');  // Inicia al personaje con la posicion Parado
        this.scene.add.existing(this);  // Añade al personaje a la escena actual
        this.scene.physics.world.enable(this);  // Habilita las fisicas al personaje
        this.body.setCollideWorldBounds(false);  // Quita limites para que el personaje pueda caminar por todo el mapa
        this.body.setSize(10, 23);  
        this.createAnimations();  // Funciuon para las animaciones
    }

    
   // Se crean las animacion en base a las imagenes
   createAnimations() {
    this.scene.anims.create({
        key: 'parado',
        frames: [
            { key: 'parado1' },
            { key: 'parado2' },
            { key: 'parado3' },
            { key: 'parado4' },
            { key: 'parado5' },
            { key: 'parado6' },
            { key: 'parado7' },
            { key: 'parado8' }
        ],
        frameRate: 10,  // Velocidad a la que cambian los frames.
        repeat: -1  // Hace que la animación se repita infinitamente.
    });

    this.scene.anims.create({
        key: 'brincar',
        frames: [
            { key: 'brincar1' },
            { key: 'brincar2' },
            { key: 'brincar3' },
            { key: 'brincar4' }
        ],
        frameRate: 10,
        repeat: 0
    });

    this.scene.anims.create({
        key: 'caer',
        frames: [
            { key: 'caer1' },
            { key: 'caer2' },
            { key: 'caer3' },
            { key: 'caer4' }
        ],
        frameRate: 10,
        repeat: 0
    });

    this.scene.anims.create({
        key: 'correr',
        frames: [
            { key: 'correr1' },
            { key: 'correr2' },
            { key: 'correr3' },
            { key: 'correr4' },
            { key: 'correr5' },
            { key: 'correr6' },
            { key: 'correr7' },
            { key: 'correr8' },
            { key: 'correr9' },
            { key: 'correr10' }
        ],
        frameRate: 15,
        repeat: -1
    });

    this.play('parado');  // Inicia con la animación 'parado'.
}

update(cursors) {
    // Movimiento del personaje en base a las teclas
    if (cursors.left.isDown) {
        this.body.setVelocityX(-160);  // Mueve al jugador a la izquierda
        this.play('correr', true);  // Reproduce la animación de correr
        this.flipX = true;  // Voltea la imagen del sprite horizontalmente
    } else if (cursors.right.isDown) {
        this.body.setVelocityX(160);  // Mueve al jugador a la derecha
        this.play('correr', true);
        this.flipX = false;
    } else {
        this.body.setVelocityX(0);  // Detiene el movimiento horizontal del jugador
        this.play('parado', true);  // Reproduce la animación de estar parado
    }

    // Gestiona el salto y caída del personaje basado en su posición vertical y si está tocando el suelo
    if (cursors.space.isDown && this.body.onFloor()) {
        this.body.setVelocityY(-220);  // Aplica una fuerza hacia arriba para saltar
        this.play('brincar');  // Reproduce la animación de saltar
    }

    // Cambia a la animación de caer si el jugador está en el aire y moviéndose hacia abajo
    if (!this.body.onFloor()) {
        if (this.body.velocity.y > 0) {
            this.play('caer', true);  // Reproduce la animación de caer
        } else {
            this.play('brincar', true);  // Continúa la animación de saltar si aún está subiendo
        }
    }
}
}