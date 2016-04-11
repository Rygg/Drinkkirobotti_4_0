var socket = io();

socket.on('msg', onMessage);
socket.on('drinkOrdered', addDrink);
socket.on('initializeList', addDrink);

function refreshQueue(orderQueue){
  drinkName = orderQueue[0].drinkName;
  addDrink(drinkName);

  for (i=1; i < 5; i ++){
    if (orderQueue[0].drinkName==drinkName){
      addOrderer(i)
    }else{
      break;
    }
  }
}

function orderselected() {
  // Hae tilatun juoman nimi
  var drinkName = document.getElementById('orderName').innerHTML;
  // Hae tilaajan nimi
  var input = document.getElementById('chat-input');
  var orderer = input.value;
  socket.emit('giveorder', drinkName, orderer);

  // tyhjennä kentät ja sulje ruutu
  input.value = '';
  document.getElementById('abc').style.display = "none";
};

function addDrink(drinkName) {
  var list = document.getElementById('orderlist');
  var el = document.createElement('li');
  el.innerHTML = drinkName;
  list.appendChild(el);
};

function addOrderer(text, batchnumber) {
  var list = document.getElementById('batch1');
  var el = document.createElement('li');
  el.innerHTML = text;
  list.appendChild(el);
};



// var form = document.getElementById('chat-form');
// form.addEventListener('submit', function(e) {
//   var input = document.getElementById('chat-input');
//   var value = input.value;
//   input.value = '';
//   onNameMessage(value);
//   e.preventDefault();
//   document.getElementById('abc').style.display = "none";
// });

function show_info(drinkName) {
document.getElementById('abc').style.display = "block";
document.getElementById('orderName').innerHTML = drinkName;
};
//Function to Hide Popup
function hide_info(){
document.getElementById('abc').style.display = "none";
};
