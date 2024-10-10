//This is the star effect for the background
window.addEventListener("load", function() {
    //Adds the background effect
    const canvas = document.getElementById('backgroundCanvas')
    const starback = new Starback(canvas, {
        type: 'dot',
        quantity: 125,
        direction: 180,
        starColor: '#313b4b',
        backgroundColor: '#15191d',
        randomOpacity: true
    });
    canvas
});