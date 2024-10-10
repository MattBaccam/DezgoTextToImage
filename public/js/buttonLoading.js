//Loading 
export function addLoadingToButton(button){
    const userButton = document.getElementById(button);
    userButton.disabled = true;
    const spinner = document.createElement("span");
    spinner.classList.add("spinner-border", "spinner-border-sm");
    spinner.setAttribute("id", "spinner");
    spinner.setAttribute("aria-hidden", "true");

    userButton.appendChild(spinner);
}

//Remove loading 
export function removeLoadingFromButton(button){
    const userButton = document.getElementById(button);

    const spinner = document.getElementById("spinner");
    const statusText = document.getElementById("statusText");
    const loading = document.getElementById("loading");
    if(userButton.contains(spinner)) {
        userButton.removeChild(spinner);
    }
    if(userButton.contains(statusText)) {
        userButton.removeChild(statusText);
    }
    userButton.disabled = false;
}