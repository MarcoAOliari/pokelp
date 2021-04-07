import Pokemon from '../pokemon';
import Phaser from 'phaser';

export default class Batalha extends Phaser.Scene {
    constructor() {
        super();
        this.msg = 0;
    }

    preload() {
        /* Carregando imagens */
        this.load.path = "src/assets/";
        this.load.image('fundo', 'backgrounds/batalha.png');
        this.load.image('hud', 'batalha/text_bar.png');
        this.load.image('inimigo', 'batalha/inimigo.png');
        this.load.image('base_i', 'batalha/base_inimigo.png');
        this.load.image('base_j', 'batalha/base_jogador.png');
        this.load.image('pokebola_aberta', 'batalha/pokebola_aberta.png');
        this.load.image('hud_j', 'batalha/hud_jogador.png');
        this.load.image('hud_i', 'batalha/hud_inimigo.png');

        /* */
        this.load.pack('pokemons', '../jsons/recursos.json');
        
        /* Carregando sprites */
        this.load.spritesheet('jogador', 'batalha/jogador.png', {
            frameWidth: 250,
            frameHeight: 250
        }); 
        this.load.spritesheet('pokebola', 'batalha/pokebola.png', {
            frameWidth: 50,
            frameHeight: 100
        });
        this.load.spritesheet('vida', 'batalha/barra.png', {
            frameWidth: 150,
            frameHeight: 10
        });
        
        /* */
        this.load.audio('ok', 'sons/select.ogg');
        this.load.audio('batalha', 'sons/battle.mp3');
        this.load.audio('pokebola', 'sons/ball.ogg');
        this.load.audio('lancar', 'sons/throw.ogg');
    }

    create(pokemons) {
        /* Música */
        if (this.sound.context.state === 'suspended')
            this.sound.context.resume();
        this.musica = this.sound.add('batalha', {loop: true, volume: 0.1});
        this.musica.play();

        /* Desenha as imagens */
        this.add.image(0, 0, 'fundo').setOrigin(0, 0);
        this.add.image(0, 450, 'hud').setOrigin(0, 0);
        
        /* Faz as curvas */
        this.caminho_hj = new Phaser.Curves.Line({x:800, y:300}, {x:400, y:300});
        this.caminho_hi = new Phaser.Curves.Line({x:0, y:30}, {x:350, y:30});
        this.caminho_ej = new Phaser.Curves.Line({x:800, y:325}, {x:120, y:325});
        this.caminho_ei = new Phaser.Curves.Line({x:-100, y:200}, {x:600, y:200});
        this.caminho_si = new Phaser.Curves.Line({x:600, y:200}, {x:900, y:200});
        this.caminho_sj = new Phaser.Curves.Line({x:120, y:325}, {x:-300, y:325});
        this.caminho_pb = new Phaser.Curves.QuadraticBezier(
            {x: 20, y: 400}, 
            {x: 150, y: 230},
            {x: 260, y: 430}
        );

        /* Adiciona os objetos */
        this.base_j = this.add.follower(this.caminho_ej, 900, 400, 'base_j');
        this.base_i = this.add.follower(this.caminho_ei, -100, 230, 'base_i');
        this.jogador = this.add.follower(this.caminho_ej, 900, 325, 'jogador');
        this.inimigo = this.add.follower(this.caminho_ei, -100, 150, 'inimigo');
        this.hud_i = this.add.follower(this.caminho_hi, 0, 30, 'hud_i');
        this.hud_j = this.add.follower(this.caminho_hj, 800, 300, 'hud_j');
        
        this.barra_jogador = this.add.sprite(800, 360, 'vida', 0);
        this.barra_inimigo = this.add.sprite(0, 94, 'vida', 0);
        this.barra_inimigo.displayWidth = 156; 
        this.barra_inimigo.displayHeight = 11;
        this.barra_jogador.displayHeight = 11;

        this.hud_j.setOrigin(0, 0);
        this.hud_i.setOrigin(1, 0);
        this.barra_jogador.setOrigin(1, 0);
        this.barra_inimigo.setOrigin(1, 0);

        /* Inicia as animações */
        this.jogador.startFollow({duration: 800});
        this.base_j.startFollow({duration: 800});
        this.inimigo.startFollow({duration: 800});
        this.base_i.startFollow({duration: 800});

        /* */
        this.esperar(820);
        this.z = this.input.keyboard.addKey('Z');

        /* */
        this.pokemon_j = new Pokemon(this, true, pokemons.jogador);
        this.pokemon_i = new Pokemon(this, false, pokemons.inimigo);
        this.pokemon_i.create();
        this.pokemon_j.create();

        /* */
        this.gerarAnimacoes();
        this.gerarTextos();
    }

