class LibraryItem {

    static getLargestItemRef(LibraryItem) {
        if (LibraryItem.length == 0) {
            return 0;
        }

        var largest = LibraryItem[0].itemRef;

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
        { id: "title", prompt: "Title", type: "input" },
        { id: "upc", prompt: "UPC", type: "input" },
        { id: "subject", prompt: "Subject", type: "input"},
        { id: "contributors", prompt: "Contributors", type: "input"}
        ];

    static buildElementsFromSchema(HTMLdisplay, dataSchema) {
        // work through each of the items in the schema
        for (let item of dataSchema) {
            // make an element for that item
            let itemElement = Restaurant.makeElement(item);
            // add the element to the container
            HTMLdisplay.appendChild(itemElement);
        }
    }

    constructor(itemRef, title, upc, subject, contributors) {
        this.itemRef = itemRef;
        this.title = title;
        this.upc = upc;
        this.subject = subject;
        this.contributors = contributors;
    }

    getDescription() {
        var result = "ItemRef: " + this.itemRef +
            " Title: " + this.title +
            " UPC: " + this.upc +
            " subject: " + this.subject +
            " contributors: " + this.contributors;

        return result;
    }

    sendToHTML() {
        // work through each of the restaurants in the object
        for (let item in this) {
            if ( item == "itemRef") {
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
            if ( item == "itemRef") {
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

