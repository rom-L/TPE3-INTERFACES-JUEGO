export class Parallax {
    constructor() {
        this.cloudLonely = document.querySelector("#cloud-lonely");
        this.farClouds = document.querySelector("#far-clouds");
        this.nearClouds = document.querySelector("#near-clouds");
        this.farMountains = document.querySelector("#far-mountains");
        this.mountains = document.querySelector("#mountains");
        this.trees = document.querySelector("#trees");
        this.grass = document.querySelector("#grass");
    }


    start() {
        this.cloudLonely.classList.add("cloud-lonely-parallax");
        this.farClouds.classList.add("far-clouds-parallax");
        this.nearClouds.classList.add("near-clouds-parallax");
        this.farMountains.classList.add("far-mountains-parallax");
        this.mountains.classList.add("mountains-parallax");
        this.trees.classList.add("trees-parallax");
        this.grass.classList.add("grass-parallax");
    }

    stop() {
        this.cloudLonely.classList.remove("cloud-lonely-parallax");
        this.farClouds.classList.remove("far-clouds-parallax");
        this.nearClouds.classList.remove("near-clouds-parallax");
        this.farMountains.classList.remove("far-mountains-parallax");
        this.mountains.classList.remove("mountains-parallax");
        this.trees.classList.remove("trees-parallax");
        this.grass.classList.remove("grass-parallax");
    }
}