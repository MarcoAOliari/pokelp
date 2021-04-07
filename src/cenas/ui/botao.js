import Phaser from 'phaser';

export default class Botao extends Phaser.GameObjects.Sprite {
    constructor(frame, cena, nome, x, y, clicado) {
        super(cena, 0, 0, nome, frame);
        this.x = x;
        this.y = y;
        this.cena = cena;
        this.spritePadrao = frame;
        this.spriteFoco = frame + 1;
        this.clicado = clicado;
        this.ativo = false;
    }

    desenhar() {
        this.setOrigin(0, 0);
        this.cena.add.existing(this);
        this.setDepth(1);
    }

    redefinir() {
        this.ativo = false;
        this.setFrame(this.spritePadrao);
    }

    foco() {
        this.ativo = true;
        this.setFrame(this.spriteFoco);
    }

    funcao() {
        this.clicado();
    }
}