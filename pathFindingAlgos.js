//helper functions
function findDistance(pos1,pos2) {
  let result = 0;
  let p1 = Math.pow((pos2.x-pos1.x), 2);
  let p2 = Math.pow((pos2.y - pos1.y),2);
  result = Math.sqrt(p1+p2);
  return result;
}

function findLeastDist(arr) {
  least = arr[0];
  for (i=0;i<arr.length;i++) {
    if (arr[i].distance < least.distance) {
      least = arr[i];
    }
  }
  return least;
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

//pathing func
async function pathParent(item) {
  if (!FASTRENDER) {
  await sleep(speed*4);
  }
  if (item.parent == null) {return;}
  item.item.classList.add('path');
  pathParent(item.parent);
}

//dijkstra algo
function dijkstra() {
  let unexplored = [];
  let allNodes = [];
  let traversed = [];
  
  let currentNode = null;
  let finishNode = null;
  let originNode = null;

  for (i = 0; i < Items.length;i++) {
    let temp = {
      distance:10000000,
      item: Items[i],
      parent: null
    };
    if (Items[i].classList.contains('target')) {
      temp.distance = 0;
      currentNode = temp;
      originNode = temp;
    }
    if (Items[i].classList.contains('finish')) {
      finishNode = temp;
    }
    unexplored.push(temp);
    allNodes.push(temp);
  }

  const Active = async () => {
  while (unexplored.length != 0) {
    if (!FASTRENDER) {
    await sleep(speed);
    }
    currentNode = findLeastDist(unexplored);
    if (currentNode.distance > 1000000) {
      break;
    }
    let curIndex = allNodes.indexOf(currentNode);
    //unexplored.splice(unexplored.indexOf(currentNode),1);
    if (currentNode == finishNode) {
      currentNode.item.classList.add('found');
      pathParent(currentNode.parent);

      unexplored = [];
      break;
    }
    currentNode.item.classList.add('active-1');
    traversed.push(currentNode);

    let neighbors = [allNodes[curIndex-1],
                    allNodes[curIndex-gridWidth],
                    allNodes[curIndex+1],
                    allNodes[curIndex+gridWidth]];
                    if (curIndex+1%gridWidth == 0) {
                      neighbors[2] = null;
                    }
                    if (curIndex%gridWidth == 0) {
                      neighbors[0] = null;
                    }
                    

    neighbors.forEach( item => {
      if (item == undefined || item == null || !unexplored.includes(item)) {return};
      if (item.item.classList.contains('wall')) {
        unexplored.splice(unexplored.indexOf(item),1)
        return;
      }
      let cpos = getPos(item.item);
      let targetcpos = getPos(originNode.item);
      let newDist = findDistance(targetcpos,cpos);
      if (newDist < item.distance) {
        item.distance = newDist;
        item.parent = currentNode;
      }
    });

    unexplored.splice(unexplored.indexOf(currentNode),1);
  }
  }

  //starts 
  Active();
}


//A*

function AStar () {
  let startNode = null;
  let endNode = null;
  let currentNode = null;

  let closedSet = new Array();
  let allNodes = new Array();
  let TheOpenSet = new Array();


  for (i = 0; i < Items.length;i++) {
    let temp = {
      item: Items[i],
      pos: getPos(Items[i]),
      parent: null,
      gCost:100000,
      hCost:100000
    };
    if (Items[i].classList.contains('target')) {
      currentNode = temp;
      startNode = temp;
      currentNode.hCost = 0;
      currentNode.gCost = 0;
    }
    if (Items[i].classList.contains('finish')) {
      endNode = temp;
    }
    allNodes.push(temp);
  }

  
  const Active = async () => {
    TheOpenSet.push(currentNode);
    while(TheOpenSet.length != 0) { 
      if (!FASTRENDER) {
      await sleep(speed);
      }

      TheOpenSet.sort(function(a,b){if (a.hCost > b.hcost) return 1;
                                 if (a.hcost < b.hcost) return -1; return 0;});

      currentNode = TheOpenSet[0];
      TheOpenSet.shift();
      closedSet.push(currentNode);

      if (currentNode == endNode) {
        pathParent(currentNode.parent);
        break;
      }

      let curIndex = allNodes.indexOf(currentNode);

      let neighbors = [allNodes[curIndex-1],
                    allNodes[curIndex-gridWidth],
                    allNodes[curIndex+1],
                    allNodes[curIndex+gridWidth]];
      if (curIndex+1%gridWidth == 0) {
        neighbors[2] = null;
      }
      if (curIndex%gridWidth == 0) {
        neighbors[0] = null;
      }
      currentNode.item.classList.add('active-1');


      neighbors.forEach( item => {

        if (item == undefined || item == null ||
           closedSet.includes(item) ||
            item.item.classList.contains('wall')) {return};

            curCost = currentNode.gCost + heuristicCostEstimate(currentNode,item);
            if (curCost < item.gCost || !TheOpenSet.includes(item)) {
              item.gCost = curCost;
              item.hCost = heuristicCostEstimate(item,endNode);
              item.parent = currentNode;

              if(!TheOpenSet.includes(item)) {
                TheOpenSet.push(item);
              }
            }
      });
    }
  }
  Active();
}

function heuristicCostEstimate(nodeA,nodeB) {
  deltaX = Math.abs(nodeA.pos.x - nodeB.pos.x);
  deltaY = Math.abs(nodeA.pos.y - nodeB.pos.y);

  if (deltaX > deltaY) {
    return 14 * deltaY + 10 * (deltaX - deltaY);
  } else {
    return 14 * deltaX + 10 * (deltaY - deltaX);
  }
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}



function genMaze() {
  let allNodes = [];
  let unexplored = [];
  let currentNode = null;
  let its = 0;
  let dir = 0;
  for (i = 0; i < Items.length;i++) {
    let temp = {
      item: Items[i],
      pos: getPos(Items[i]),
      parent: null
    };
    if (Items[i].classList.contains('target')) {
      currentNode = temp;
    }
    allNodes.push(temp);
    unexplored.push(temp);
  }
  


  const Active = async () => {
    while(unexplored.length != 0) { 
      await sleep(speed*7);
      let curIndex = allNodes.indexOf(currentNode);
      unexplored.splice(unexplored.indexOf(currentNode),1);

      let neighbors = [{node:allNodes[curIndex-1],active:true},
      {node:allNodes[curIndex-gridWidth],active:true},
      {node:allNodes[curIndex+1],active:true},
      {node:allNodes[curIndex+gridWidth],active:true}];
      if (curIndex+1%gridWidth == 0) {
        neighbors[2].active = false;
      }
      if (curIndex%gridWidth == 0) {
        neighbors[0].active = false;
      }
      if (curIndex-gridWidth < 0) {
        neighbors[1].active = false;
      }
      if (curIndex+gridWidth > gridWidth*gridWidth) {
        neighbors[3].active = false;
      }

      if (Math.floor(Math.random()*5)==1) {
      //shuffle(neighbors);
      }

        function walls(arr) {
          var result = 0;
          arr.forEach(item => {
            if (item.active == false ||
              !unexplored.includes(item.node)) {return;}
              item.node.item.classList.add('wall');
              unexplored.splice(unexplored.indexOf(item.node),1);
          });
        }
       

      
      its++;
        if (its > 50){
          break;
        }
    }
  }
  Active();
}


