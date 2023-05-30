export class GameObject {
    constructor(type, rarity) {
        this.type = type;
        this.rarity = rarity;       //representa la cantidad de un mismo objeto que puede estar en la ObjectPool
        this.spawnPositions = [];      //el objeto puede aparecer en estas posiciones de 'top'     **NOTA: EL ARRAY CONTIENE VALORES DE POSITION TOP**
        this.isInDOM = false;   //FLAG para saber si el objeto esta insertado en el DOM
        this.gameContainerElem = document.querySelector(".game-container");

        this.gameObjectElem = document.createElement("div");    //crea un elemento div por cada gameObject pero todavia no lo inserta
    }
    

    getType() {
        return this.type;
    }

    getRarity() {
        return this.rarity;
    }

    getIsInDOM() {     //retorna si el objeto esta en el DOM o no
        return this.isInDOM;
    }

    status() {
        return this.gameObjectElem.getBoundingClientRect();
    }

    spawn() {
        return; //ABSTRACTA| Spawnea al objeto en el juego
    }

    execute(character) {
        return; //ABSTRACTA| Toma accion en el jugador dependiendo del objeto
    }

    addSpawnPosition(number) {
        this.spawnPositions.push(number);
    }

    getRandomSpawnPosition() {
        const RANDOM_INDEX = Math.floor(Math.random() * this.spawnPositions.length);

        return this.spawnPositions[RANDOM_INDEX];
    }
}