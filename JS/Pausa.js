class Pausa extends Phaser.Scene {
    constructor() {
        super({ key: 'Pausa' });
    }

    create() {
        // Crea un rectángulo gris que cubra toda la pantalla
        this.graphics = this.add.graphics({ fillStyle: { color: 0x808080, alpha: 0.5 } });
        this.graphics.fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height);

        // Agrega texto de pausa
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 50, 'PAUSA', { fontSize: '40px', fontFamily: 'MedievalSharp',fill: '#ffffff' }).setOrigin(0.5);

        // Opción para reanudar
        const resumeText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'Continuar', { fontSize: '32px', fontFamily: 'MedievalSharp',fill: '#ffffff' })
            .setInteractive()
            .setOrigin(0.5);
        resumeText.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('Mundo1');
        });

        // Opción para volver al menú
        const menuText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 50, 'Volver al menú', { fontSize: '32px', fontFamily: 'MedievalSharp', fill: '#ff0000' })
            .setInteractive()
            .setOrigin(0.5);
        menuText.on('pointerdown', () => {
            this.scene.stop('Mundo1'); // Asegúrate de detener la escena del juego antes de cambiar
            this.scene.start('Menu');
        });

        // Configura la interacción para reanudar el juego con tecla P
        this.input.keyboard.once('keydown-P', () => {
            this.scene.stop();
            this.scene.resume('Mundo1');
        });
    }
}