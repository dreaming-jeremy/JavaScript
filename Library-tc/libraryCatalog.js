var mainPage;   // HTML element that contains the user interface
var dataStore;  // Array of LibraryItems
var storeName;  // name of saved libraryItems in local storage
var activeLbrItm; // currently active LibraryItem (for entry and edit)
var activeCntbtr; // currently active ContributorWithType
var cntbtrCnt; // number of Contributors for currently active LibraryItem

const STORE_LOAD_OK = 0;
const STORE_EMPTY = 1;
const STORE_INVALID = 2;

function loadDataStore() {

    // get the library item data array from local storage
    var dataArrayJSON = localStorage.getItem(storeName);

    // if there is no data make an empty library item
    if (dataArrayJSON == null ) {
        dataStore = [];
        return STORE_EMPTY;
    }

    // read the stored data
    dataStore = [];
   
    try {
        var dataArray = JSON.parse(dataArrayJSON);

        for (dataLine of dataArray) {
            dataStore[dataStore.length] = LibraryItem.JSONparse(dataLine);
        }
    }
    catch {
        // if the parse fails make an empty library item
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
        [{ desc: "Show Library Items", label: "Show", func: "doShowItems()" },
        { desc: "Search By Contributor", label: "Search", func: "doSearchItemByCntbtr()" },
        { desc: "Register Libray Item", label: "Register", func: "doRegisterLbrItm()" },
        { desc: "Unregister Restaurant", label: "Unregister", func: "doUnregisterRestaurant()" },
        { desc: "Modify Restaurant", label: "Modify", func: "doModifyRestaurant()" },
        { desc: "Login User", label: "Login", func: "doLoginUsr()"}
        ]);
}

function doSaveAdd() {
    activeLbrItm.loadFromHTML();
    activeLbrItm.lbrItmRef = LibraryItem.getLargestLbrItmRef(dataStore) + 1;
    dataStore[dataStore.length] = activeLbrItm;
    alert( activeLbrItm.lbrItmRef + " added");
    saveDataStore();
    doShowMainMenu();
}

function addLbrItm(LbrItmClass) {

    activeLbrItm = new LbrItmClass();

    openPage("Register " );

    activeLbrItm.getHTML(mainPage);

    showMenu(
        [{ desc: "Save Library Item", label: "Save", func: "doSaveAdd()" },
        { desc: "Cancel add", label: "Cancel", func: "doShowMainMenu()" }]);
}

function doRegisterLbrItm() {
    doShowRgtrMenu();
}


function doShowRgtrMenu() {
    openPage("LibraryItem Register Menu");

    showMenu(
        [{ desc: "Register Book", label: "Book", func: "doRegisterBook()" },
        { desc: "Register CD", label: "CD", func: "doRegisterCD()" },
        { desc: "Register DVD", label: "DVD", func: "doRegisterDVD()" },
        { desc: "Register Magazine", label: "Magazine", func: "doRegisterMagazine()" },
        ]);
}

function doRegisterBook(){
    activeLbrItm = new Book();

    openPage("Register Book " );

    activeLbrItm.getHTML(mainPage);

    showMenu(
        [{ desc: "Save Library Item", label: "Save", func: "doSaveAdd()" },
        { desc: "Cancel add", label: "Cancel", func: "doShowRgtrMenu()" }]);
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
    if (flag !== null)
       alert("Restaurant Unregistered");
    else
       alert("Restaurant to unregister not Found!!");
}

function doSearchItemByCntbtr() {
    openPage("Search By Contributor ");
    LibraryItem.buildElementsFromSchema(mainPage, LibraryItem.SrchSchema);
       
    showMenu(
        [{ desc: "Search Itmem", label: "Search by Contributor", func: "doSearch()" },
        { desc: "Cancel Search", label: "Cancel", func: "doShowMainMenu()" }]);
}

function doSearch() {
    var searchNameElement = document.getElementById("cntbtr-name");
    var searchName = searchNameElement.value;
    
    var lbrItmList = findLbrItmCntbtrName(searchName);
    
    if ( lbrItmList.length != 0 )
        createList("LbrItm Found!!", lbrItmList);
    else
        alert("LbrItm not Found!!");

    
    showMenu(
            [{ desc: "Cancel Search", label: "Cancel", func: "doShowMainMenu()" }]);
    }

function createListElement(item) {
    let resultPar = document.createElement("p");

    //let openButton = document.createElement("button");
    //openButton.innerText = "Update";
   // openButton.className = "itemButton";
    //let editFunctionCall = "doUpdateItem('" + item.lbrItmRef + "')";
   // openButton.setAttribute("onclick", editFunctionCall);
   // resultPar.appendChild(openButton);

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

function doShowItems() {
    createList("Library Item List", dataStore);
    showMenu(
        [{ desc: "Cancel Show", label: "Cancel", func: "doCancelShow()" }]);
}

function findRestaurant(rstrntRef) {
    for (let item of dataStore) {
        if (item.rstrntRef == rstrntRef) {
            return item;
        }
    }
    return null;
}

function findLbrItmCntbtrName(srchName) {
    let lbrItmList = [];

    for (let item of dataStore) {
        for (let cntbrt of item.contributors) {
          if (cntbrt.contributor.name == srchName) {
             lbrItmList.push(item);
          }
        }
    }
    return lbrItmList;
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

function doSaveUpdate() {
    activeRstrnt.loadFromHTML();
    alert(activeRstrnt.type + " " + activeRstrnt.rstrntRef + " updated");
    saveDataStore();
    doShowMainMenu();
}


function doCancelShow() {
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

function doStartLbrCatlg(mainPageId, storeNameToUse) {
    mainPage = document.getElementById(mainPageId);

    storeName = storeNameToUse;
    

    var loadResult = loadDataStore();

    switch (loadResult) {
        case STORE_LOAD_OK:
            break;
        case STORE_EMPTY:
            alert("Empty Library Catalog created");
            saveDataStore();
            break;
        case STORE_INVALID:
            alert("Store invalid. Empty Library Catalog created");
            saveDataStore();
            break;
    }

    doShowMainMenu();
}

