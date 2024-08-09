class Game_Over extends Phaser.Scene {
    constructor() {
        super({ key: 'Game_Over' });
    }

    preload() {
        this.load.image('LostBackground', 'Assets/Menu/Lost.png');
    }

    create() {
        // Fondo negro
        this.background = this.add.image(0, 0, 'LostBackground').setOrigin(0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Texto de Game Over
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'GAME OVER', {
            fontSize: '58px',
            fontFamily: 'MedievalSharp',
            fill: '#ff0000',
            backgroundColor: 'rgba(0,0,0,0.8)'
        }).setOrigin(0.5);

        // Texto para reiniciar
        this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 60, 'Presionar Enter para reiniciar', {
            fontSize: '24px',
            fontFamily: 'MedievalSharp',
            fill: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.8)'
        }).setOrigin(0.5);

        // ENTER para reiniciar
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('Menu');  // Asegúrate de que 'Menu' es el key de tu escena del menú principal.
        });
    }
}