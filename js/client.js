var socket = io();

socket.on('drinkOrdered', addDrink);
socket.on('initializeList', refreshQueue);

function refreshQueue(orderQueue){
  // Lisää listan eka drinkki
  let drinkName = orderQueue[0].drinkName;
  let orderID = drinkName + orderQueue[0].id;
  addDrink(drinkName, orderID);

  // käy läpi tilaajat
  for (i=0; i < orderQueue.length; i++){
  // jos tilaajalla sama drinkki, lisää nimi samaan erään
    if (orderQueue[i].drinkName==drinkName){
        addOrderer(orderQueue[i].orderer, orderID)
  // muuten lisää uusi drinkki
    }else{
      drinkName = orderQueue[i].drinkName;
      orderID = drinkName + orderQueue[i].id;
      addDrink(drinkName, orderID);
      addOrderer(orderQueue[i].orderer, orderID)
    }
  }
}

function addDrink(drinkName, batchID) {
  // tee li elementti
  let mainlist = document.getElementById('orderlist');
  let li_el = document.createElement('li');
  let li_ID = 'batch_' + batchID;
  li_el.setAttribute("id", li_ID);
  li_el.setAttribute("class", "batch");

  li_el.innerHTML = drinkName;
  mainlist.appendChild(li_el);
  // tee ol elementti li elementin sisään nimiä varten
  let ol_el = document.createElement('ol');
  ol_el.setAttribute("id", batchID);
  document.getElementById(li_ID).appendChild(ol_el);


};

function addOrderer(name, batchID) {
  let list = document.getElementById(batchID);
  let el = document.createElement('li');
  el.innerHTML = name;
  list.appendChild(el);
};

function orderselected() {
  // Hae tilatun juoman nimi
  let drinkName = document.getElementById('orderName').innerHTML;
  // Hae tilaajan nimi
  let input = document.getElementById('chat-input');
  let orderer = input.value;
  socket.emit('giveorder', drinkName, orderer);

  // tyhjennä kentät ja sulje ruutu
  input.value = '';
  document.getElementById('abc').style.display = "none";
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
