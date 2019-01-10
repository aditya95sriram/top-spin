var cnv;

let coins = [];
let settings = {};
settings.rotated_tiles = true;
settings.switch_size = 4;
settings.size = 20;

// visual parameters
let switch_parity = -1;  // either -1 or 1
let coin_rad = 50;
let coin_pad = 20;
let coin_total = coin_rad+coin_pad;
let track_rad = 120;
let font;

// actions
let action_queue = [];

// animation variables
let running = true;
let anim_switch = false;
let anim_slide = false;
let anim_slide_dir = 0;
let anim_delta = 0;
let anim_theta = 0;
settings.slide_rate = 0.07;
settings.switch_rate = 0.25;
settings.default_slide_rate = 0.07;
settings.default_switch_rate = 0.25;
settings.scramble_slide_rate = 0.15;
settings.scramble_switch_rate = 0.3;

// colors
const coin_front = '#fccc01';
const coin_back = '#c9a200';
const bg = 255;
const track = 25;


function mod(n, m) {
  return ((n % m) + m) % m;
}

function Coin(i) {
  this.val = i;
  this.rot = noise(i)*TWO_PI;
  return this;
}

function init() {
  coins = [];
  for (var i=0; i<settings.size; i++) coins.push(new Coin(i+1));
  windowResized();
}

function getcoin(n) {
  return coins[mod(n, settings.size)];
}

function preload() {
  // font = loadFont("fonts/CaliforniaGothic-regular2.otf");
  font = loadFont("fonts/CaliforniaGothic2.ttf");
  // font = loadFont("fonts/SourceSansPro-Regular.otf");
}

function setup() {
  //createCanvas(1300, 640);
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0,0);
  background(bg);
  if (font != undefined) textFont(font);
  textAlign(CENTER, CENTER);
  textSize(coin_rad-15);
  init();
  console.log(width, height);
  translate(width/2, height/2);
}

function windowResized() {
  cnv.resize(windowWidth, windowHeight);
  track_rad = coin_total/(2*sin(HALF_PI/(settings.size/2-settings.switch_size-1)));
  console.log(track_rad,windowHeight,(windowHeight-settings.switch_size*coin_total/2)/2.4);
  if ((windowHeight - (settings.switch_size+1)*coin_total/2) < 2.4*track_rad) {
    track_rad = parseInt((windowHeight - (settings.switch_size+1)*coin_total/2)/2.4);
  }
}

function debug(x, y) {
  fill(255);
  ellipse(x, y, 5);
}

function draw_coin(idx, cx, cy, col) {
  coin = getcoin(idx);
  push();
  translate(cx, cy);
  if (settings.rotated_tiles) rotate(coin.rot);
  fill(coin_back);
  ellipse(0, 0, coin_rad+coin_pad);
  fill(coin_front);
  ellipse(0, 0, coin_rad);
  fill(0);
  text(coin.val, 0, 0);
  pop();
}


function draw_tracks() {
  let size = settings.size, switch_size = settings.switch_size;
  push();
  fill(track);
  noStroke();
  // top segment
  push();
  translate(0, -track_rad);
  rect(-(switch_size+1)*coin_total/2, -coin_total/2, (switch_size+1)*coin_total, coin_total);
  fill('#615587');ellipse(0, 0, switch_size*coin_total);
  if (anim_switch) {
    rotate(anim_theta);
    scale(switch_size/(switch_size+1.2),1);
  }
  fill('#3d3556');ellipse(0, switch_parity*switch_size*coin_total/3, 50);
  fill(track);
  rect(-(switch_size+1)*coin_total/2, -coin_total/2, (switch_size+1)*coin_total, coin_total);
  pop();

  // right arc segment
  push();
  translate(coin_total*(switch_size+1)/2, 0);
  arc(0, 0, 2*track_rad+coin_total, 2*track_rad+coin_total,
      -HALF_PI, HALF_PI);
  fill(bg);
  arc(0, 0, 2*track_rad-coin_total, 2*track_rad-coin_total,
      -HALF_PI, HALF_PI);
  pop();

  // bottom segment
  fill(track);
  push();
  translate(0, track_rad);
  rect(-(switch_size+1)*coin_total/2, -coin_total/2, (switch_size+1)*coin_total, coin_total);
  pop();

  // left arc segment
  push();
  noStroke();
  translate(-coin_total*(switch_size+1)/2, 0);
  arc(0, 0, 2*track_rad+coin_total, 2*track_rad+coin_total,
      HALF_PI, -HALF_PI);
  fill(bg);
  arc(0, 0, 2*track_rad-coin_total, 2*track_rad-coin_total,
      HALF_PI, -HALF_PI);
  pop();
  pop();
}


