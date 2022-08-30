var mainPage;   // HTML element that contains the user interface
var dataStore;  // Array of Restaurants
var storeName;  // name of saved restaurants in local storage
var activeLibrary; // currently active Restaurant (for entry and edit)

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
        var dataArray = JSON.parse(dataArrayJSON);

        for (dataLine of dataArray) {
            dataStore[dataStore.length] = LibraryItem.JSONparse(dataLine);
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
        [{ desc: "Show Library Items", label: "Show", func: "doShowItems()" }, // Show Library Items
        { desc: "Search by Title", label: "Search", func: "doSearchByTitle()" }, // Search by title
        { desc: "Search by Subject", label: "Search", func: "doSearchBySubject()" },
        { desc: "Search by Contributors", label: "Search", func: "doSearchByContributors()" },
        { desc: "Register Library Item", label: "Register", func: "doRegisterItem()" },
        { desc: "Unregister Item", label: "Unregister", func: "doUnregisterItem()" },
        { desc: "Modify Library Item", label: "Modify", func: "doModifyItem()" },
        { desc: "Quit Catalog", label: "Quit", func: "quit()" }
        ]);
}

function doShowItems() {
    createList("Library Item List", dataStore);
    showMenu(
        [{ desc: "\n\n\nReturn to Main Menu", label: "Return", func: "doShowMainMenu()" }]);
    }

function doSearchByTitle() {

    openPage("Search Item by Title");

    LibraryItem.buildElementsFromSchema(mainPage, [{ id: "title", prompt: "Title to Search", type: "input" }]);

    showMenu(
        [{ desc: "Search Title", label: "Search", func: "doSearchSubject()" },
        { desc: "Cancel Search", label: "Cancel", func: "doShowMainMenu()" }]);    

}

function doSearchBySubject() {

    openPage("Search Item by Subject");

    LibraryItem.buildElementsFromSchema(mainPage, [{ id: "subject", prompt: "Subject to Search", type: "input" }]);

    showMenu(
        [{ desc: "Search Subject", label: "Search", func: "doSearchSubject()"},
        { desc: "Cancel Search", label: "Cancel", func: "doShowMainMenu()" }]);    
 
}

function doSearchByContributors() {

    openPage("Search Item by Contributors");

    LibraryItem.buildElementsFromSchema(mainPage, [{ id: "contributors", prompt: "Contributors to Search", type: "input" }]);

    showMenu(
        [{ desc: "Search Contributors", label: "Search", func: "doSearchContributors()"},
        { desc: "Cancel Search", label: "Cancel", func: "doShowMainMenu()" }]);    

}

function doSearchTitle() {

    var searchTitleElement = document.getElementById("title");
    var searchTitle = searchTitleElement.value;
    
    var libItem = findItemTitle(searchTitle);

    if (libItem != null){
        alert("Item Found!!");

        openPage("Found Item ");

        for (let item of dataStore) {
            if (item.title == searchTitle) {          
                let itemPar = createListElement(item);
                mainPage.appendChild(itemPar);         
                } 
            }
    }
    else{
        alert("Item is not Found!!");
    }

}

function doSearchSubject() {

    var searchSubjectElement = document.getElementById("subject");
    var searchSubject = searchSubjectElement.value;
    
    var libItem = findItemSubject(searchSubject);

    if (libItem != null){
        alert("Item Found!!");

        openPage("Found Item ");

        for (let item of dataStore) {
            if (item.subject == searchSubject) {          
                let itemPar = createListElement(item);
                mainPage.appendChild(itemPar);         
                } 
            }
    }
    else{
        alert("Item is not Found!!");
    }

    showMenu(
        [{ desc: "\n\n\nReturn to Main Menu", label: "Return", func: "doShowMainMenu()" }])

}

function doSearchContributors() {

    var searchContributorsElement = document.getElementById("contributors");
    var searchContributors = searchContributorsElement.value;
    
    var libItem = findItemContributors(searchContributors);

    if (libItem != null){
        alert("Item Found!!");

        openPage("Found Item ");

        for (let item of dataStore) {
            if (item.contributors == searchContributors) {          
                let itemPar = createListElement(item);
                mainPage.appendChild(itemPar);         
                } 
            }
    }
    else{
        alert("Item is not Found!!");
    }

    showMenu(
        [{ desc: "\n\n\nReturn to Main Menu", label: "Return", func: "doShowMainMenu()" }])

}

