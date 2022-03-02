let button = document.getElementById('dropdownMenu');
let dropdownmenu = document.getElementById('menuList');
let _menuIsActive = false;

button.onclick = function() {
  if (_menuIsActive) {
    dropdownmenu.classList.remove('menuActive');
    dropdownmenu.classList.add('menuInActive');
  } else {
    dropdownmenu.classList.add('menuActive');
    dropdownmenu.classList.remove('menuInActive');
  }
  _menuIsActive = !_menuIsActive;
}

function initMenu() {
  Array.from(dropdownmenu.children).forEach(i => {
    i.onclick = function(){
      renderState = i.id;
    }
  });
}
initMenu();
