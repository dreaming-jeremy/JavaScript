class LibraryItem {

    static getLargestItemRef(LibraryItems) {
        if (LibraryItems.length == 0) {
            return 0;
        }

        var largest = LibraryItems[0].itemRef;

        for (const libitem of LibraryItems) {
            if (libitem.itemRef > largest) {
                largest = libitem.itemRef;
            }
        }

        return largest;
    }

    static makeElement(description) {
        // Create the enclosing paragraph
        var inputPar = document.createElement("p");

        // Create the label for the element
        var labelElement = document.createElement("label");
        labelElement.innerText = description.prompt + ":";
        labelElement.className = "inputLabel";
        labelElement.setAttribute("for", description.id);
        inputPar.appendChild(labelElement);

        var inputElement;

        // decide what kind of element to make
        switch (description.type) {
            case "input":
                inputElement = document.createElement("input");
                inputElement.className = "inputText";
                break;

            case "textarea":
                inputElement = document.createElement("textarea");
                inputElement.className = "inputTextarea";
                inputElement.setAttribute("rows", description.rows);
                inputElement.setAttribute("cols", description.cols);
                break;
            // add new kinds of element here
        }

        // set the id for the element
        inputElement.setAttribute("id", description.id);
        // give the element an initial value
        inputElement.setAttribute("value", "");
        // add the element to the paragraph
        inputPar.appendChild(inputElement);
        // return the whole paragraph
        return inputPar;
    }

    static LibraryItemSchema = [
        { id: "title", prompt: "Title", type: "input"},
        { id: "upc", prompt: "UPC", type: "input"},
        { id: "subject", prompt: "Subject", type: "input"},
        { id: "contributors", prompt: "Contributors", type: "input"}
        ];

    static JSONparse(text) {
        var rawObject = JSON.parse(text);
        var result = null;
    
        switch (rawObject.type) {
            case "book":
                result = new Book();
                break;
            case "CD":
                result = new CD();
                break;
            case "DVD":
                result = new DVD();
                break;
            case "Magazine":
                result = new Magazine();
                break;
            }
    
            Object.assign(result, rawObject);
            return result;
        }

    static buildElementsFromSchema(HTMLdisplay, dataSchema) {
        // work through each of the items in the schema
        for (let item of dataSchema) {
            // make an element for that item
            let itemElement = LibraryItem.makeElement(item);
            // add the element to the container
            HTMLdisplay.appendChild(itemElement);
        }
    }

    constructor(type, itemRef, title, upc, subject, contributors) {
        this.type = type;
        this.itemRef = itemRef;
        this.title = title;
        this.upc = upc;
        this.subject = subject;
        this.contributors = contributors;
    }

    describeItem() {
        var result = "Type : " + this.type + " ItemRef: " + this.itemRef +
            " Title: " + this.title +
            " UPC: " + this.upc +
            " subject: " + this.subject +
            " contributors: " + this.contributors;

        return result;
    }

    sendToHTML() {
        // work through each of the restaurants in the object
        for (let item in this) {
            if ( item == "itemRef" || item == "type") {
                // don't add the type or itemRef to the HTML
                continue;
            }
            // get the element to send to
            let itemElement = document.getElementById(item);
            // set the element to the value in this object
            itemElement.value = this[item];
        }
    }

    loadFromHTML() {
        // work through each of the restaurants in the object
        for (let item in this) {
            if ( item == "itemRef" || item == "type") {
                // don't load the type or stockref from the HTML
                continue;
            }
            // get the element to load from
            let itemElement = document.getElementById(item);
            // set the element to the value in this object
            this[item] = itemElement.value;
        }
    }
   
    getHTML(containerElementId) {
        LibraryItem.buildElementsFromSchema(containerElementId, LibraryItem.LibraryItemSchema);
    }

    JSONstringify() {
        return JSON.stringify(this);
    }
    
}

class Book extends LibraryItem {

    static BookSchema = [{id: "isbn", prompt: "ISBN", type: "input"},
        {id: "dds_number", prompt: "DDS_number", type: "input"}];
    constructor(type, itemRef, title, upc, subject, contributors, isbn, dds_number) {
        super(type, itemRef, title, upc, subject, contributors);
        this.isbn = isbn;
        this.dds_number = dds_number;
    }

    getHTML(containerElementId) {
        super.getHTML(containerElementId);
        Book.buildElementsFromSchema(containerElementId, Book.BookSchema);
    }

    getDescription() {
        var result = super.describeItem() +
          " ISBN: " + this.isbn + " DDS_number: " + this.dds_number ;

        return result;
    }
}

class CD extends LibraryItem {

    constructor(type, itemRef, title, upc, subject, contributors) {
        super(type, itemRef, title, upc, subject, contributors);
    }

    getHTML(containerElementId) {
        super.getHTML(containerElementId);
    }

    getDescription() {
        var result = super.describeItem();

        return result;
    }
}

class DVD extends LibraryItem {
    static DVDSchema = [{id: "genre", prompt: "Genre", type: "input"}];

    constructor(type, itemRef, title, upc, subject, contributors, genre) {
        super(type, itemRef, title, upc, subject, contributors);
        this.genre = genre;
    }

    getHTML(containerElementId) {
        super.getHTML(containerElementId);
        DVD.buildElementsFromSchema(containerElementId, DVD.DVDSchema);
    }

    getDescription() {
        var result = super.describeItem() +
          " genre: " + this.genre;

        return result;
    }
}

class Magazine extends LibraryItem {
    static MagazineSchema = [{id: "volume", prompt: "Volume", type: "input"},
                        {id: "issue", prompt: "Issue", type: "input"}];

    constructor(type, itemRef, title, upc, subject, contributors, volume, issue) {
        super(type, itemRef, title, upc, subject, contributors);
        this.volume = volume;
        this.issue = issue;
    }

    getHTML(containerElementId) {
        super.getHTML(containerElementId);
        Magazine.buildElementsFromSchema(containerElementId, Magazine.MagazineSchema);
    }

    getDescription() {
        var result = super.describeItem() +
          " Volume: " + this.volume + " Issue: " + this.issue ;

        return result;
    }
}