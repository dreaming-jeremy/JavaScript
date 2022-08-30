var mainPage;   // HTML element that contains the user interface
var dataStore;  // Array of Restaurants
var storeName;  // name of saved restaurants in local storage
var activeLibItem; // currently active Restaurant (for entry and edit)

const STORE_LOAD_OK = 0;
const STORE_EMPTY = 1;
const STORE_INVALID = 2;

function loadDataStore() {

    // get the restaurant data array from local storage
    var dataArrayJSON = localStorage.getItem(storeName);

    // if there is no data make an empty restaurant
    if (dataArrayJSON == null ) {
        dataStore = [];
        return STORE_EMPTY;
    }

    // read the stored data
    dataStore = [];
   
    try {
        var dataArray = JSON.parse(dataArrayJSON1);

        for (dataLine of dataArray) {
            dataStore[dataStore.length] = Restaurant.JSONparse(dataLine);
        }
    }
    catch {
        // if the parse fails make an empty restaurant
        dataStore = [];
        return STORE_INVALID;
    }

    return STORE_LOAD_OK;
}

function saveDataStore() {
    var dataArray = [];

    for (item of dataStore) {
        dataArray[dataArray.length] = item.JSONstringify();
    }

    var dataJSON = JSON.stringify(dataArray);

    localStorage.setItem(storeName, dataJSON);
}

function clearPage() {
    // clear the display
    while (mainPage.children.length > 0)
        mainPage.removeChild(mainPage.children[0]);
}

function openPage(title) {
    clearPage();
    let titlePar = document.createElement("p");
    titlePar.innerText = title;
    titlePar.className = "pageTitle";
    mainPage.appendChild(titlePar);
}

function showMenu(schema) {
    for (const buttonDesc of schema) {
        let buttonPar = document.createElement("p");
        buttonPar.className = "menuPar";

        let descriptionPar = document.createElement("p");
        descriptionPar.innerText = buttonDesc.desc;
        descriptionPar.className = "menuButtonCaption";
        buttonPar.appendChild(descriptionPar);

        let button = document.createElement("button");
        button.innerText = buttonDesc.label;
        button.className = "menuButton";
        button.setAttribute("onclick", buttonDesc.func);
        buttonPar.appendChild(button);

        mainPage.appendChild(buttonPar);
    }
}

function doShowMainMenu() {
    openPage("Main Menu");

    showMenu(
        [{ desc: "Search by Title", label: "Search", func: "doSearchTitle()" },
        { desc: "Search by Subject", label: "Search", func: "doSearchSubject()" },
        { desc: "Search by Contributors", label: "Search", func: "doSearchContributors()" },
        { desc: "Register Item", label: "Register", func: "doRegisterItem()" },
        { desc: "Unregister Item", label: "Unregister", func: "doUnregisterItem()" },
        { desc: "Modify Item", label: "Modify", func: "doModifyItem()" },
        ]);
}

function addRestaurant(RstrntClass) {

    activeLibItem = new RstrntClass();

    openPage("Register " );

    activeLibItem.getHTML(mainPage);

    showMenu(
        [{ desc: "Save Restaurant", label: "Save", func: "doSaveAdd()" },
        { desc: "Cancel add", label: "Cancel", func: "doShowMainMenu()" }]);
}

function doRegisterRestaurant() {
      addRestaurant(Restaurant);
}

function doSaveAdd() {
    activeLibItem.loadFromHTML();
    activeLibItem.itemRef = LibraryItem.getLargestItemRef(dataStore) + 1;
    dataStore[dataStore.length] = activeLibItem;
    alert( activeLibItem.itemRef + " added");
    saveDataStore();
    doShowMainMenu();
}

function doUnregisterRestaurant() {
    openPage("Unregister ");
    Restaurant.buildElementsFromSchema(mainPage,
        [{ id: "name", prompt: "Name to Unregister", type: "input" }]);
    
    showMenu(
        [{ desc: "Unregister Restaurant", label: "Unregister", func: "doUnregister()" },
        { desc: "Cancel Search", label: "Cancel", func: "doShowMainMenu()" }]);
}


function doUnregister() {
    var unregisterNameElement = document.getElementById("name");
    var unregisterName = unregisterNameElement.value; 

    var flag = unregisterRestaurantName(unregisterName);
    if (flag !== null){
       alert("Restaurant " + unregisterName + " Unregistered");
    }
    else{
       alert("Restaurant " + unregisterName + " is not Found!!");
    }
    doShowMainMenu();
}

function doSearchRestaurants() {

    openPage("Search Restaurant");
    Restaurant.buildElementsFromSchema(mainPage, Restaurant.SearchSchema);

    showMenu(
        [{ desc: "Search Restaurant", label: "Search", func: "doSearch()"},
        { desc: "Cancel Search", label: "Cancel", func: "doShowMainMenu()" }]);    

}

function doSearch() {

    var searchTitleElement = document.getElementById("title");
    var searchTitle = searchTitleElement.value;
    
    var searchSubjectElement = document.getElementById("subject");
    var searchSubject = searchSubjectElement.value;

    var searchContributorElement = document.getElementById("Contributors");
    var searchContributor = searchContributorElement.value;

    var libItem = findItemTitle(searchTitle);
    var libItem1 = findItemSubject(searchSubject);
    var libItem2 = findItemContributors(searchContributor);

    if (libItem != null || libItem1 != null || libItem2 != null ){
        alert("Item Found!!");

        openPage("Found Item ");

        for (let item of dataStore) {
            if (item.name == searchName || item.cuisineType == searchCuisine) {          
                let itemPar = createListElement(item);
                mainPage.appendChild(itemPar);         
                } 
            }
    }
    else{
        alert("Restaurant not Found!!");
    }

    showMenu(
        [{ desc: "\n\n\nReturn to Main Menu", label: "Return", func: "doShowMainMenu()" }])

}

