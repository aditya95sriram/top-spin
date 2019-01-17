var cnv;

let coins = [];
let settings = {};
settings.rotated_coins = true;
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
settings.slide_rate = 0.1;
settings.switch_rate = 0.3;
settings.default_slide_rate = 0.1;
settings.default_switch_rate = 0.3;
settings.scramble_slide_rate = 0.2;
settings.scramble_switch_rate = 0.35;

// colors
const coin_front = '#fccc01';
const coin_back = '#c9a200';
const coin_back_correct = '#76b22c';
const bg = 255;
const track = 25;

// mobile
let ismobile = false;
let fsEnabled = false;
let fullscreen_mode = false;
let fsenter_icon, fsexit_icon;

function mod(n, m) {
  return ((n % m) + m) % m;
}

function Coin(i) {
  this.val = i;
  this.rot = noise(i)*TWO_PI;
  this.correct = false;
  return this;
}

function init() {
  coins = [];
  for (var i=0; i<settings.size; i++) coins.push(new Coin(i+1));
  windowResized();
  select("#size-disp").html(settings.size);
  select("#window-disp").html(settings.switch_size);
  check_correct();
}

function getcoin(n) {
  return coins[mod(n, settings.size)];
}

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function preload() {
  // font = loadFont("fonts/CaliforniaGothic-regular2.otf");
  font = loadFont("fonts/CaliforniaGothic2.ttf");
  // font = loadFont("fonts/SourceSansPro-Regular.otf");
}

function setup() {
  //createCanvas(1300, 640);
  ismobile = mobilecheck();
  if (ismobile) {
    fsEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled ||
                document.mozFullScreenEnabled || document.msFullscreenEnabled;
    fsenter_icon = loadImage('images/enter-fullscreen.png');
    fsexit_icon = loadImage('images/exit-fullscreen.png');
  }
  cnv = createCanvas(100, 100);
  cnv.parent("sketch");
  windowResized();
  //cnv.position(0,0);
  background(bg);
  if (font != undefined) textFont(font);
  textAlign(CENTER, CENTER);
  textSize(coin_rad-15);
  init();
  if (typeof(Hammer) != "undefined") {
    var hammer = new Hammer(document.body, {preventDefault: true});
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.on('swipe', swiped);
    hammer.on('press', function() {action_queue.push("switch");});
  }

  console.log("mobile",ismobile);
  if (ismobile && window.location.pathname.indexOf("mobile.html") == -1)
    window.location.replace("mobile.html");

  let btn = select("#btn-rotation");
  btn.mouseClicked(function(){
    if (settings.rotated_coins)
      btn.removeClass("button--tertiary");
    else
      btn.addClass("button--tertiary");
    settings.rotated_coins = !settings.rotated_coins;
  });
}

function swiped(event) {
  console.log(event);
  if (event.direction == 4) {
    action_queue.push("right");
  } else if (event.direction == 2) {
    action_queue.push("left");
  }/* else if (event.direction == 8) {
    activateFullscreen();
  } else if (event.direction == 16) {
    deactivateFullscreen();
  }*/
}

