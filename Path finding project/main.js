const container = document.getElementById("container");


//8:11 8:11 8:11
//8:13 8:13 8:13 
//8:17

var mouseDown = 0;
document.body.onmousedown = function() {
  mouseDown=1;
}
document.body.onmouseup = function() {
  mouseDown=0;
}

var Items = [];
var flags = [];
var navBarButtons = [];
var state = "walls";
var renderState = 'AStar';
var gridWidth = 29;
var gridHeight = 25;
var speed = 10;
var FASTRENDER = false;

//on page load
function init() {
  makeRows(gridWidth,gridWidth);
  getNavBarItems();
}

//clears all active cells
function clearActiveItems() {
  Items.forEach( i=> {
    i.classList.remove('active-1');
    i.classList.remove('found');
    i.classList.remove('path');
  });
}

//updates the dropdown menu on the navbar
function updateNavBarItems(item) {
  navBarButtons.forEach(i=> {
    i.classList.remove('navItem-active');
  });
  item.classList.add('navItem-active');
}

//gets all items in the navbar on startup
function getNavBarItems() {
  Array.from(document.getElementsByClassName('block-selector')).forEach(i => {
    i.onclick = function(item) {state = item.target.id; updateNavBarItems(item.target)};
    navBarButtons.push(i);
  });
  document.getElementById('start').onclick = run;
}

//main run function
function run() {
  console.log('started');
  clearActiveItems();
  console.log(renderState);
  switch (renderState) {
    case 'AStar': 
    AStar();
    break;
    case 'dijkstra':
      dijkstra();
      break;
    case 'maze':
      genMaze();
    break;
  }
}


//creates rows for the grid in startup
function makeRows(rows, cols) {
  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);
  for (c = 0; c < cols; c++) {
    for (r=0;r<rows;r++) {
    let cell = document.createElement("div");
    container.appendChild(cell).classList.add(r+'-'+c);
    container.appendChild(cell).className += " grid-item";
    cell.onclick = onClick;
    Items.push(cell);
    }
  };
};

//gets the index in a array of a current xy position
function getIndex(pos) {
  return pos.x + pos.y*gridWidth
};

function onClick(item) {
  let pos = getPos(item.target);
  handleClick(pos);
}

function getPos(item) {
  let classes = item.classList[0].split('-');
  let x = parseInt(classes[0]);
  let y = parseInt(classes[1]);
  return {x:x,y:y}
}

function getItem(pos) {
  return container.getElementsByClassName(pos.x+'-'+pos.y)[0];
}

//handles clicking within the grid
function handleClick(pos) {
  let index = getIndex(pos);
  switch(state) {
    case 'flags':
      if (flags.length < 2) {
      if (flags.length==1) {
        setClassList(index,'finish')
        flags.push(Items[index]);
      } else {
      setClassList(index,'target');
      flags.push(Items[index]);
      }
      
      } else {
        setClassList(getIndex(getPos(flags[0])));
        setClassList(getIndex(getPos(flags[1])));
        flags.splice(0,2);
      }
    break;

    case 'walls':
      setClassList(index,'wall');
    break;
    case 'empty':
      setClassList(index);  
    break;
    case 'followMouse':
        if (document.getElementById('followMouse').classList.contains('navItem-active')) {
          FASTRENDER = true;
          flags[1].classList.remove("finish");
          flags[1] = Items[index];
          Items[index].classList.add("finish");
          run();
          FASTRENDER = false;
        } else {
        
        }
          break;
      
        }
}

function setClassList(index,stateName = null) {
  Items[index].classList.remove('wall');
  Items[index].classList.remove('target');
  Items[index].classList.remove('finish');
  Items[index].classList.remove('active-1');
  Items[index].classList.remove('found');
  Items[index].classList.remove('path');
  if (stateName !== null) {
  Items[index].classList.add(stateName);
  }
}


init();