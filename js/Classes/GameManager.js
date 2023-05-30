import { AudioManager } from "./AudioManager.js";
import { Character } from "./Character.js";
import { ObjectPool } from "./ObjectPool.js";
import { Parallax } from "./Parallax.js";

export class GameManager {      //SINGLETON (solo puede existir una instancia del objeto en tiempo de ejecucion)
    static instance = null;

    constructor() {
        if (GameManager.instance) {     //si ya existe la instancia de un objeto GameManager retorna esa instancia
            return GameManager.instance;
        }

        GameManager.instance = this;    //si no existe una instancia, pasa por aca y crea una; Le da a la variable estatica de la clase la instancia actual



        this.character = new Character();
        this.objectPool = new ObjectPool();
        this.audioManager = new AudioManager();
        this.parallax = new Parallax();
        this.lives = 3;
        this.score = 0;
        this.time = 30;     //se mide en segundos
        this.maxScore = 7;
        this.transformationTime = 0;        //tiempo de duracion de la transformacion en segundos
        this.objectsInGame = [];    //aca se almacenan los objetos que se estan mostrando en el juego
        
        
        //FLAGS y auxiliares
        this.wonFlag = false;
        this.lostFlag = false;
        this.upKeyPressed = false;
        this.downKeyPressed = false;
        this.objectRecentlySpawned = false;
        this.timerTimeoutFlag = false;
        this.transformTimeoutFlag = false;
        this.hurtCooldownFlag = false;
        this.timerElem = document.querySelector("#timer");
        this.lifeCounterElem = document.querySelector("#life-counter");
        this.DB_counter_elem = document.querySelector("#DB-counter");
        this.transformationTimerElem = document.querySelector(".transformation-timer");

        //rangos en el que el jugador puede volar
        this.maxTop = 80;
        this.minTop = 480;



        //por defecto inicia la musica
        this.audioManager.music.play();
        //por defecto inicia el parallax
        this.parallax.start();
        //por defecto hace correr al character
        this.character.run();
    }
    

    static destroyInstance() {  //metodo static para la clase para destruir la instancia ya que es singleton
        GameManager.instance = null;
    }

    static getInstance() {
        return GameManager.instance;
    }

    //-------

    getLives() {
        return this.lives;
    }

    getScore() {
        return this.score;
    }

    getTime() {
        return this.time;
    }

    decreaseLives() {
        if (this.lives > 0) {
            this.lives -= 1;
        }
    }

    increaseLives() {
        if (this.lives > 0) {
            this.lives += 1; 
        }
    }

    decreaseScoreBy(number) {
        if (this.score >= number) {     //se hace para no ir a score negativo
            this.score -= number;
        } else {
            this.score = 0;
        }
    }

    increaseScore() {
        if (this.score < this.maxScore) {
            this.score += 1;
        }
    }

    decreaseTime() {
        this.time -= 1;
    }

    increaseTime() {
        this.time += 7;
    }

    decreaseTransformationTime() {
        this.transformationTime -= 1;
    }

    increaseTransformationTime() {
        this.transformationTime += 8;
    }

    getWonFlag() {
        return this.wonFlag;
    }

    getLostFlag() {
        return this.lostFlag;
    }
 



