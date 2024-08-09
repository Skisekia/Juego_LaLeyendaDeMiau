class Win extends Phaser.Scene {
    constructor() {
        super({ key: 'Win' });
    }

    preload() {
        this.load.image('winBackground', 'Assets/Menu/Win.png');
    }

    init(data) {
        this.gameTime = data.time;
    }

    create() {
        this.background = this.add.image(0, 0, 'winBackground').setOrigin(0).setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        this.add.text(this.sys.game.config.width / 2, 240, '¡Has ganado!', { fontSize: '48px', fontFamily: 'MedievalSharp', fill: '#fff', backgroundColor: 'rgba(0,0,0,0.7)' }).setOrigin(0.5);
        this.add.text(this.sys.game.config.width / 2, 280, `Escapaste en: ${this.gameTime} segundos`, { fontSize: '20px', fontFamily: 'MedievalSharp', fill: '#fff', backgroundColor: 'rgba(0,0,0,0.7)' }).setOrigin(0.5);
        this.add.text(this.sys.game.config.width / 2, 380, 'Presiona ENTER para guardar tu tiempo', { fontSize: '20px', fill: '#fff', fontFamily: 'MedievalSharp', backgroundColor: 'rgba(0,0,0,0.7)' }).setOrigin(0.5);

        // Mostrar un marcador de posición
        this.placeholderText = this.add.text(this.sys.game.config.width / 2, 320, 'Ingresa tu nombre aquí...', { fontSize: '24px', fontFamily: 'MedievalSharp', fill: '#888', backgroundColor: 'rgba(0,0,0,0.8)' }).setOrigin(0.5);
        this.userNameText = this.add.text(this.sys.game.config.width / 2, 320, '', { fontSize: '24px', fontFamily: 'MedievalSharp', fill: '#fff', backgroundColor: 'rgba(0,0,0,0.8)' }).setOrigin(0.5);
        this.userName = '';

        this.input.keyboard.on('keydown', (event) => {
            if (event.keyCode === 13) { // ENTER key
                if (this.userName.trim().length === 0) {
                    this.showErrorMessage('Por favor, ingresa tu nombre para continuar.');
                } else if (this.isProfane(this.userName)) {
                    this.showErrorMessage('Por favor, ingresa un nombre apropiado.');
                } else {
                    this.saveGameData(this.userName, this.gameTime);
                    this.scene.start('Menu');
                }
            } else if (event.keyCode === 8 && this.userName.length > 0) { // BACKSPACE key
                this.userName = this.userName.substr(0, this.userName.length - 1);
            } else if (event.key.match(/^[a-zA-Z0-9]$/) && this.userName.length < 16) { // Alphanumeric keys
                this.userName += event.key;
            }

            if (this.userName.length > 0) {
                this.placeholderText.setVisible(false);
            } else {
                this.placeholderText.setVisible(true);
            }
            this.userNameText.setText(this.userName);
        });
    }

    isProfane(name) {
        const profaneWords = ['Palabra11']; 
        return profaneWords.some(word => name.toLowerCase().includes(word));
    }
    //guardar
    saveGameData(username, time) {
        const transaction = db.transaction(['JuegoData'], 'readwrite');
        const objectStore = transaction.objectStore('JuegoData');
        const data = { username: username, time: time, date: new Date().toISOString() };

        const request = objectStore.add(data);
        request.onsuccess = () => console.log('Data saved to the database.');
        request.onerror = event => console.error('Database error: ' + event.target.errorCode);
    }

    showErrorMessage(message) {
        if (this.errorMsg) this.errorMsg.destroy(); // Elimina el mensaje de error anterior si existe
        this.errorMsg = this.add.text(this.sys.game.config.width / 2, 350, message, { fontSize: '16px', fontFamily: 'MedievalSharp', fill: '#ff0000', backgroundColor: 'rgba(0,0,0,0.9)' }).setOrigin(0.5);
        this.time.delayedCall(2000, () => {
            if (this.errorMsg) {
                this.errorMsg.destroy();
                this.errorMsg = null;
            }
        });
    }
}