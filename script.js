
let $ = function ( selector, parent ) {
    return ( parent ? parent : document ).querySelector( selector );
};

let getById = function ( selector ) {
    return document.getElementById( selector );
};

let getByTag = function ( selector ) {
    return document.getElementsByTagName( selector );
};

let getByClass = function ( selector ) {
    return document.getElementsByClassName( selector );
};

const start = getById( "start" );
const reset = getById( "reset" );
const finish = getById( "finish" );
const inputs = getByTag( "input" );
let statistics = document.querySelectorAll( "ul:last-child li" );

start.addEventListener( "click", () => {
    // Checks if all the inputs have some kind of value
    if ( start.innerText === "START" && checkEmptyInputs() ) { getById( "required" ).style.opacity = 1; }
    else if ( start.innerText === "START" ) { timer(); }

    if ( start.innerText !== "START" || start.innerText === "START" && !checkEmptyInputs() ) {
        // Disables styles to divs that are used when checking whether any inputs are empty
        getById( "required" ).style.transition = "none";
        getById( "required" ).style.opacity = 0;
        getById( "required" ).style.display = "none";
        reset.style.display = "initial";
        colorChange();
    }
} );

reset.addEventListener( "click", resetEverything );
reset.addEventListener( "click", resetStats );
finish.addEventListener( "click", displayStats );

// Changes and displays active time and sets once started, when written(changed) in input
inputs[ 0 ].addEventListener( "change", () => {
    $( "#timer p" ).innerText = inputs[ 0 ].value;
} );

inputs[ 0 ].addEventListener( "keyup", () => {
    $( "#timer p" ).innerText = inputs[ 0 ].value;
} );

inputs[ 2 ].addEventListener( "change", () => {
    $( "#sets p" ).innerText = inputs[ 2 ].value;
} );

inputs[ 2 ].addEventListener( "keyup", () => {
    $( "#sets p" ).innerText = inputs[ 2 ].value;
} );

// Start timer when "START" button is pressed
function timer () {
    // First start
    if ( $( "#action p" ).innerText === "" ) {
        getByTag( "form" )[ 0 ].style.display = "none";       // Hides form
        start.style.top = "100px";                        // Lowers down `START` button
        reset.style.top = "100px";                        // Lowers down `RESET` button
        $( "#action p" ).innerText = "Get Ready!";          // Changes action text
        $( "#timer p" ).innerText = 5;                     // Initial countdown ("Get Ready!")
        $( ".information.stats" ).style.dataCount = "true"; // Starts tracking statistics

        // Displays all the necessary exercise information
        getById( "action" ).style.display = "initial";
        getById( "sets" ).style.display = "initial";
        getById( "timer" ).style.display = "initial";

        resetStats();
    }
    if ( reset.style.dataReset !== "true" ) {
        setInterval( countdown, 1000 );
    }
}

// Stop timer (when all exercises and sets are finished)
function stopTimer () {
    resetEverything();
    start.style.display = "none";
    finish.style.display = "initial";
    getByTag( "form" )[ 0 ].style.display = "none"; // Hides form
    getById( "page" ).style.backgroundColor = "#7c1b1fe6";
    getByClass( "congratulations" )[ 0 ].style.display = "flex";
}

// Executes when "RESET" button is pressed
function resetEverything () {
    if ( start.style.display = "none" ) { start.style.display = "initial"; }
    getByClass( "stats" )[ 0 ].style.display = "none"; // Hides statistics

    start.innerText = "START";
    reset.style.dataReset = "true"; // Indication that timer has been reset
    $( ".information.stats" ).style.dataCount = "false"; // Disables statistics tracking
    reset.style.display = "none"; // Hides "RESET" button

    getById( "page" ).style.backgroundColor = "#535354";

    // Displays form and repositions buttons
    getByTag( "form" )[ 0 ].style.display = "flex";
    start.style.top = "120px";
    reset.style.top = "120px";

    // Resets values that are shown during exercise
    $( "#action p" ).innerText = "";
    $( "#timer p" ).innerText = "";
    $( "#sets p" ).innerText = "";

    // Resets inputs' values
    inputs[ 0 ].value = "";
    inputs[ 1 ].value = "";
    inputs[ 2 ].value = "";

    // Hides the information related to exercises
    getById( "action" ).style.display = "none";
    getById( "sets" ).style.display = "none";
    getById( "timer" ).style.display = "none";

    // Applies styles to divs that are used when checking whether any inputs are empty
    getById( "required" ).style.opacity = 0;
    getById( "required" ).style.display = "initial";
    getById( "required" ).style.transition = "opacity 0.5s";
}

