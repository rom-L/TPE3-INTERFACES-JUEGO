"use strict";

import { GameManager } from './Classes/GameManager.js';

const MAIN_MENU = document.querySelector(".main-menu");
const INSTRUCTIONS_MENU = document.querySelector(".instructions-menu");
const WIN_MENU = document.querySelector(".win-menu");
const LOSE_MENU = document.querySelector(".lose-menu");

const PLAY_BUTTON = document.querySelectorAll(".play-option");
const INSTRUCTIONS_BUTTON = document.querySelector(".instructions-option");
const MENU_BUTTON = document.querySelectorAll(".back-to-menu-option");

let buttonSound = new Audio();
buttonSound.src = "../sound/option.mp3";
let menuBoxSound = new Audio();
menuBoxSound.src = "../sound/menu-box.mp3";

let gameManager = null;     //es null por default ya que todavia no esta jugando
let in_game = false;


//----------------EVENTOS------------------

INSTRUCTIONS_BUTTON.addEventListener("click", function(e) {
    hideMenus();
    INSTRUCTIONS_MENU.classList.remove("hidden");

    buttonSound.play();
});

for (const button of MENU_BUTTON) {
    button.addEventListener("click", function(e) {
        hideMenus();
        MAIN_MENU.classList.remove("hidden");

        buttonSound.play();
    });
}

for (const button of PLAY_BUTTON) {
    button.addEventListener("click", function(e) {
        hideMenus();

        in_game = true;
        runGame();

        buttonSound.play();
    });
}



//----

//----------GAMELOOP----------
function runGame() {
    if (in_game) {
        gameManager = new GameManager();
    
        gameManager.process_user_input();

        
        //se ejecuta el gameloop
        gameLoop();
    }
}

function gameLoop() {       
    console.log('Bucle en ejecucion.');

    if (!gameManager.getWonFlag() && !gameManager.getLostFlag()) {      //siempre chequea si el jugador no gano o perdio en el juego antes de updatear status (si sigue vivo dentro del GameManager), si no, destruye la instancia
        gameManager.update_status();
        gameManager.render();
    } else {    //SI PERDIO O GANO
        if (gameManager.getWonFlag()) {     //SI GANO
            WIN_MENU.classList.remove("hidden");
        } else if (gameManager.getLostFlag()) {     //SI PERDIO
            LOSE_MENU.classList.remove("hidden");
        }
        
        menuBoxSound.play();

        //se destruye la instancia singleton, in_game pasa a falso
        GameManager.destroyInstance();
        gameManager = null;
        in_game = false;
    }

    
    if (in_game) {
        requestAnimationFrame(gameLoop);
    }
}

//------

function hideMenus() {
    MAIN_MENU.classList.add("hidden");
    INSTRUCTIONS_MENU.classList.add("hidden");
    WIN_MENU.classList.add("hidden");
    LOSE_MENU.classList.add("hidden");
}



