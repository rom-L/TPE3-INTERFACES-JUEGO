export class Character {
    constructor() {
        this.character = document.querySelector("#goku");
        this.transformed = false;
        this.currentState = "none";

        //FLAGS
        this.hurtCooldownFlag = false;
    }


    status() {  //Sirve para saber donde esta localizado el elemento en el DOM para manejar la colision
        return this.character.getBoundingClientRect();
    }

    getCurrentState() {
        return this.currentState;
    }

    getHurtCooldownFlag() {
        return this.hurtCooldownFlag;
    }

    isTransformed() {
        return this.transformed;
    }
    
    untransform() {
        this.transformed = false;

        if (this.currentState == "flying") {        //el personaje vuelve a la normalidad visulmente
            this.character.style.backgroundImage = 'url("../img/sprites/Goku_fly.png")'; 
        } else if (this.currentState == "jumping") {
            this.character.style.backgroundImage = 'url("../img/sprites/Goku_jump.png")';
        } else if (this.currentState == "running") {
            this.character.style.backgroundImage = 'url("../img/sprites/Goku_run.png")';
        }
    }

    run() {
        this.clean();
        
        this.currentState = "running";

        //le doy un tamaño al personaje
        this.character.style.height = '190px';
        this.character.style.width = '170px';
        this.character.style.top = '440px';
        this.character.style.left = '60px';

        if (!this.transformed) {
            this.character.style.backgroundImage = 'url("../img/sprites/Goku_run.png")';
        } else {
            this.character.style.backgroundImage = 'url("../img/sprites/GokuGod_run.png")';
        }

        this.character.classList.add("run");
    }

    jump() {
        if (this.currentState == "running") {       //si esta corriendo puede saltar
            this.clean();
    
            this.currentState = "jumping";
    
            if (!this.transformed) {
                this.character.style.backgroundImage = 'url("../img/sprites/Goku_jump.png")';
            } else {
                this.character.style.backgroundImage = 'url("../img/sprites/GokuGod_jump.png")';
            }
    
            this.character.classList.add("jump");
    
    
    
            const switchToRun = (e) => {
                this.run();     //regresa a correr
                this.character.removeEventListener("animationend", switchToRun);    //se le remueve el evento porque ya termino la animacion
            }
    
            this.character.addEventListener("animationend", switchToRun);   //cuando termina de saltar vuelve a correr
        }
    }

    transform() {       
        if (!this.transformed) {
            this.clean();
    
            this.currentState = "transforming";
            this.transformed = true;
    
            //le tengo que cambiar las dimensiones para que el personaje parezca que tiene el mismo tamaño que cuando corre
            this.character.style.height = '270px';
            this.character.style.width = '210px';
            this.character.style.top = '360px';
            this.character.style.left = '35px';
            this.character.style.backgroundImage = 'url("../img/sprites/Goku_transform.png")';
    
            this.character.classList.add("transform");
    
    
    
            const switchToRun = (e) => {
                this.run();     //regresa a correr
                this.character.removeEventListener("animationend", switchToRun);    //se le remueve el evento porque ya termino la animacion
            }
    
            this.character.addEventListener("animationend", switchToRun);   //cuando termina de transformarse vuelve a correr
        }
    }

    hurt() {
        if (!this.hurtCooldownFlag) {       //FLAG PARA EL COOLDOWN DEL HURT (para que no te spameen pegando)

            this.hurtCooldownFlag = true;

            if (!this.transformed) {    //si no esta transformado el personaje puede recibir daño
                if (this.currentState == "running") {       //SI ESTA CORRIENDO
                    this.clean()
            
                    this.currentState = "hurt";
            
                    //le tengo que cambiar las dimensiones para que el personaje parezca que tiene el mismo tamaño que cuando corre
                    this.character.style.height = '180px';
                    this.character.style.top = '450px';
                    this.character.style.left = '25px';
                    this.character.style.backgroundImage = 'url("../img/sprites/Goku_hurt.png")';
            
                    this.character.classList.add("hurt");
            
            
                    const switchToRun = (e) => {
                        this.run();     //regresa a correr
                        this.character.removeEventListener("animationend", switchToRun);    //se le remueve el evento porque ya termino la animacion
                    }
            
                    this.character.addEventListener("animationend", switchToRun);   //cuando termina de transformarse vuelve a correr
                }
                
                
                if (this.currentState == "jumping") {      //SI ESTA VOLANDO O SALTANDO
                    this.character.classList.add("hurt");
                } else if (this.currentState == "flying") {
                    this.character.classList.remove("fly");
                    this.character.classList.add("flyAndHurt");
    
    
                    const giveFlyAnimation = (e) => {
                        this.character.classList.remove("flyAndHurt");
                        this.character.classList.add("fly");
                        this.character.removeEventListener("animationend", giveFlyAnimation);    //se le remueve el evento porque ya termino la animacion
                    }
            
                    this.character.addEventListener("animationend", giveFlyAnimation);   //cuando termina de transformarse vuelve a volar
                }
            } 


            //COOLDOWN DE HURT
            setTimeout((e) => {
                this.hurtCooldownFlag = false;
            }, 1400);
        }
    }

    fly() {
        if (this.currentState == "running") {
            this.clean();
    
            this.currentState = "flying";
    
            //le tengo que cambiar las dimensiones para que el personaje parezca que tiene el mismo tamaño que cuando corre
            this.character.style.height = '140px';
            this.character.style.width = '180px';
            this.character.style.top = '360px';
            this.character.style.left = '25px';

            if (!this.transformed) {
                this.character.style.backgroundImage = 'url("../img/sprites/Goku_fly.png")'; 
            } else {
                this.character.style.backgroundImage = 'url("../img/sprites/GokuGod_fly.png")';
            }
    
            this.character.classList.add("fly");
        }
    }

    flyUp(topPosition) {
        if (this.currentState == "flying") {
            this.character.style.top = topPosition - 7 + "px";
        }
    }

    flyDown(topPosition) {
        if (this.currentState == "flying") {
            this.character.style.top = topPosition + 7 + "px";
        }
    }

    die() {
        this.clean();

        this.currentState = "dead";

        //le tengo que cambiar las dimensiones para que el personaje parezca que tiene el mismo tamaño que cuando corre
        this.character.style.height = '110px';
        this.character.style.width = '210px';
        this.character.style.top = '540px';
        this.character.style.left = '10px';
        this.character.style.backgroundImage = 'url("../img/sprites/Goku_dead.png")'; 
    }

    win() {
        this.clean();

        this.currentState = "won";

        //le tengo que cambiar las dimensiones para que el personaje parezca que tiene el mismo tamaño que cuando corre
        this.character.style.height = '200px';
        this.character.style.width = '130px';
        this.character.style.top = '430px';
        this.character.style.left = '80px';
        this.character.style.backgroundImage = 'url("../img/sprites/Goku_win.png")'; 
    }



    clean() {
        this.character.className = '';      //limpia todas las clases que tenga el character
    }
}