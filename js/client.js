var socket = io();

socket.on('drinkOrdered', addDrink);
socket.on('initializeList', refreshQueue);
socket.on('initializeDrinkList', refreshDrinkList);

function refreshDrinkList(drinkList){
  // Tuhoa vanha ja tee uusi lista
  removeElement("contentright", "drinkList");
  appendElement("contentright", "div", "drinkList");

  if(drinkList.length == 0) {
      appendElement(contentright, 'h1', 'noDrinks');
      writeToElement('noDrinks', 'Error reading drinks from database!')
  }
  for (i=0; i < drinkList.length; i++){
    createOrderButton(drinkList[i],i);
  }
}

function refreshQueue(orderQueue){
  if(orderQueue.length == 0) {
      return;
  }
  // Tuhoa vanha ja tee uusi lista
  removeElement("contentleft", "orderlist");
  appendElement("contentleft", "ol", "orderlist");
  // Lisää listan eka drinkki.
  let drinkName = orderQueue[0].drinkName;
  let batchID = drinkName + orderQueue[0].ID;
  addDrink(drinkName, batchID);
  // käy läpi tilaajat
  for (i=0; i < orderQueue.length; i++){
  // jos tilaajalla sama drinkki kuin edellisellä, lisää nimi samaan erään
    if (orderQueue[i].drinkName==drinkName){
        addOrderer(orderQueue[i].orderer, orderQueue[i].ID, batchID)
  // muuten lisää uusi drinkki
    }else{
      drinkName = orderQueue[i].drinkName;
      batchID = drinkName + orderQueue[i].ID;
      addDrink(drinkName, batchID);
      addOrderer(orderQueue[i].orderer,orderQueue[i].ID, batchID)
    }
  }
}

function addDrink(drinkName, batchID) {
  li_ID = "li_" + batchID;
  appendElement('orderlist',"li",li_ID, "batch");
  writeToElement(li_ID,drinkName);
  appendElement(li_ID,"ol",batchID);
};

function addOrderer(ordererName,uniqueID, batchID) {
  appendElement(batchID,"li",uniqueID)
  writeToElement(uniqueID,ordererName)
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

// Hyödyllinen funktio elementin poistoon
function removeElement(parentID, childID){
  let parent = document.getElementById(parentID);
  let child = document.getElementById(childID);
  parent.removeChild(child);
}

// Hyödyllinen funktio uuden elementin lisäämiseen
function appendElement(parentID, childElement, childIDName, childClassName){
  let parent = document.getElementById(parentID);
  let child = document.createElement(childElement);
  if (childIDName !== undefined) {child.setAttribute("id", childIDName)};
  if (childClassName !== undefined) {child.setAttribute("class", childClassName)};
  parent.appendChild(child);
}

function writeToElement(elementID, text){
  let el = document.getElementById(elementID);
  el.innerHTML = text;
}

function createOrderButton(drinkName,buttonIndex){
  let buttonID="orderButton_"+buttonIndex;
  appendElement('drinkList',"button",buttonID,"drink")
  configureButtonElement(buttonID,drinkName);
}

// lisää tilausnappulaan kuvan ja funktion
function configureButtonElement(elementID, drinkName){
  let el = document.getElementById(elementID);
  let functionality = "show_info('"+drinkName+"')";
  el.setAttribute("onclick", functionality);
  // luodaan kuva
  let img = document.createElement("img");
  let url = drinkName + ".jpg";
  if (imageExists(url)) {img.src = url;}
  else {
    let url = "default.jpg";
    img.src=url;
  }
  el.appendChild(img);
}

function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}

function validate() {
    if (document.myForm.name.value == "") {
        alert("Enter a name");
        document.myForm.name.focus();
        return false;
    }
    if (!/^[a-zA-Z]*$/g.test(document.myForm.name.value)) {
        alert("Invalid characters");
        document.myForm.name.focus();
        return false;
    }
}

function ImageExist(url)
{
   var img = new Image();
   img.src = url;
   return img.height != 0;
}

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
