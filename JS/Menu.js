class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
    }

    preload() {
        // Carga de imágenes 
        this.load.image('backgroundMenu', 'Assets/Menu/backgroundMenu.png');
        this.load.image('title', 'Assets/Menu/Titulo.png');
        this.load.image('enter', 'Assets/Menu/Press_Enter.png');
    }

    create() {
        // Fondo 
        this.background = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'backgroundMenu').setOrigin(0, 0);

        // Título
        this.title = this.add.image(this.sys.game.config.width / 2, 80, 'title').setOrigin(0.5);

        // Botón de empezar 
        this.pressEnter = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height - 60, 'enter').setOrigin(0.5);

        // Animación para hacer parpadear el texto de 'press enter'
        this.time.addEvent({
            delay: 700,
            callback: () => { this.pressEnter.visible = !this.pressEnter.visible; },
            loop: true
        });

        // Iniciar el juego al presionar 'Enter'
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('Mundo1');
        });
    } 
}