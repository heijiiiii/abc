let particles = [];
let snowflakes = [];
let messages = ["감사합니다!", "Thank you", "ありがとう", "谢谢"];
let currentMessageIndex = 0;
let showMessage = true;
let thankSound;
let lastFireworkTime = 0;
let fireworkInterval = 2000;
let shapes = ["♥", "★", "●"];
let fontSize = 48;

function preload() {
  soundFormats('mp3');
  thankSound = loadSound('assets/thankyou.mp3', () => {}, () => {
    console.warn('사운드 파일 로드 실패');
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(fontSize);
  fill(255);
}

function draw() {
  background(11, 27, 43, 50);

  // 눈 내리는 효과
  if (frameCount % 5 === 0) {
    snowflakes.push(new Snowflake());
  }
  for (let flake of snowflakes) {
    flake.update();
    flake.display();
  }
  snowflakes = snowflakes.filter(flake => !flake.offScreen());

  // 파티클 업데이트 및 표시
  for (let p of particles) {
    p.update();
    p.show();
  }
  particles = particles.filter(p => !p.finished());

  // 자동 폭죽 추가
  if (millis() - lastFireworkTime > fireworkInterval) {
    let randX = random(width);
    let randY = random(height / 2, height);
    let shape = random(shapes);
    createExplosion(randX, randY, shape);
    lastFireworkTime = millis();
  }
}

// 마우스를 클릭하면 글자 폭죽 + 사운드
function mousePressed() {
  if (thankSound && !thankSound.isPlaying()) {
    thankSound.play();
  }

  let msg = messages[currentMessageIndex];
  fireworkText(msg, mouseX, mouseY);
  currentMessageIndex = (currentMessageIndex + 1) % messages.length;
}

// 글자 기반 파티클 생성
function fireworkText(str, x, y) {
  textSize(fontSize);
  let gap = 10;
  for (let i = 0; i < str.length; i++) {
    let px = x + (i - str.length / 2) * (fontSize + gap);
    let py = y;
    let col = getColorByLang(str);
    particles.push(new FireworkParticle(px, py, str[i], col));
  }
}

// 언어별 색상
function getColorByLang(text) {
  if (text.includes("감사")) return color(255, 204, 0);
  if (text.includes("Thank")) return color(102, 178, 255);
  if (text.includes("ありがとう")) return color(255, 153, 204);
  if (text.includes("谢谢")) return color(153, 255, 153);
  return color(255);
}

// 일반 불꽃 생성
function createExplosion(x, y, shape) {
  let total = 20;
  for (let i = 0; i < total; i++) {
    let angle = TWO_PI / total * i;
    let speed = random(1, 3);
    let vx = cos(angle) * speed;
    let vy = sin(angle) * speed;
    let col = color(random(100, 255), random(100, 255), random(100, 255));
    particles.push(new ShapeParticle(x, y, vx, vy, shape, col));
  }
}

class FireworkParticle {
  constructor(x, y, letter, col) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-2, -5));
    this.acc = createVector(0, 0.05);
    this.lifetime = 255;
    this.letter = letter;
    this.col = col;
  }

  finished() {
    return this.lifetime < 0;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifetime -= 2;
  }

  show() {
    fill(this.col.levels[0], this.col.levels[1], this.col.levels[2], this.lifetime);
    text(this.letter, this.pos.x, this.pos.y);
  }
}

class ShapeParticle {
  constructor(x, y, vx, vy, shape, col) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0.02);
    this.lifetime = 255;
    this.shape = shape;
    this.col = col;
  }

  finished() {
    return this.lifetime < 0;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifetime -= 3;
  }

  show() {
    fill(this.col.levels[0], this.col.levels[1], this.col.levels[2], this.lifetime);
    text(this.shape, this.pos.x, this.pos.y);
  }
}

class Snowflake {
  constructor() {
    this.pos = createVector(random(width), 0);
    this.vel = createVector(random(-0.5, 0.5), random(1, 2));
    this.acc = createVector(0, 0);
    this.size = random(2, 5);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  display() {
    noStroke();
    fill(255, 200);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  offScreen() {
    return this.pos.y > height;
  }
}
