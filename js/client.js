//
//                        Client.js
// sisältää operatorille ja customerille yhteiset funktiot
//
//

var socket = io();

socket.on('drinkOrdered', addDrink);
socket.on('initializeDrinkList', refreshDrinkList);

// Funktio lisää eri drinkit drinkkilistaan
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

// Lisää drinkin tilauslistaan.
function addDrink(drinkName, batchID) {
  li_ID = "li_" + batchID;
  appendElement('orderlist',"li",li_ID, "batch");
  writeToElement(li_ID,drinkName);
  appendElement(li_ID,"ol",batchID);
};

// Antaa juomatilauksen servulle poimitusta tiedoista.
function orderselected() {
  // Hae tilatun juoman nimi
  let drinkName = document.getElementById('orderName').innerHTML;
  // Hae tilaajan nimi
  let input = document.getElementById('chat-input');
  let orderer = input.value;
  if(validate(orderer) == true){
    socket.emit('giveorder', drinkName, orderer);
    // tyhjennä kentät ja sulje ruutu
    input.value = '';
    document.getElementById('orderscreen').style.display = "none";
  } else {
    input.focus();
  }
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

// hyödyllinen funktio elementtiin kirjoittaessa.
function writeToElement(elementID, text){
  let el = document.getElementById(elementID);
  el.innerHTML = text;
}

// Lisää tilausnappulan drinkkilistaan ja drinkin nimen.
function createOrderButton(drinkObj,buttonIndex){
  let drinkName = drinkObj.name;
  let drinkRecipe = drinkObj.recipe;
  let availability = drinkObj.available;
  let buttonID="orderButton_"+buttonIndex;
  let labelID="drinklabel_"+buttonIndex;
  appendElement('drinkList',"button",buttonID,"drink");
  configureButtonElement(buttonID,drinkName,drinkRecipe,availability);
  appendElement(buttonID,"h1",labelID,"drinklabel");
  writeToElement(labelID,drinkName);
}

// lisää tilausnappulaan kuvan ja yksilölliset parametrit.
function configureButtonElement(elementID,drinkName,drinkRecipe,available){
  let el = document.getElementById(elementID);
  let recipe_str = JSON.stringify(drinkRecipe);
  let functionality = "show_info('"+drinkName+"',"+recipe_str+")";
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

  // Jos juoma on loppu
  if (available == false){
    let out_img = document.createElement("img");
    out_img.setAttribute("class","outofstock");
    let out_url = "outofstock.png";
    out_img.src=out_url;
    el.appendChild(out_img);
    el.disabled = true;
  } else {
    el.disabled = false;
  }
}

// Tarkastaa löytyykö drinkin kuvaa. Ottaa parametrina kuvan osoitteen.
function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}

// Validoi nimen drinkkiä tilatessa
function validate(text) {
    let input = document.getElementById('inputadvice');
    if (text == "") {
        //alert("Enter a name");
        //.myForm.name.focus();
        return false;
    }
    if (text.length > 10) {
        input.innerHTML="Name too long!"
        //alert("Name too long!");
        //.myForm.name.focus();
        return false;
    }
    if (!/^[a-zA-Z]*$/g.test(text)) {
        input.innerHTML="Name has invalid characters!"
        //alert("Invalid characters");
        //document.myForm.name.focus();
        return false;
    }
    input.innerHTML="Please enter your name"
    return true;
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

// Tämä funktio näyttää drinkin tiedot
function show_info(headLine,recipelist) {
document.getElementById('orderscreen').style.display = "block";
document.getElementById('orderName').innerHTML = headLine;
removeElement("recipe","portionlist")
appendElement("recipe","ul","portionlist")
for (i=0; i < recipelist.length; i++){
  let portionID = "rec_"+headLine+i;
  let row = recipelist[i].amount +" cl "+ recipelist[i].bottleName;
  appendElement("portionlist","li",portionID,"rec_li");
  writeToElement(portionID,row);
  let input = document.getElementById('chat-input');
  input.focus();
}
};
// Piilottaa elementin
function hide_element(elementID){
document.getElementById(elementID).style.display = "none";
};

// Näyttää elementin
function show_element(elementID){
document.getElementById(elementID).style.display = "block";
};
