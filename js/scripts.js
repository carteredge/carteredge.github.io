const churns = "#chimney-1, #chimney-2, #gear, #gear-shadow, #infinity";
const puffs = "#cloud-1, #cloud-2, #cloud-3";

class Doodler {
    static colorNames = [
        "black", 
        "red", 
        "yellow", 
        "green", 
        "cyan", 
        "blue", 
        "magenta", 
    ];

    static randomColor() {
        return Doodler.colorNames[Doodler.randomInt(Doodler.colorNames.length)];
    }
    
    static randomInt(n) {
        return Math.floor(Math.random() * n);
    }
    
    constructor(canvas) {
        
        this.canvas = canvas;
        this.mousedown = {x: undefined, y: undefined};

        if (!this.canvas)
            console.warn("Doodler canvas either not provided or not found.");

        this.doodle = this.doodle.bind(this);
        this.penDraw = this.penDraw.bind(this);
        document.addEventListener("mousedown", this.doodle);
        document.addEventListener("mouseup", this.doodle);
        document.addEventListener("mousemove", (event) => {
			this.currentMouse = this.convertCoordinates(event.clientX, event.clientY, this.canvas);
		});
        document.addEventListener("touchstart", this.doodle);
        document.addEventListener("touchend", this.doodle);
        document.addEventListener("touchmove", (event) => {
            this.currentMouse = this.convertCoordinates(event.touches[0]?.clientX, event.touches[0]?.clientY);
        });
    }

    set canvas(c) {
        if (typeof c === "string")
            c = document.getElementById(c);
        this._canvas = c;
        this.canvasContext = c?.getContext("2d");
		if (this.canvasContext)
            this.canvasContext.lineWidth = 1;
    }

    get canvas() {
        return this._canvas;
    }

    convertCoordinates(x, y, element) {
        element = element || this.canvas;
        const rect = element.getBoundingClientRect();
        return {
            x: x - rect.left,
            y: y - rect.top
        }
    }

    doodle(event) {
        let x, y;
        switch (event.type) {
            case "mousedown":
            case "mouseup":
                x = event.clientX;
                y = event.clientY;
                break;
            case "touchstart":
                x = event.touches?.[0]?.clientX;
                y = event.touches?.[0]?.clientY;
                break;
            case "touchend":
                x = this.currentMouse.x;
                y = this.currentMouse.y;
                break;
        }
        if (this.canvasContext) {
            if (event.type === "mousedown" || event.type === "touchstart") {
                if (this.isInBox(x, y)) {
                    this.mousedown = {x, y};
                    this.currentMouse = {x, y};
                    this.previousMouse = {x, y};
                    this.canvasContext.strokeStyle = Doodler.randomColor();
                    clearInterval(this.penInterval);
                    this.penInterval = setInterval(this.penDraw, 10);
                }
            } else {
                if (this.mousedown.x !== undefined) {
                    clearInterval(this.penInterval);
                }
            }
            event.stopPropagation();
        }
    }

    isInBox(x, y, element) {
        element = element || this.canvas;
        const rect = element.getBoundingClientRect();
        return x > rect.left &&
            x < rect.right &&
            y > rect.top &&
            y < rect.bottom;
    }
    
    penDraw() {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(this.previousMouse.x, this.previousMouse.y);
        this.canvasContext.lineTo(this.currentMouse.x, this.currentMouse.y);
        this.canvasContext.stroke();
        this.previousMouse = {
            x: this.currentMouse.x,
            y: this.currentMouse.y
        };
    }
}

function startEngineAnimation() {
    theEngine.dataset.animating = 1;
    for (image of theEngine.querySelectorAll(churns))
        image.classList.add("churn");
    for (image of theEngine.querySelectorAll(puffs))
        image.classList.add("puff");
}

function stopEngineAnimation() {
    theEngine.dataset.animating = 0;
    clearTimeout(theEngine.dataset.timeout);
    for (image of theEngine.querySelectorAll(churns))
        image.classList.remove("churn");
    for (image of theEngine.querySelectorAll(puffs))
        image.classList.remove("puff");
}

function engineClick() {
    if (theEngine.dataset.animating === "1") {
        stopEngineAnimation();
    } else {
        startEngineAnimation();
        theEngine.dataset.timeout = setTimeout(stopEngineAnimation, 12000);
    }
}

window.onload = ()=>{
    new Doodler(doodler);
    console.log("Some of the logos on this page are interactive! Check it out!")
}