function createListElement(item) {
    let resultPar = document.createElement("p");

    let openButton = document.createElement("button");
    openButton.innerText = "Update";
    openButton.className = "itemButton";
    let editFunctionCall = "doUpdateItem('" + item.itemRef + "')";
    openButton.setAttribute("onclick", editFunctionCall);
    resultPar.appendChild(openButton);

    let detailsElement = document.createElement("p");
    detailsElement.innerText = item.getDescription();
    detailsElement.className = "itemList";
    resultPar.appendChild(detailsElement);

    return resultPar;
}

function createList(heading, items) {
    openPage(heading);
    for (let item of items) {
        let itemPar = createListElement(item);
        mainPage.appendChild(itemPar);
    }
}

function doShowRestaurants() {
    createList("Restaurant List", dataStore1);
    showMenu(
        [{ desc: "Cancel updates", label: "Cancel", func: "doCancelUpdate()" }]);
}

function findRestaurant(rstrntRef) {
    for (let item of dataStore) {
        if (item.rstrntRef == rstrntRef) {
            return item;
        }
    }
    return null;
}

function findRestaurantName(rstrntName) {
    for (let item of dataStore) {
        if (item.name == rstrntName) {
            return item;
        }
    }
    return null;
}

function findRestaurantCuisine(rstrntCuisine) {
    for (let item of dataStore) {
        if (item.cuisineType == rstrntCuisine) {
            return item;
        }
    }
    return null;
}

function unregisterRestaurantName(rstrntName) {
    let index = 0;
    for (let item of dataStore) {
        if (item.name == rstrntName) {
            dataStore.splice(index,1);
            return index;
        }
        index++;
    }
    return null;
}

function doUpdateItem(rstrntRef) {

    var rstrnt = findRestaurant(rstrntRef);

    if (rstrnt == null) {
        return false;
    }

    activeRstrnt = rstrnt;

    openPage("Update "  + rstrntRef);

    rstrnt.getHTML(mainPage);

    rstrnt.sendToHTML();

    showMenu(
        [{ desc: "Save updates", label: "Save", func: "doSaveUpdate()" },
        { desc: "Cancel updates", label: "Cancel", func: "doCancelUpdate()" }]);

    return true;
}

function doModifyRestaurant() {
    openPage("Modify Restaurant");
    Restaurant.buildElementsFromSchema(mainPage,
        [{ id: "findRstrntRef", prompt: "Reference", type: "input" }]);

    showMenu(
        [{ desc: "Search Restaurant", label: "Search", func: "doModifyItem(findRstrntRef)"},
        { desc: "Cancel Modification", label: "Cancel", func: "doShowMainMenu()" }]);
}

function doModifyItem(findRstrntRef) {

    var searchRefElement = document.getElementById("findRstrntRef");
    var searchRef = searchRefElement.value;

    var rstrnt = findRestaurantName(searchRef);

    if (rstrnt == null) {
        return false;
    }

    activeRstrnt = rstrnt;

    openPage("Update "  + searchRef);
    rstrnt.getHTML(mainPage);

    rstrnt.sendToHTML();

    showMenu(
        [{ desc: "Save Modify", label: "Save", func: "doSaveModify()" },
        { desc: "Cancel Modify", label: "Cancel", func: "doShowMainMenu()" }]);

    return true;
}


function doSaveUpdate() {
    activeRstrnt.loadFromHTML();
    alert(activeRstrnt.type + " " + activeRstrnt.rstrntRef + " updated");
    saveDataStore();
    doShowMainMenu();
}

function doSaveModify() {
    activeRstrnt.loadFromHTML();
    alert("Restaurant " + activeRstrnt.name + " Modified.");
    saveDataStore();
    doShowMainMenu();
}

function doCancelUpdate() {
    doShowMainMenu();
}

function doUpdateRestaurant() {
    openPage("Update Restaurant");
    Restaurant.buildElementsFromSchema(mainPage,
        [{ id: "findRstrntRef", prompt: "Reference", type: "input" }]);

    showMenu(
        [{ desc: "Find Restaurant", label: "Find", func: "doFindRestaurant()" },
        { desc: "Cancel updates", label: "Cancel", func: "doCancelUpdate()" }]);
}

function doFindRestaurant() {
    var searchRefElement = document.getElementById("findRstrntRef");
    var searchRef = searchRefElement.value;

    if (!findRestaurant(searchRef)) {
        alert("Restaurant " + searchRef + " not found");
    }
}

function doStartCatalog(mainPageId, storeNameToUse) {
    mainPage = document.getElementById(mainPageId);

    storeName = storeNameToUse;

    var loadResult = loadDataStore();

    switch (loadResult) {
        case STORE_LOAD_OK:
            break;
        case STORE_EMPTY:
            alert("Empty Catalog created");
            saveDataStore();
            break;
        case STORE_INVALID:
            alert("Store invalid. Empty Catalog created");
            saveDataStore();
            break;
    }

    doShowMainMenu();
}

