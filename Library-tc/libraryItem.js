class LibraryItem {

    static getLargestLbrItmRef(lbrItms) {
        if (lbrItms.length == 0) {
            return 0;
        }

        var largest = lbrItms[0].lbrItmRef;

        for (const lbrItm of lbrItms) {
            if (lbrItm.lbrItmRef > largest) {
                largest = lbrItm.lbrItmRef;
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

    static LbrItmSchema = [
        { id: "title", prompt: "Title", type: "input" },
        { id: "contributors", prompt: "Contributors", type: "input"},
        { id: "upc", prompt: "UPC", type: "input" },
        { id: "subject", prompt: "Subject", type: "input" },
        { id: "description", prompt: "Description", type: "textarea", rows: 5, cols: 40 }
        ];

    static SrchSchema = [
        { id: "cntbtr-name", prompt: "Contributors", type: "input"}
        ];

    static buildElementsFromSchema(HTMLdisplay, dataSchema) {
        // work through each of the items in the schema
        for (let item of dataSchema) {
            // make an element for that item
            let itemElement = LibraryItem.makeElement(item);
            // add the element to the container
            HTMLdisplay.appendChild(itemElement);
        }
    }

    constructor(lbrItmRef, title, upc, subject, description, contributors) {
        this.lbrItmRef = lbrItmRef;
        this.title = title;
        this.upc = upc;
        this.subject = subject;
        this.description = description;
        this.contributors = contributors;
    }

    getDescription() {
        var result = "Ref:" + this.lbrItmRef +
            " Title:" + this.title +
            " UPC:" + this.upc +
            " Subject:" + this.subject +
            " Description:" + this.description;
        return result;
    }

    sendToHTML() {
        // work through each of the attributes in the object
        for (let attrb in this) {
            if ( attrb == "lbrItmRef" ) {
                // don't add the lbrItmRef to the HTML
                continue;
            }
            // get the element to send to
            let attrbElement = document.getElementById(attrb);
            // set the element to the value in this object
            attrbElement.value = this[attrb];
        }
    }

    loadFromHTML() {

        // work through each of the attributes in the object
        for (let attrb in this) {
            if ( attrb == "lbrItmRef" || attrb == "type") {
                // don't load the lbrItmRef from the HTML
                continue;
            }

           // get the element to load from
           let attrbElement = document.getElementById(attrb);
           if (attrb != "contributors") {
              this[attrb] = attrbElement.value;
           } else {
              let cntbtrs = [];
              let cntbtrsA = attrbElement.value.split(/,/);
              for (let cntbtr of cntbtrsA) {
                 let cntbtrT = new ContributorWithType(cntbtr.trim(),"Author");
                 cntbtrs.push(cntbtrT);
              }
              this[attrb] = cntbtrs;
           }
            
            // set the element to the value in this object
            
        }

       // let cntbtrElement = document.getElementById("cntbtr-cnt");
       // cntbtrCnt = cntbtrElement.value;

    }

       
    getHTML(containerElementId) {
        LibraryItem.buildElementsFromSchema(containerElementId, LibraryItem.LbrItmSchema);
    }

    JSONstringify() {
        return JSON.stringify(this);
    }

    static JSONparse(text) {
        var rawObject = JSON.parse(text);
        var result = null;
        var cntbrtwt = null;  // ContributorWithType object
        var cntbrtwtAry =[]; // ContributorWithType object Array

        var cntBrts = rawObject.contributors; // ContributorWithType Array
        for (let cntBrtWType of cntBrts) {
            cntbrtwt = new ContributorWithType();
            Object.assign(cntbrtwt, cntBrtWType);
            cntbrtwtAry.push(cntbrtwt);
        }
        
        rawObject.contributors = cntbrtwtAry;


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
    
}

class Book extends LibraryItem {

    static BookSchema = [
        { id: "isbn", prompt: "ISBN", type: "input" },
        { id: "ddsnumber", prompt: "DDS Number", type: "input" }
        ];

    constructor(lbrItmRef, title, upc, subject, description, contributors, isbn, ddsnumber ){
        super(lbrItmRef, title, upc, subject, description, contributors )
        this.type = "book";
        this.isbn = isbn;
        this.ddsnumber = ddsnumber;
    }

    getHTML(containerElementId) {
        super.getHTML(containerElementId);
        LibraryItem.buildElementsFromSchema(containerElementId, Book.BookSchema);

    }

    getDescription() {

        var result = super.getDescription();

        let cntbrtStr = "";
        let cntBrts = this.contributors;

        for (let cntbrt of cntBrts) {
            cntbrtStr += cntbrt.getDescription() + " ";
        }
        
        var result = result +  " Contributors:" + cntbrtStr;
        return result;
    }
    
}

class ContributorWithType {

    constructor( name, type){
        this.contributor = new Contributor(name);
        this.type= type;
    } 

    getDescription() {
        var result = "Name:" + this.contributor.getDescription() +
             " Type:" + this.type;

        return result; 
    }
   
}

class Contributor {
    constructor(name) {
        this.name = name;
    }

    getDescription() {
        return this.name;
    }
}