function draw_coins() {
  let size = settings.size, switch_size = settings.switch_size;
  let cx, v;
  let coin_ctr = 0;
  let right_slide=false, left_slide=false;
  if (anim_slide) {
    if (anim_slide_dir == 1) {
      right_slide = true;
      coin_ctr = -1;
    } else {
      left_slide = true;
    }
  }

  // top segment
  push();
  translate(0, -track_rad);
  if (anim_switch) rotate(anim_theta);
  if (anim_slide) {
    translate(-right_slide*coin_total, 0);
    translate(anim_slide_dir*anim_delta*coin_total, 0);
  }
  cx=-(switch_size-1)*coin_total/2;
  for (var i=0; i<switch_size+anim_slide; i++) {
    draw_coin(coin_ctr++, cx, 0, '#ff000080');
    cx += coin_total;
  }
  pop();

  // right arc segment
  let n = size/2-switch_size;
  let inc = PI/(n-1);
  push();
  translate(coin_total*(switch_size+1)/2, 0);
  if (anim_slide) {
    //rotate(left_slide*inc);
    rotate(anim_slide_dir*anim_delta*inc);
  }
  for (var i=0; i<n-anim_slide; i++) {
    v = p5.Vector.fromAngle(-HALF_PI+(i+left_slide)*inc, track_rad);
    draw_coin(coin_ctr++, v.x, v.y, '#00ff0080');
  }
  pop();

  // bottom segment
  push();
  translate(0, track_rad);
  if (anim_slide) {
    translate(right_slide*coin_total, 0);
    translate(-anim_slide_dir*anim_delta*coin_total, 0);
  }
  cx = (switch_size-1)*coin_total/2;
  for (var i=-anim_slide; i<switch_size; i++) {
    draw_coin(coin_ctr++, cx, 0, '#0000ff80');
    cx -= coin_total;
  }
  pop();

  // left arc segment
  push();
  translate(-coin_total*(switch_size+1)/2, 0);
  if (anim_slide) {
    //rotate(left_slide*inc);
    rotate(anim_slide_dir*anim_delta*inc);
  }
  for (var i=0; i<n-anim_slide; i++) {
    v = p5.Vector.fromAngle(HALF_PI+(i+left_slide)*inc, track_rad);
    draw_coin(coin_ctr++, v.x, v.y);
  }
  pop();

}


function adjust_rotation(action) {
  let size = settings.size, switch_size = settings.switch_size;
  let i, n = size/2-switch_size;
  //let mult = (2*track_rad-coin_total)/(coin_rad);
  let mult = 1;
  if (action == 'switch') {
    for (i=0; i<switch_size; i++) coins[i].rot += PI;
  } else if (action == 'right') {
    for (i=0; i<n-1; i++) {
      coins[switch_size+i].rot += mult*PI/(n-1);
      coins[size/2+switch_size+i].rot += mult*PI/(n-1);
    }
  } else if (action == 'left') {
    for (i=1; i<n; i++) {
      coins[switch_size+i].rot -= PI/(n-1);
      coins[size/2+switch_size+i].rot -= PI/(n-1);
    }
  }
}


function check_actions() {
  if (action_queue.length == 0) return;
  let action = action_queue.shift();
  if (action == "begin-scramble") {
    settings.slide_rate = settings.scramble_slide_rate;
    settings.switch_rate = settings.scramble_switch_rate;
  } else if (action == "right") {
    anim_slide = true;
    anim_slide_dir = +1;
  }
  else if (action == "left") {
    anim_slide = true;
    anim_slide_dir = -1;
  }
  else if (action == "switch") {
    anim_switch = true;
  } else if (action == "end-scramble") {
    settings.slide_rate = settings.default_slide_rate;
    settings.switch_rate = settings.default_switch_rate;
  } else if (action == "reset") {
    switch_parity = -1;
    init();
  }
}


function draw() {
  if (!running) return;
  if (!anim_switch && !anim_slide) check_actions();
  background(bg);
  translate(width/2, 1.2*track_rad+settings.switch_size*coin_total/2);
  if (anim_switch) {
    if (anim_theta >= PI) {
      anim_switch = false;
      anim_theta = 0;
      y = coins.splice(0, settings.switch_size).reverse();
      coins = y.concat(coins);
      adjust_rotation('switch');
      switch_parity = -switch_parity;
    } else {
      anim_theta += settings.switch_rate;
    }
  } else if (anim_slide) {
    if (anim_delta >= 1) {
      anim_slide = false;
      anim_delta = 0;
      if (anim_slide_dir == 1) {
        adjust_rotation('right');
        coins.unshift(coins.pop());
      } else {
        adjust_rotation('left');
        coins.push(coins.shift());
      }
      anim_dir = 0;
    } else {
      anim_delta += settings.slide_rate;
    }
  }
  draw_tracks();
  draw_coins();
}

function keyReleased() {
  //if (anim_switch || anim_slide) return;
  if (keyCode === RIGHT_ARROW) action_queue.push("right");
  else if (keyCode === LEFT_ARROW) action_queue.push("left");
  else if (key == " ") action_queue.push("switch");
  else if (key == "s") {
    scramble();
  } else if (key == "r") {
    action_queue = ["reset"];
  }
}

function mousePressed() {running = !running;}

function scramble() {
  action_queue = [];
  let action, i;
  action_queue.push("begin-scramble");
  for (i=0; i<2.5*settings.size; i++) {
    if (action == "right")
      action = random(["right", "switch"]);
    else if (action == "left")
      action = random(["left", "switch"]);
    else if (action == "switch")
      action = random(["right", "left"]);
    else
      action = random(["right", "left", "switch"]);
    action_queue.push(action);
  }
  action_queue.push("end-scramble");
}