// Display
function displayStats () {
    getById( "page" ).style.backgroundColor = "#535354";
    finish.style.display = "none";
    reset.style.display = "initial"
    getByClass( "information" )[ 1 ].style.display = "none";
    getByClass( "stats" )[ 0 ].style.display = "flex";
    reset.style.top = "100px";

    // Total time
    statistics[ 4 ].innerText = ( +statistics[ 1 ].innerText ) +
        ( +statistics[ 2 ].innerText ) +
        ( +statistics[ 3 ].innerText );
}

// Checks if either of the inputs are empty
function checkEmptyInputs () {
    return inputs[ 0 ].value == "" ||
        inputs[ 1 ].value == "" ||
        inputs[ 2 ].value == "" ?
        true : false;
}

// Changes color and button text when either of the buttons are pressed
function colorChange () {
    let color = getById( "page" );
    let actionText = $( "#action p" ).innerText;

    if ( actionText === "Get Ready!" && start.innerText === "PAUSE" ) {
        start.innerText = "CONTINUE";
        color.style.backgroundColor = "#535354";
    }
    else if ( actionText === "Get Ready!" && start.innerText === "CONTINUE" ) {
        start.innerText = "PAUSE";
        color.style.backgroundColor = "#535354";
    }
    else if ( actionText === "Get Ready!" ) {
        start.innerText = "PAUSE";
    }
    else if ( actionText === "WORK" && start.innerText === "CONTINUE" ) {
        start.innerText = "PAUSE";
        color.style.backgroundColor = "#118007";
    }
    else if ( actionText === "BREAK" && start.innerText === "CONTINUE" ) {
        start.innerText = "PAUSE";
        color.style.backgroundColor = "#535354";
    }
    else {
        start.innerText = "CONTINUE";
        color.style.backgroundColor = "#535354";
    }
}

// Counts down time and changes things related to time
function countdown () {
    countTime();
    // Executes if timer is not paused
    if ( start.innerText === "PAUSE" || start.innertext === "BREAK" ) {
        let time = $( "#timer p" ).innerText,
            action = $( "#action p" ).innerText,
            color = getById( "page" ),
            active = inputs[ 0 ].value,
            pause = inputs[ 1 ].value,
            sets = $( "#sets p" ).innerText;

        // Subtracts 1 second from running time
        $( "#timer p" ).innerText--;

        // After a repetition is finished: changes screen color, exercise text, action text
        // After a set is finished: lowers sets number by 1
        // After all sets are finished: executes "stopTimer"
        if ( time <= 1 && action === "Work" ) {
            // Changes from work to break
            $( "#timer p" ).innerText = pause;
            $( "#action p" ).innerText = "Break";
            color.style.backgroundColor = "#6e4804";

            // Changes exercise text after one is finished and lowers sets number if all exercises are finished
            $( "#sets p" ).innerText = --sets;

            // Stops the timer after all sets are finished
            if ( sets == 0 ) { stopTimer(); }
        }
        else if ( time <= 1 && action === "Break" ) {
            // Changes from break to work
            $( "#timer p" ).innerText = active;
            $( "#action p" ).innerText = "Work";
            color.style.backgroundColor = "#118007";
        }
        else if ( time <= 1 && action === "Get Ready!" ) {
            // Used only for first start. Changes from get ready to work
            $( "#timer p" ).innerText = active;
            $( "#action p" ).innerText = "Work";
            color.style.backgroundColor = "#118007";
        }
    }
}

function countTime () {
    if ( $( ".information.stats" ).style.dataCount === "true" ) {
        let action = $( "#action p" ).innerText;
        if ( start.innerText === "CONTINUE" ) { statistics[ 3 ].innerText++; }
        else if ( action === "Work" ) { statistics[ 1 ].innerText++; }
        else if ( action === "Break" ) { statistics[ 2 ].innerText++; }
    }
}

function countSets () {
    if ( $( ".information.stats" ).style.dataCount === "true" ) {
        statistics[ 5 ].innerText++;
    }
}

function resetStats () {
    statistics[ 1 ].innerText = 0;
    statistics[ 2 ].innerText = 0;
    statistics[ 3 ].innerText = 0;
    statistics[ 5 ].innerText = 0;
    statistics[ 7 ].innerText = 0;
}
