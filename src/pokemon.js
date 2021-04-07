import Phaser from 'phaser';
import Ataque from './ataque';

export default class Pokemon {
    constructor(cena, escolha, nome) {
        this.nome = nome;
        this.cena = cena;
        this.costas = escolha;
    }

    create() {
        let ataques = this.cena.cache.json.get('ataques');
        let json = this.cena.cache.json.get(`${this.nome}`);

        this.nome = json.name.english;
        this.hp = json.base.HP;
        this.hpmax = json.base.HP;
        this.id_pokemon = json.id;
        this.ataques = [
            new Ataque(ataques[json.attacks[0]]),
            new Ataque(ataques[json.attacks[1]]),
            new Ataque(ataques[json.attacks[2]]),
            new Ataque(ataques[json.attacks[3]]),
        ];

        if (this.costas) {
            this.chave = `${this.nome.toLowerCase()}_costas`;
            this.x = json.coordinates.back.x;
            this.y = json.coordinates.back.y;
        } else {
            this.chave = `${this.nome.toLowerCase()}_frente`;
            this.x = json.coordinates.front.x;
            this.y = json.coordinates.front.y;
        }
    }

    textoVida() {
        return `${this.hp} / ${this.hpmax}`;
    }

    atacar(id_ataque, pokemon) {
        if (this.ataques[id_ataque].ataqueUtilizado()) {
            if (pokemon.hp - this.ataques[id_ataque].dano >= 0) {
                pokemon.hp -= this.ataques[id_ataque].dano;
            } else {
                pokemon.hp = 0;
            }
        }
    }

    morto() {
        return this.hp <= 0;
    }
}