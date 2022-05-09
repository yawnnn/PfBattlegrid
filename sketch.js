let wscale;
let hscale;

let pgs;
let last_name;
let last_id = 0;

// Valori per DELONTE

let rows = 15;
let cols = 15;

let FULLSCREEN = false;
let bordergap = 0         // Distanza dal bordo verticale (sopra e sotto)

let wall_alpha = 160;

// Fine

$(document).ready(function(){
  $(document).bind("click",  mouse_pressed);
  $(document).bind("contextmenu",  mouse_pressed);
});

function windowResized() {
  if (FULLSCREEN) resizeCanvas(windowWidth, windowHeight);
  else resizeCanvas(windowHeight - bordergap, windowHeight - bordergap);
  
  wscale = width / cols;
  hscale = height / rows;
}

function setup() {
  if (FULLSCREEN) createCanvas(windowWidth, windowHeight);
  else createCanvas(windowHeight - bordergap, windowHeight - bordergap);

  wscale = width / cols;
  hscale = height / rows;

  pgs = new Array(cols * rows);
  setInterval(check_updates, 2000);
}

function draw() {
  background(230);
  stroke(0);
  strokeWeight(2);
  
  for (let i = 0; i < rows + 1; i++) {
    line(0, i * hscale, width, i * hscale);
  }

  for (let j = 0; j < cols + 1; j++) {
    line(j * wscale, 0, j * wscale, height);
  }
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (pgs[to_index(i, j)]) {
        if (pgs[to_index(i, j)] == "__wall__") {
          draw_rect(i * wscale, j * hscale);
        }
        else {
          draw_text(pgs[to_index(i, j)], i * wscale, j * hscale);
        }
      }
    }
  }
}

function draw_rect(x, y) {
  fill(0, wall_alpha);
  rect(x, y, wscale, hscale);
}

function draw_text(string, x, y) {
  rectMode(CORNER);
  textSize(20);
  textAlign(CENTER, CENTER);
  strokeWeight(1);
  fill(0);
  
  text(string, x, y, wscale, hscale);
}

function to_index(x, y) {
  return x + y * rows;
}

function find_pos(mouse_x, mouse_y) {
  let pos = createVector(-1, -1);
  
  for (let j = 0; j < cols + 1; j++) {
    if (mouse_x >= j * wscale && mouse_x < (j + 1) * wscale) {
      pos.x = j;
    }
  }
    
  for (let i = 0; i < rows + 1; i++) {
    if (mouse_y >= i * hscale && mouse_y < (i + 1) * hscale) {
      pos.y = i;
    }
  }
  
  return pos;
}

function update_grid(data) {
  if (data.length) {
    for (var row of data) {
      if (row.type == "0") {
        pgs[to_index(parseInt(row.x), parseInt(row.y))] = row.name;
      }
      else if (row.type == "1") {
        pgs[to_index(parseInt(row.x), parseInt(row.y))] = undefined;
      }

      if (last_id < row.id) last_id = row.id;
    }
  }
}

function check_updates() {
  let url = 'check_updates.php?last_id=' + last_id;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      update_grid(data);
    });
}

function send_update(x, y, name, type) {
  let url = "update.php?x=" + x + "&y=" + y + '&name=' + name + '&type=' + type;

  fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return 0;
  })
  .catch((error) => {
    console.error('There has been a problem with your fetch operation:', error);
  });
}

function mouse_pressed(event) {
  event.preventDefault();

  if (event.target.id != 'defaultCanvas0') return 0;

  mouse_x = event.pageX - event.target.offsetLeft;
  mouse_y = event.pageY - event.target.offsetTop;

  let pos = find_pos(mouse_x, mouse_y);
  
  if (event.type == 'click') {
    if (pgs[to_index(pos.x, pos.y)]) {
      last_name = pgs[to_index(pos.x, pos.y)];

      send_update(pos.x, pos.y, pgs[to_index(pos.x, pos.y)], 1);
      pgs[to_index(pos.x, pos.y)] = undefined;
    } else {
      let name;
      
      if (last_name) {
        name = last_name;
        last_name = undefined;
      } else {
        name = prompt("Inserisci nome");
      }
      
      if (name) {
        send_update(pos.x, pos.y, name, 0);
        pgs[to_index(pos.x, pos.y)] = name;
      }
    }
  } else if (event.type == 'contextmenu') {
    if (pgs[to_index(pos.x, pos.y)]) {
      send_update(pos.x, pos.y, pgs[to_index(pos.x, pos.y)], 1);
      pgs[to_index(pos.x, pos.y)] = undefined;
    } else {
      send_update(pos.x, pos.y, "__wall__", 0);
      pgs[to_index(pos.x, pos.y)] = "__wall__";
    }
    
  }
}

