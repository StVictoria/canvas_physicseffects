const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
adjustX = 0; //to move text on the canvas area (to the right, top etc.)
adjustY = 0;

//handle mouse
const mouse = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener("mousemove", function (e) {
  mouse.x = e.x;
  mouse.y = e.y;
});

ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("WOW", 0, 30);

const textCoordinates = ctx.getImageData(0, 0, 100, 100);
console.log("textCoordinates", textCoordinates.data);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
  }
  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath(); //because we need to create circle. think of it as pencil touching down on canvas to start drawing
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy); // there is built-in method to calculate such distance
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

function init() {
  particleArray = [];
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        particleArray.push(new Particle(positionX * 20, positionY * 20));
      }
    }
  }

  //for random dots rendering
  //   for (let i = 0; i < 2000; i++) {
  //     let x = Math.random() * canvas.width;
  //     let y = Math.random() * canvas.height;
  //     particleArray.push(new Particle(x, y));
  //   }
}

init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].draw();
    particleArray[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}
animate();

//cycle through the arrayof particles that make upour letter and measure dictance between each particle. if the are close enough we will take coordinates of the first particle and we draw the line to the coordinates of the second particle.
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particleArray.length; a++) {
    for (let b = a; b < particleArray.length; b++) {
      let dx = particleArray[a].x - particleArray[b].x;
      let dy = particleArray[a].y - particleArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 30) {
        opacityValue = 1 - distance / 30;
        ctx.strokeStyle = "rgba(255,255,255," + opacityValue + ")";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particleArray[a].x, particleArray[a].y);
        ctx.lineTo(particleArray[b].x, particleArray[b].y);
        ctx.stroke();
      }
    }
  }
}
