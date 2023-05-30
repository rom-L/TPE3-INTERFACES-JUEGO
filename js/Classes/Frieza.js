import { GameObject } from "./GameObject.js";

export class Frieza extends GameObject{
    constructor() {
        super("Frieza", 6);

        //llamo al metodo del padre para añadir posiciones 'top' que puede spawnear este objeto
        this.addSpawnPosition(500);
        this.addSpawnPosition(280);
        this.addSpawnPosition(100);
    }


    spawn() {
        this.gameContainerElem.appendChild(this.gameObjectElem);
        this.isInDOM = true;
        this.gameObjectElem.classList.add("friezaGameObject");
        this.gameObjectElem.style.top = this.getRandomSpawnPosition() + "px";   //le damos un spawn position 'top'

        
        const removeObjectFromDOM = (e) => {
            if (this.gameContainerElem.contains(this.gameObjectElem)) {     //chequea si el elemento padre tiene al game object generado para evitar errores
                this.gameContainerElem.removeChild(this.gameObjectElem);    //remueve al object del DOM
                this.isInDOM = false;
            }

            this.gameObjectElem.removeEventListener("animationend", removeObjectFromDOM);
        }

        this.gameObjectElem.addEventListener("animationend", removeObjectFromDOM);       //cuando el gameObject termina la animacion de ir para la izquierda desaparece
    }

    execute(character) {        //esto ocurre si el jugador toca al gameObject
        if (!character.isTransformed()) {
            if (!character.getHurtCooldownFlag()) {     //COOLDOWN HURT
                character.hurt();    //si el objeto toca al jugador, se lastima ya que es un enemigo
                this.gameContainerElem.removeChild(this.gameObjectElem);    //lo borra del DOM
                this.isInDOM = false;
            }
        }
    }
}