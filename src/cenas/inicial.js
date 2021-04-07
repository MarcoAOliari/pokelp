import Phaser from 'phaser';

class Inicial extends Phaser.Scene {
    constructor() {
        super();

        this.config_frase = {
            color: 'white',
            fontFamily: 'Joystix',
            fontSize: 12
        };
    }

    preload() {
        this.load.path = "src/assets/";
        this.load.image('fundo_inicial', 'backgrounds/inicial.png');
        this.load.image('jogar', 'outros/start.png');
        this.load.image('z', 'outros/z.png');
        this.load.image('x', 'outros/x.png');
        this.load.image('setas', 'outros/setas.png');
        this.load.audio('abertura', 'sons/opening.mp3');
        this.load.audio('ok', 'sons/select.ogg');
    }

    create() {
        this.inicial = this.add.image(0, 0, 'fundo_inicial').setOrigin(0, 0);        
        
        /* Música do jogo */
        if (this.sound.context.state === 'suspended')
            this.sound.context.resume();
        this.musica = this.sound.add('abertura', {loop: true, volume: 0.1});
        this.musica.play();

        /* Criando textos */
        this.criarPressEnter();
        this.criarTitulo();
        this.comoJogar();

        /* Associa a tecla z com a função para trocar a cena */
        this.input.keyboard.on('keydown-Z', () => {
            this.sound.play('ok', {volume: 0.2});
            this.batalhar();
        });
    }

    criarPressEnter() {
        this.jogar = this.add.image(0, 600, 'jogar').setOrigin(0, 1);

        /* Efeito - PRESS ENTER */
        this.tweens.add({
            targets: this.jogar,
            alpha: 0,
            ease: 'Cubic.easeIn',
            duration: 500,
            repeat: -1,
            yoyo: true
        })
    }

    criarTitulo() {
        this.titulo_subindo = false;

        this.titulo = this.add.text(
            400, 200,
            'POKEMON BATTLE SYSTEM', {
                fontFamily: 'Pokemon',
                fontSize: '42px',
                color: '#fefefe',
                strokeThickness: 2,
                stroke: 'black'
            }
        ).setOrigin(.5, .5);
    }

    batalhar() {
        let pokemons = {
            jogador: 'zapdos',
            inimigo: 'charizard'
        };
        
        this.scene.transition({
            target: 'Selecao',
            data: this.musica,
            duration: 0
        });
    }

    animarTitulo() {
        if (this.titulo_subindo) {
            this.titulo.y -= 0.3;
            if (this.titulo.y <= 200)
                this.titulo_subindo = false;
        } else {
            this.titulo.y += 0.2;
            if (this.titulo.y >= 220)
                this.titulo_subindo = true;
        }
    }

    comoJogar() {
        this.add.image(10, 10, 'setas').setOrigin(0, 0).setScale(.5);
        this.add.image(17, 40, 'z').setOrigin(0, 0).setScale(.5);
        this.add.image(17, 70, 'x').setOrigin(0, 0).setScale(.5);

        this.frase = this.add.text(
            60,
            12,
            'Mover',
            this.config_frase
        );
        this.frase = this.add.text(
            60,
            42,
            'Confirmar',
            this.config_frase
        );
        this.frase = this.add.text(
            60,
            72,
            'Voltar',
            this.config_frase
        );
    }

    update() {
        this.animarTitulo();
    }
}

export default Inicial;