function doRegisterItem() {
    doChooseType();
}

function doChooseType() {
    openPage("Select Item Type");
    showMenu(
        [{ desc: "\n\nITEM", label: "Book", func: "addItem(Book)" },
        { desc: "ITEM", label: "CD", func: "addItem(CD)" },
        { desc: "ITEM", label: "DVD", func: "addItem(DVD)" },
        { desc: "ITEM", label: "Magazine", func: "addItem(Magazine)" }]);

        showMenu(
            [{ desc: "\n\n\t\tReturn to Main Menu", label: "Return", func: "doShowMainMenu()" }]);}
    

function addItem(addClass) {

    activeLibrary = new addClass();

    openPage("Register " );

    activeLibrary.getHTML(mainPage);

    showMenu(
        [{ desc: "Save Item", label: "Save", func: "doSaveAdd()" },
        { desc: "Cancel Add", label: "Cancel", func: "doShowMainMenu()" }]);
}

function doSaveAdd() {

    activeLibrary.loadFromHTML();

    var type = activeLibrary.constructor.name;
    activeLibrary.type = type;

    activeLibrary.itemRef = LibraryItem.getLargestItemRef(dataStore) + 1;
    dataStore[dataStore.length] = activeLibrary;
    alert(activeLibrary.itemRef + " added");
    saveDataStore();
    doShowMainMenu();
}

function setType() {
    this.type = "Book";
}

function doUnregisterItem() {
    openPage("Unregister ");
    LibraryItem.buildElementsFromSchema(mainPage,
        [{ id: "title", prompt: "Title to Unregister", type: "input" }]);
    
    showMenu(
        [{ desc: "Unregister Item", label: "Unregister", func: "doUnregister()" },
        { desc: "Cancel Search", label: "Cancel", func: "doShowMainMenu()" }]);
}


function doUnregister() {
    var unregisterNameElement = document.getElementById("title");
    var unregisterName = unregisterNameElement.value; 

    var flag = unregisterLibraryItem(unregisterName);
    if (flag !== null){
       alert("Item " + unregisterName + " Unregistered.");
    }
    else{
       alert("Item " + unregisterName + " is not Found!!");
    }
    doUnregisterItem();
}

function unregisterLibraryItem(LibraryItem) {
    let index = 0;
    for (let item of dataStore) {
        if (item.title == LibraryItem) {
            dataStore.splice(index,1);
            return index;
        }
        index++;
    }
    return null;
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

function findRestaurant(rstrntRef) {
    for (let item of dataStore) {
        if (item.rstrntRef == rstrntRef) {
            return item;
        }
    }
    return null;
}

function findItemTitle(itemTitle) {
    for (let item of dataStore) {
        if (item.title == itemTitle) {
            return item;
        }
    }
    return null;
}

function findItemSubject(itemSubject) {
    for (let item of dataStore) {
        if (item.subject == itemSubject) {
            return item;
        }
    }
    return null;
}

function findItemContributors(itemContbr) {
    for (let item of dataStore) {
        if (item.contributors == itemContbr) {
            return item;
        }
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

function doModifyItem() {
    openPage("Modify Item");
    LibraryItem.buildElementsFromSchema(mainPage,
        [{ id: "title", prompt: "Title to Modify", type: "input" }]);

    showMenu(
        [{ desc: "Search Item fo Modify", label: "Search", func: "doModify(title)"},
        { desc: "Cancel Modification", label: "Cancel", func: "doShowMainMenu()" }]);
}

function doModify(title) {

    var searchRefElement = document.getElementById("title");
    var searchRef = searchRefElement.value;

    var library = findItemTitle(searchRef);

    if (library == null) {
        return false;
    }

    activeLibrary = library;

    openPage("Modify "  + searchRef);
    library.getHTML(mainPage);

    library.sendToHTML();

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
    activeLibrary.loadFromHTML();
    alert("Library Item " + activeLibrary.title + " Modified.");
    saveDataStore();
    doShowMainMenu();
}

function quit() {
    window.close()
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

