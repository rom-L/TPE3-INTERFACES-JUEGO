import { BlastAttack } from "./BlastAttack.js";
import { Frieza } from "./Frieza.js";
import { KienzanAttack } from "./KienzanAttack.js";
import { TransformPowerUp } from "./TransformPowerUp.js";
import { DragonBall } from "./DragonBall.js";
import { SenzuBean } from "./SenzuBean.js";
import { Clock } from "./Clock.js";

export class ObjectPool {
    constructor() {
        this.pool = []; 
        this.maxSize = 25;
    }


    populatePool() {
        //defino las opciones de objetos que hay disponibles
        const OPTIONS = [];

        OPTIONS.push(new BlastAttack());
        OPTIONS.push(new Frieza());
        OPTIONS.push(new KienzanAttack());
        OPTIONS.push(new TransformPowerUp());
        OPTIONS.push(new DragonBall());
        OPTIONS.push(new SenzuBean());
        OPTIONS.push(new Clock());

        
        //recorro el arreglo de opciones para agarrar el atributo 'rarity' de cada objeto
        for (let i = 0; i < OPTIONS.length; i++) {
            const GAME_OBJECT = OPTIONS[i];
            const TYPE = GAME_OBJECT.getType();

            //recorro las veces que sean necesarias dependiendo de la rarity del objeto para añadir objetos al pool
            for (let j = 0; j < GAME_OBJECT.getRarity(); j++) {     
                switch (TYPE) {
                    case "BlastAttack":
                        this.returnObjectToPool(new BlastAttack());
                        break;
                    case "Frieza":
                        this.returnObjectToPool(new Frieza());
                        break;
                    case "KienzanAttack":
                        this.returnObjectToPool(new KienzanAttack());
                        break;
                    case "TransformPowerUp":
                        this.returnObjectToPool(new TransformPowerUp());
                        break;
                    case "DragonBall":
                        this.returnObjectToPool(new DragonBall());
                        break;
                    case "SenzuBean":
                        this.returnObjectToPool(new SenzuBean());
                        break;
                    case "Clock":
                        this.returnObjectToPool(new Clock());
                        break;
                }

            }
        }
    }

    // Función para tomar un objeto del pool
    obtainObject() {
        if (this.pool.length > 0) {
            //consigue un elemento random del pool y lo devuelve
            const RANDOM_INDEX = Math.floor(Math.random() * this.pool.length);
            const ELEM = this.pool[RANDOM_INDEX];

            this.pool.splice(RANDOM_INDEX, 1);
            return ELEM;
        }

        //si no hay objetos disponibles en el pool, se llena la pool
        this.populatePool();
        return this.obtainObject();    //se retorna un objeto random de la pool llamando a esta funcion
    }

    // Función para devolver un objeto al pool
    returnObjectToPool(object) {
        if (this.pool.length < this.maxSize) {
            // Si el pool no ha alcanzado su tamaño máximo, devolver el objeto al pool
            this.pool.push(object);
        }
    }
}