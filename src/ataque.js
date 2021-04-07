export default class Ataque {
    constructor(json) {
        this.nome = json.name;
        this.dano = json.damage;
        this.pp = json.pp;
        this.ppmax = json.pp;
        this.tipo = json.type;
    }

    ataqueUtilizado() {
        return (this.pp > 0 ? this.pp-- : false);
    }

    textoPP() {
        return `${this.pp}/${this.ppmax}`
    }
}