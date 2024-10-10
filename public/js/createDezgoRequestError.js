// Creates an error for the api requests
// Returns a json response with error code and message
// Intended for server side requests
// res = the response in which the error occured
// error = the error  in the catch where this was called
export function createError(res, error){
    let statusCode = 500;
    let customMessage = "An unknown error occurred.";

    if (error.response) {
        statusCode = error.response.status;
        
        switch (statusCode) {
        case 400:
            customMessage = `Bad Request ${statusCode}: The server could not understand the request.`;
            break;
        case 401:
            customMessage = `Unauthorized ${statusCode}: You do not have the proper authorization.`;
            break;
        case 404:
            customMessage = `Not Found ${statusCode}: The requested resource could not be found.`;
            break;
        case 500:
            customMessage = `Internal Server Error ${statusCode}: Something went wrong on the server.`;
            break;
        default:
            customMessage = `Error ${statusCode}: ${error.response.statusText}`;
        }
    } else if (error.request) {
        customMessage = "No response from API. Please check your network connection.";
    } else {
        customMessage = `Error in request setup: ${error.message}`;
    }

    res.status(statusCode).json({ requestError: customMessage });
}