function windowResized() {
  let parent = select("#sketch");
  let w = parent.width - parseInt(parent.style("padding-left")) - parseInt(parent.style("padding-right"));
  if (fullscreen_mode) w = windowWidth;
  cnv.resize(w, windowHeight);
  track_rad = coin_total/(2*sin(HALF_PI/(settings.size/2-settings.switch_size-1)));
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
  if (settings.rotated_coins) rotate(coin.rot);
  fill(coin.correct ? coin_back_correct : coin_back);
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

function draw_fullscreen_icon() {
  let img = fullscreen_mode ? fsexit_icon : fsenter_icon;
  image(img, 10, 10, 50, 50);
}

function check_correct() {
  let pos;
  for (let i=0; i<settings.size; i++) {
    coins[i].correct = false;
    if (coins[i].val == 1) {
      coins[i].correct = true;
      pos = i;
    }
  }
  let delta = 0
  while (delta <= settings.size) {
    if (getcoin(pos+delta+1).val == getcoin(pos+delta).val+1) {
      getcoin(pos+delta+1).correct = getcoin(pos+delta).correct;
    }
    if (getcoin(pos-delta-1).val == getcoin(pos-delta).val+1) {
      getcoin(pos-delta-1).correct = getcoin(pos-delta).correct;
    }
    delta += 1;
  }
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
  if (ismobile) {
    draw_fullscreen_icon();
    translate(width/2, height/2);
    scale(fullscreen_mode ? 0.8 : 0.7);
  } else {
    translate(width/2, track_rad+settings.switch_size*coin_total/2);
  }
  if (anim_switch) {
    if (anim_theta >= PI) {
      anim_switch = false;
      anim_theta = 0;
      let y = coins.splice(0, settings.switch_size).reverse();
      coins = y.concat(coins);
      adjust_rotation('switch');
      switch_parity = -switch_parity;
      check_correct();
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

function mouseClicked() {
  console.log(mouseX, mouseY);
  if (mouseX <= 50 && mouseY <=50) {
    if (fullscreen_mode) deactivateFullscreen();
    else activateFullscreen();
  } else if (mouseX <= width && mouseY <= height) {
    action_queue.push("switch");
  }
}

function keyReleased() {
  //if (anim_switch || anim_slide) return;
  if (keyCode === RIGHT_ARROW) action_queue.push("right");
  else if (keyCode === LEFT_ARROW) action_queue.push("left");
  else if (key == " ") action_queue.push("switch");
  else if (key == "s") scramble();
  else if (key == "r") reset();
  else if (key == "q") quick_scramble();
  else if (key == "d") {
    settings.default_slide_rate += 0.01;
    settings.default_switch_rate += 0.01;
    settings.switch_rate = settings.default_switch_rate;
    settings.slide_rate = settings.default_slide_rate;
    console.log(settings.default_slide_rate, settings.default_switch_rate);
  }
}

function reset() {
  action_queue = ["reset"];
}

function scramble() {
  action_queue = [];
  let action, i;
  action_queue.push("begin-scramble");
  for (i=0; i<2*settings.size; i+=(action=="switch")) {
    if (action == "right")
      action = random(["right", "switch", "switch"]);
    else if (action == "left")
      action = random(["left", "switch", "switch"]);
    else if (action == "switch")
      action = random(["right", "left"]);
    else
      action = random(["right", "left", "switch"]);
    action_queue.push(action);
  }
  action_queue.push("end-scramble");
}

function quick_scramble() {
  scramble();
  action_queue.shift(); // begin-scramble;
  while (action_queue.length > 0) {
    action = action_queue.shift();
    if (action == "end-scramble") break;
    else if (action == "left") coins.push(coins.shift());
    else if (action == "right") coins.unshift(coins.pop());
    else if (action == "switch") {
      let y = coins.splice(0, settings.switch_size).reverse();
      coins = y.concat(coins);
    } else console.log("invalid action", action);
  }
  check_correct();
}

function activateFullscreen() {
  if (!fsEnabled) return;
  var i = document.getElementById("sketch");
  // go full-screen
  if (i.requestFullscreen) {
  	i.requestFullscreen();
  } else if (i.webkitRequestFullscreen) {
  	i.webkitRequestFullscreen();
  } else if (i.mozRequestFullScreen) {
  	i.mozRequestFullScreen();
  } else if (i.msRequestFullscreen) {
  	i.msRequestFullscreen();
  }
  fullscreen_mode = true;
  windowResized();
}

function deactivateFullscreen() {
  if (!fsEnabled) return;
  // exit full-screen
  if (document.exitFullscreen) {
  	document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
  	document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
  	document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
  	document.msExitFullscreen();
  }
  fullscreen_mode = false;
  windowResized();
}
