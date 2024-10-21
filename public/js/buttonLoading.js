// Loading 
// Made this work on none buttons aswell 
//  Checks to see if the instanceof userButton is actually a button and if so it disables it
export function addLoadingToButton(button){
    const userButton = document.getElementById(button);
    if(userButton instanceof HTMLButtonElement){
        userButton.disabled = true;
    }
    const spinner = document.createElement("span");
    spinner.classList.add("spinner-border", "spinner-border-sm");
    spinner.setAttribute("id", "spinner");
    spinner.setAttribute("aria-hidden", "true");

    userButton.appendChild(spinner);
}

// Remove loading 
// Made this work on none buttons aswell 
//  Checks to see if the instanceof userButton is actually a button and if so it disables it
export function removeLoadingFromButton(button){
    const userButton = document.getElementById(button);
    if(userButton instanceof HTMLButtonElement){
        userButton.disabled = true;
    }
    const spinner = document.getElementById("spinner");
    const statusText = document.getElementById("statusText");
    const loading = document.getElementById("loading");
    if(userButton.contains(spinner)) {
        userButton.removeChild(spinner);
    }
    if(userButton.contains(statusText)) {
        userButton.removeChild(statusText);
    }
    if(userButton instanceof HTMLButtonElement){    
        userButton.disabled = false;
    }
}