    gerarAnimacoes() {
        this.anims.create({
            key: 'lancar',
            frameRate: 10,
            repeat: 0,
            frames: this.anims.generateFrameNumbers(
                'jogador', {
                    start: 0,
                    end: 4,
                    first: 0
                })
        });
        this.anims.create({
            key: 'rodar',
            frameRate: 15,
            repeat: 0,
            frames: this.anims.generateFrameNumbers(
                'pokebola', {
                    start: 0,
                    end: 7,
                    first: 0
                })
        });
    }

    esperar(delay) {
        this.input.keyboard.enabled = false;
        this.time.addEvent({
            delay: delay,
            callback: () => this.escrever()
        });
    }

    escrever() {
        let mensagens = [
            'Um inimigo gostaria de batalhar!',
            `Seu inimigo enviou um ${this.pokemon_i.nome}!`,
            `Vai! ${this.pokemon_j.nome}!`
        ];

        this.texto = this.add.text(40, 480, mensagens[this.msg++], {
            fontFamily: 'Joystix',
            color: '#303030',
            fontSize: '20px'
        });

        this.input.keyboard.enabled = true;
    }

    desenharPokemon(pokemon) {
        let imagem = this.add.image(pokemon.x, pokemon.y, pokemon.chave);
        imagem.setOrigin(0, 1).setScale(0.2);

        this.tweens.add({
            targets: imagem,
            scale: 1,
            y: pokemon.y,
            x: pokemon.x - 100,
            ease: 'Power1',
            duration: 800,
        });

        imagem.tint = 0xff0000;
        setTimeout(_ => imagem.clearTint(), 800);
    }

    entrarInimigo() {
        let pokebola = this.add.image(600, 220, 'pokebola_aberta');
        this.sound.play('pokebola', {volume: 0.2});
        this.inimigo.setPath(this.caminho_si).startFollow({duration: 800});
        setTimeout(() => {
            this.desenharPokemon(this.pokemon_i);
            this.hud_i.startFollow({duration: 800, positionOnPath: true});
        }, 500);
        this.time.addEvent({delay: 800, callback: () => pokebola.destroy()});
    }

    entrarJogador() {
        this.jogador.setPath(this.caminho_sj).startFollow({duration: 800});
        this.jogador.play('lancar');

        setTimeout(() => {
            let pokebola = this.add.follower(this.caminho_pb, 20, 400, 'pokebola');
            pokebola.startFollow({duration: 500}).play('rodar');
            this.sound.play('lancar', {volume: 0.2});
            setTimeout(() => this.sound.play('pokebola', {volume: 0.2}), 500);
            this.time.addEvent({delay: 800, callback: () => pokebola.destroy()});
            this.hud_j.startFollow({duration: 800, positionOnPath: true});
        }, 300);

        this.jogador
        setTimeout(() => this.desenharPokemon(this.pokemon_j), 800);
    }

    gerarTextos() {
        this.nome_inimigo = this.add.text(
            0, // x
            45, // y
            this.pokemon_i.nome, {
                color: 'black',
                fontFamily: 'Pokemon',
                fontSize: 30
            }
        );
        this.nome_jogador = this.add.text(
            0, // x
            315, // y
            this.pokemon_j.nome, {
                color: 'black',
                fontFamily: 'Pokemon',
                fontSize: 30
            }
        );
        this.hp_jogador = this.add.text(
            0, // x
            392, // y
            this.pokemon_j.textoVida(), {
                color: 'black',
                fontFamily: 'Pokemon',
                fontSize: 25
            }
        ).setOrigin(.5, .5);
    }

    update() {
        if (this.z.isDown) {
            if (this.msg === 1) {
                this.entrarInimigo();
                this.esperar(1300);

            } else if (this.msg === 2) {
                this.entrarJogador();
                this.esperar(1600);

            } else if (this.msg === 3) {
                this.scene.start('Batalha', {
                    jogador: this.pokemon_j,
                    inimigo: this.pokemon_i,
                    musica: this.musica
                });
            }

            this.sound.play('ok', {volume: 0.2});
            this.texto.destroy();
            this.z.isDown = false;
        }

        this.nome_inimigo.x = this.hud_i.x - 270;
        this.nome_jogador.x = this.hud_j.x + 60;
        this.hp_jogador.x = this.hud_j.x + 270;
        this.barra_jogador.x = this.hud_j.x + 359;
        this.barra_inimigo.x = this.hud_i.x - 74;
    }
}