    process_user_input() {
        document.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "Space":
                    if (this.character.getCurrentState() == "running") {
                        this.audioManager.jumpSound.play();
                        this.character.jump();
                    }
                    break;
                case "KeyF":
                    this.character.fly();
                    break;
                case "KeyW":
                    this.upKeyPressed = true;
                    break;
                case "KeyS":
                    this.downKeyPressed = true;
                    break;
            }
        });

        document.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "KeyW":
                    this.upKeyPressed = false;
                    break;
                case "KeyS":
                    this.downKeyPressed = false;
                    break;
            }
        });
    }

    update_status() {
        const CURRENT_TOP_POSITION = parseInt(this.character.status().top);     //consigue el valor en entero de la posicion 'top' actual del personaje

        //---------CHEQUEOS PARA VOLAR---------
        if (this.character.getCurrentState() == "flying") {
            //si el jugador esta dentro de los rangos de altura establecidos, puede volar
            if (this.upKeyPressed && CURRENT_TOP_POSITION > this.maxTop) {
                this.character.flyUp(CURRENT_TOP_POSITION);
            } else if (this.downKeyPressed && CURRENT_TOP_POSITION < this.minTop) {
                this.character.flyDown(CURRENT_TOP_POSITION);
            }

            //si el jugador vuela dentro de este rango pasa a correr, ya que toco el suelo
            if (CURRENT_TOP_POSITION <= this.minTop && CURRENT_TOP_POSITION >= this.minTop - 40) {
                this.character.run();
            }
        }


        //---------CONTADOR DEL TIEMPO---------
        if (!this.timerTimeoutFlag) {
            this.timerTimeoutFlag = true;
            this.decreaseTime();

            setTimeout((e) => {
                this.timerTimeoutFlag = false;
            }, 1000);
        }


        //---------CHEQUEO DE TRANSFORMACION---------
        if (this.character.isTransformed()) {
            if (this.transformationTimerElem.classList.contains("hidden")) {    //timer para mostrar tiempo de duracion de la transformacion
                this.transformationTimerElem.classList.remove("hidden");
            }

            if (!this.transformTimeoutFlag) {
                if (this.transformationTime > 0) {
                    this.decreaseTransformationTime();
                    this.transformTimeoutFlag = true;
                    
                    setTimeout((e) => {
                        this.transformTimeoutFlag = false;
                    }, 1000);
                    

                    if (this.transformationTime == 0) {     //si se agota el tiempo de transformacion el jugador se destransforma
                        this.character.untransform();
                        this.transformationTimerElem.classList.add("hidden");
                    }
                }
            }
        }
        

        //---------SPAWNEO DE GAME OBJECTS---------
        if (!this.objectRecentlySpawned) {      //si no se spawneo un objeto recientemente, spawnea uno
            const OBJECT = this.objectPool.obtainObject();
            OBJECT.spawn();
            this.objectsInGame.push(OBJECT);    //se añade al array de objects in game el game object actual

            this.objectRecentlySpawned = true;

            setTimeout((e) => {
                this.objectRecentlySpawned = false;
            }, 700);
        }


        //---------CHEQUEO ESTADO DE GAME OBJECTS IN-GAME Y COLISION CON JUGADOR---------
        for (let i = 0; i < this.objectsInGame.length; i++) {
            const GAME_OBJECT = this.objectsInGame[i];
            
            if (!GAME_OBJECT.getIsInDOM()) {       //si el game object ya no esta mas en el DOM significa que se elimino, por lo que se le devuelve el object al pool
                this.objectsInGame.splice(i, 1);
                this.objectPool.returnObjectToPool(GAME_OBJECT);
            } else {
                const CHARACTER_STATUS = this.character.status();
                const GAME_OBJECT_STATUS = GAME_OBJECT.status();

                if (this.characterHitObject(CHARACTER_STATUS, GAME_OBJECT_STATUS) == true) {    //si el objeto colisiono con el character
                    GAME_OBJECT.execute(this.character);    //ejecuta la accion sobre el character dependiendo del objeto

                    switch (GAME_OBJECT.getType()) {    //se comprueba que tipo de objeto colisiono y se toma una accion dependiendo del tipo(teniendo en cuenta si esta transformado y el cooldown del hurt)
                        case "BlastAttack":
                            if (!this.character.isTransformed()) {
                                if (!this.hurtCooldownFlag) {
                                    this.audioManager.hitSound.play();

                                    this.decreaseLives();
                                    this.decreaseScoreBy(Math.floor(Math.random() * 2) + 1);
    
                                    this.hurtCooldownFlag = true;
    
    
                                    setTimeout((e) => {
                                        this.hurtCooldownFlag = false;
                                    }, 1400);
                                }
                            }
                            break;
                        case "Frieza":
                            if (!this.character.isTransformed()) {
                                if (!this.hurtCooldownFlag) {
                                    this.audioManager.hitSound.play();

                                    this.decreaseLives();
                                    this.decreaseScoreBy(Math.floor(Math.random() * 2) + 1);
    
                                    this.hurtCooldownFlag = true;
    
    
                                    setTimeout((e) => {
                                        this.hurtCooldownFlag = false;
                                    }, 1400);
                                }
                            }
                            break;
                        case "KienzanAttack":
                            if (!this.character.isTransformed()) {
                                if (!this.hurtCooldownFlag) {
                                    this.audioManager.hitSound.play();

                                    this.decreaseLives();
                                    this.decreaseScoreBy(Math.floor(Math.random() * 2) + 1);
    
                                    this.hurtCooldownFlag = true;
    
    
                                    setTimeout((e) => {
                                        this.hurtCooldownFlag = false;
                                    }, 1400);
                                }
                            }
                            break;
                        case "TransformPowerUp":
                            this.audioManager.transformSound.play();
                            this.increaseTransformationTime();
                            break;
                        case "DragonBall":
                            this.audioManager.pickupSound.play();
                            this.increaseScore();
                            break;
                        case "SenzuBean":
                            this.audioManager.senzuSound.play();
                            this.increaseLives();
                            break;
                        case "Clock":
                            this.audioManager.pickupSound.play();
                            this.increaseTime();
                            break;
                    }
                }
            }
        }
        

        //---------CHEQUEOS PARA FINALIZAR EL JUEGO---------
        if (this.time == 0 || this.lives == 0) {        //PIERDE
            this.character.die();
            this.parallax.stop();
            this.audioManager.music.pause();
            this.audioManager.loseSound.play();

            setTimeout((e) => {
                this.lostFlag = true;
            }, 1300);
        } else if (this.score == 7) {       //GANA
            this.character.win();
            this.parallax.stop();
            this.audioManager.music.pause();
            this.audioManager.winSound.play();

            setTimeout((e) => {
                this.wonFlag = true;
            }, 1300);
        }
    }

    render() {
        //convierte los segundos a Date
        const DATE = new Date(this.time * 1000);
        const MINUTES = DATE.getMinutes();
        const SECONDS = DATE.getSeconds();
        const FORMATTED_TIME = `${MINUTES.toString().padStart(2, '0')}:${SECONDS.toString().padStart(2, '0')}`;
        this.timerElem.textContent = FORMATTED_TIME;

        this.DB_counter_elem.textContent = "x " + this.score;
        this.lifeCounterElem.textContent = "x " + this.lives;
        this.transformationTimerElem.textContent = this.transformationTime;
    }


    characterHitObject(characterStatus, gameObjectStatus) {
        if (this.character.getCurrentState() === "jumping") {   //SI ESTA SALTANDO ignoro los bordes del character para la colision (lo hago para que parezca que de verdad lo salta y esquiva)
            const BORDER_WIDTH = 50;    //representa cuanto width de los borders quiero ignorar en la colision

            //se calculan las posiciones teniendo en cuenta el border width que se quiere ignorar
            const CHARACTER_LEFT = characterStatus.left + BORDER_WIDTH;
            const CHARACTER_RIGHT = characterStatus.right - BORDER_WIDTH;
            const CHARACTER_TOP = characterStatus.top + BORDER_WIDTH;
            const CHARACTER_BOTTOM = characterStatus.bottom - BORDER_WIDTH;
    
            //chequea si hay colisiones excluyendo los bordes
            if (
                CHARACTER_LEFT < gameObjectStatus.right &&
                CHARACTER_RIGHT > gameObjectStatus.left &&
                CHARACTER_TOP < gameObjectStatus.bottom &&
                CHARACTER_BOTTOM > gameObjectStatus.top
            ) {
                return true;
            }
        } else {
            //chequea colision normal
            if (
                characterStatus.left < gameObjectStatus.right &&
                characterStatus.right > gameObjectStatus.left &&
                characterStatus.top < gameObjectStatus.bottom &&
                characterStatus.bottom > gameObjectStatus.top
            ) {
                return true
            }
        }

        return false;
    }
}