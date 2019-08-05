var firebaseConfig = {
    apiKey: "<API_KEY>",
    authDomain: "<AUTH_DOMAIN>",
    databaseURL: "<DATABASE_URL>",
    projectId: "<PROJECT_ID>",
    storageBucket: "",
    messagingSenderId: "<SENDER_ID>",
    appId: "<APPLICATION_ID>"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var createButton = document.getElementById("btn-create");
var deleteButton = document.getElementById("btn-delete");
var updateButton = document.getElementById("btn-update");


createButton.onclick = () => {
    createItem();
}


updateButton.onclick = () => {
    var key = document.getElementById("id").value;
    
    if (key != "") {
        updateItem(key);
    }
}


deleteButton.onclick = () => {
    firebase.database().ref("items").remove();
}


firebase.database().ref("items").orderByChild("itemName").on("value", (snapshot) => {
    document.getElementById('tbody').innerHTML = "";

    snapshot.forEach(function(childSnapshot) {
        var childInfo = childSnapshot.val();
        createListElement(childSnapshot.key, childInfo.itemName, childInfo.price, childInfo.quantity);
    })
});


function createItem() {
    var db = firebase.database().ref();

    var itemName = document.getElementById("itemname").value;
    var price = document.getElementById("price").value;
    var quantity = document.getElementById("quantity").value;

    db.child("items").push({
            itemName: itemName,
            price: parseFloat(price),
            quantity: parseInt(quantity)
        }
    ).then((snap) => {
        const key = snap.key;
        document.getElementById("id").value = key;
    })
}


function deleteItem(key) {
    var db = firebase.database().ref("items");
    db.child(key).remove();
}


function editItem(key) {
    firebase.database().ref("items").child(key).once("value", (snapshot) => {
        var itemData = snapshot.val();
        document.getElementById("id").value = snapshot.key;
        document.getElementById("itemname").value = itemData.itemName;
        document.getElementById("price").value = itemData.price;
        document.getElementById("quantity").value = itemData.quantity;
    })
}


function updateItem(key) {
    var itemName = document.getElementById("itemname").value;
    var price = document.getElementById("price").value;
    var quantity = document.getElementById("quantity").value;

    firebase.database().ref("items").child(key).set({
        itemName: itemName,
        price: parseFloat(price),
        quantity: parseInt(quantity)
    })
        
}


function createListElement(key, name, price, quantity) {
    var listContainer = document.createElement("tr");
    var listName = document.createElement("td");
    var listPrice = document.createElement("td");
    var listQuantity = document.createElement("td");

    var editButton = document.createElement("td");
    var edtButton = document.createElement("button");

    var deleteButton = document.createElement("td");
    var dltButton = document.createElement("button");

    listName.innerHTML = name;
    listPrice.innerHTML = "$" + price;
    listQuantity.innerHTML = quantity;
    edtButton.className = "fas fa-edit btnedit";
    dltButton.className = "fas fa-trash-alt btndelete";

    editButton.appendChild(edtButton);
    deleteButton.appendChild(dltButton);

    listContainer.appendChild(listName);
    listContainer.appendChild(listPrice);
    listContainer.appendChild(listQuantity);
    listContainer.appendChild(editButton);
    listContainer.appendChild(deleteButton);

    document.getElementById('tbody').appendChild(listContainer);

    deleteButton.addEventListener("click", () => {
        deleteItem(key);
    })

    editButton.addEventListener("click", () => {
        editItem(key);
    })   
}

