import { GameObject } from "./GameObject.js";

export class Clock extends GameObject{
    constructor() {
        super("Clock", 4);

        //llamo al metodo del padre para añadir posiciones 'top' que puede spawnear este objeto
        this.addSpawnPosition(565);
        this.addSpawnPosition(320);
        this.addSpawnPosition(200);
    }


    spawn() {
        this.gameContainerElem.appendChild(this.gameObjectElem);
        this.isInDOM = true;
        this.gameObjectElem.classList.add("clockGameObject");
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
        this.gameContainerElem.removeChild(this.gameObjectElem);    //lo borra del DOM ya que tiene que desaparecer porque el jugador lo agarro
        this.isInDOM = false;
    }
}