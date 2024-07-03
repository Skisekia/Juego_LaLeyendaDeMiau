class Game_Over extends Phaser.Scene {
    constructor() {
        super({ key: 'Game_Over' });
    }

    create() {
        // Fondo negro
        this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.5).setOrigin(0);

        // Texto de Game Over
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'GAME OVER', {
            font: '48px Arial',
            fill: '#ff0000'
        }).setOrigin(0.5);

        // Texto para reiniciar
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 60, 'Presionar Enter para reiniciar', {
            font: '24px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // ENTER para reiniciar
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('Menu');  // Asegúrate de que 'Menu' es el key de tu escena del menú principal.
        });
    }
}