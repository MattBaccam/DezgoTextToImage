// Creates popup alert
// alertID = type of custom defined alert rateLimit alert etc
// alertType = Bootstraps alert types alert-success, alert-danger, alert-warning etc
// message = message inside of alert
export function createAlert(alertID, alertType, message){
    if(!document.getElementById(alertID)){
        if(!(alertID && typeof alertID === "string") || 
            !(alertType && typeof alertType === "string") || 
            !(message && typeof message === "string")) {
            throw new Error("Alert Creation failed: One or more variables are NULL or not of type string.");
        }
        const alert = document.createElement("div");
        alert.classList.add("alert");
        alert.role = "alert";
        alert.classList.add("fade-in");
        alert.style.position = "fixed";
        alert.style.zIndex = 9999;
        alert.style.top = "0";
        alert.style.left = "0";


        alert.setAttribute("id", alertID);
        alert.classList.add(alertType);
        alert.innerText = message;

        alert.innerText = message;
        document.getElementsByTagName("body")[0].prepend(alert);
        
        //(5s total)
        setTimeout(() => {// Display the alert while fading in for 3 seconds
            alert.classList.remove("fade-in");
            alert.classList.add("fade-out");
            setTimeout(() => {// Waits 3 seconds before clearing the notification
                alert.remove();
            }, 3000);
        }, 3000); 
    }
}
