class Pausa extends Phaser.Scene {
    constructor() {
        super({ key: 'Pausa' });
    }

    create() {
        // Crea un rectángulo gris que cubra toda la pantalla
        this.graphics = this.add.graphics({ fillStyle: { color: 0x808080, alpha: 0.5 } });
        this.graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // Agrega texto de pausa
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'PAUSA', { fontSize: '40px', fill: '#ffffff' }).setOrigin(0.5);

        // Configura la interacción para reanudar el juego
        this.input.keyboard.once('keydown-P', () => {
            this.scene.stop();
            this.scene.resume('Mundo1');
        });
    }
}