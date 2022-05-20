let myDocument = document.documentElement;
const defaultSettings = new Map([
    ['presetName', 'Default'],
    ['roundCount', 3], 
    ['activeTime', 30], 
    ['breakTime', 15], 
    ['endWarningTime', 10], 
    ['prepareTime', 10], 
    ['enableBreakTime', true], 
    ['enableKeepScreen', false], 
    ['startSound', 'startRound.mp3'],
    ['beforeRoundEndSound', 'break.mp3'],
    ['beforeRestEndSound', 'notificationTest.mp3'],
    ['innerRoundSound', 'notificationTest.mp3'],
    ['useCustomColors', false],
    ['roundColor', '#118007'],
    ['warningColor', '#80827f'],
    ['restColor', '#6e4804']
    ]);
var currentSettings = new Map(defaultSettings);
var globalTime = defaultSettings.get('prepareTime');
var fullscreenImages = [ "icons/fullON.svg", "icons/fullOFF.svg" ];
var fullscreenImageNumber = 0;

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
const fullscreen = getById( "fullscreen" );
const slider = getById( "myVolRange" );

slider.addEventListener( "mousemove", () => {
    var x = slider.value;
    var color = 'linear-gradient(90deg, rgb(117,252,117)' + x + '%, rgb(214, 214, 214)' + x + '%)';
    slider.style.background = color;
} );

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

function changeFullscreenImage () {
    if ( fullscreenImageNumber < 1 ) {
        fullscreenImageNumber++;
    } else {
        fullscreenImageNumber = 0;
    }
    fullscreen.src = fullscreenImages[ fullscreenImageNumber ];
}

function smolScreen () {
    if ( document.exitFullscreen ) {
        document.exitFullscreen();
    }
    else if ( document.msexitFullscreen ) {
        document.msexitFullscreen();
    }
    else if ( document.mozexitFullscreen ) {
        document.mozexitFullscreen();
    }
    else if ( document.webkitexitFullscreen ) {
        document.webkitRequestFullscreen();
    }
}

function bigScreen () {
    if ( myDocument.requestFullscreen ) {
        myDocument.requestFullscreen();
    }
    else if ( myDocument.msRequestFullscreen ) {
        myDocument.msRequestFullscreen();
    }
    else if ( myDocument.mosRequestFullscreen ) {
        myDocument.msRequestFullscreen();
    }
    else if ( myDocument.webkitRequestFullscreen ) {
        myDocument.webkitRequestFullscreen();
    }
}

fullscreen.addEventListener( "click", () => {
    if ( fullscreen.src = fullscreenImages[ 0 ] ) {
        bigScreen();
    }

    if ( fullscreen.src = fullscreenImages[ 1 ] ) {
        smolScreen();
    }
    changeFullscreenImage();
} )

reset.addEventListener( "click", resetEverything );
finish.addEventListener( "click", displayStats );

function loadSettingsOnStart () {
    $( "#timer p" ).innerText = currentSettings.get('activeTime');
    $( "#sets p" ).innerText = currentSettings.get('roundCount');
}

function playAudio ( url ) {
    notif = new Audio( url );
    notif.volume = slider.value / 100;
    notif.play();
}

// Start timer when "START" button is pressed
function timer () {
    loadSettingsOnStart();
    // First start
    if ( $( "#action p" ).innerText === "" ) {
        //getByTag( "form" )[ 1 ].style.display = "none";       // Hides form
        start.style.top = "100px";                        // Lowers down `START` button
        reset.style.top = "100px";                        // Lowers down `RESET` button
        $( "#action p" ).innerText = "Get Ready!";          // Changes action text
        $( "#timer p" ).innerText = currentSettings.get('prepareTime');                     // Initial countdown ("Get Ready!")

        // Displays all the necessary exercise information
        getById( "action" ).style.display = "initial";
        getById( "sets" ).style.display = "initial";
        getById( "timer" ).style.display = "initial";

    }
    if ( reset.style.dataReset !== "true" ) {
        setInterval( countdown, 1000 );
    }
}

// Stop timer (when all exercises and sets are finished)
function stopTimer () {
    playAudio( "sounds/endSets.mp3" );
    resetEverything();
    start.style.display = "none";
    finish.style.display = "initial";
    //getByTag( "form" )[ 1 ].style.display = "none"; // Hides form
    var endCol = 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)';
    getById( "page" ).style.background = endCol;
    getByClass( "congratulations" )[ 0 ].style.display = "flex";
}

// Executes when "RESET" button is pressed
function resetEverything () {
    globalTime = currentSettings.get('prepareTime');

    start.innerText = "START";
    reset.style.dataReset = "true"; // Indication that timer has been reset
    reset.style.display = "none"; // Hides "RESET" button
    getById( "page" ).style.background = "#535354";
    getById( "page" ).style.backgroundColor = "#535354";

    // Displays form and repositions buttons
    //getByTag( "form" )[ 1 ].style.display = "flex";
    start.style.top = "120px";
    reset.style.top = "120px";

    // Resets values that are shown during exercise
    $( "#action p" ).innerText = "";
    $( "#timer p" ).innerText = "";
    $( "#sets p" ).innerText = "";

    // Resets inputs' values
    document.getElementById( "active-time" ).value = currentSettings.get('activeTime');
    document.getElementById( "break-time" ).value = currentSettings.get('breakTime');
    document.getElementById( "rounds-count" ).value = currentSettings.get('roundCount');

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
}

// Checks if either of the inputs are empty
function checkEmptyInputs () {
    /*
    return document.getElementById( "active-time" ).value == "" ||
        document.getElementById( "break-time" ).value == "" ||
        document.getElementById( "rounds-count" ).value == "" ?
        true : false;
    */
   return false;
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
    else if ( actionText === "Work" && start.innerText === "CONTINUE" ) {
        start.innerText = "PAUSE";
        color.style.backgroundColor = "#118007";
    }
    else if ( actionText === "Break" && start.innerText === "CONTINUE" ) {
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
    // Executes if timer is not paused
    if ( start.innerText === "PAUSE" || start.innertext === "BREAK" ) {
        let time = globalTime,
            action = $( "#action p" ).innerText,
            color = getById( "page" ),
            active = currentSettings.get('activeTime'),
            pause = currentSettings.get('breakTime'),
            sets = $( "#sets p" ).innerText;

        // Subtracts 1 second from running time
        globalTime--;
        if ( action === "Get Ready!" ) $( "#timer p" ).innerText = globalTime;
        else $( "#timer p" ).innerText = String( ~~( globalTime / 60 ) + ':' + String( globalTime % 60 ).padStart( 2, '0' ) );

        // After a repetition is finished: changes screen color, exercise text, action text
        // After a set is finished: lowers sets number by 1
        // After all sets are finished: executes "stopTimer"
        if ( time <= 1 && action === "Work" ) {
            // Changes from work to break
            playAudio(String("sounds/" + currentSettings.get('beforeRoundEndSound'))); // break sound
            globalTime = pause;
            $( "#timer p" ).innerText = String( ~~( globalTime / 60 ) + ':' + String( globalTime % 60 ).padStart( 2, '0' ) );
            $( "#action p" ).innerText = "Break";
            color.style.backgroundColor = "#6e4804";

            // Changes exercise text after one is finished and lowers sets number if all exercises are finished
            $( "#sets p" ).innerText = --sets;

            // Stops the timer after all sets are finished
            if ( sets == 0 ) { stopTimer(); }
        }
        else if ( time <= 1 && action === "Break" ) {
            // Changes from break to work
            playAudio(String("sounds/" + currentSettings.get('startSound')));
            globalTime = active;
            $( "#timer p" ).innerText = String( ~~( globalTime / 60 ) + ':' + String( globalTime % 60 ).padStart( 2, '0' ) );
            $( "#action p" ).innerText = "Work";
            color.style.backgroundColor = "#118007";
        }
        else if ( time <= 1 && action === "Get Ready!" ) {
            // Used only for first start. Changes from get ready to work
            playAudio(String("sounds/" + currentSettings.get('startSound')));
            globalTime = active;
            $( "#timer p" ).innerText = String( ~~( globalTime / 60 ) + ':' + String( globalTime % 60 ).padStart( 2, '0' ) );
            $( "#action p" ).innerText = "Work";
            color.style.backgroundColor = "#118007";
        }
    }
}

var settingsWindow = document.getElementById( "settingsWindow" );

var settings = document.getElementById( "settings" );

var span = document.getElementsByClassName( "close" )[ 0 ];

var saveSettings = document.getElementById( "saveSettings" );

settings.onclick = function () {
    settingsWindow.style.display = "block";
}

function saveToCurrentSettings () {
    let i = 0;
    for (const key of currentSettings.keys()) {
        if (key !== 'startSound' && key !== 'beforeRoundEndSound' && key !== 'beforeRestEndSound' && key !== 'innerRoundSound' ){
            //console.log(key);
            if (i !== 6 && i !== 7 && i !== 8){currentSettings.set(key, String(inputs[i].value));}
            else {currentSettings.set(key, inputs[i].checked);}
            i = i + 1;
        }
    }
    currentSettings.set('startSound', document.getElementById('start-sound').value);
    currentSettings.set('beforeRoundEndSound', document.getElementById('before-round-sound').value);
    currentSettings.set('beforeRestEndSound', document.getElementById('before-rest-sound').value);
    currentSettings.set('innerRoundSound', document.getElementById('inner-round-sound').value);
}

saveSettings.onclick = function () {
    saveToCurrentSettings();
    globalTime = currentSettings.get('prepareTime');
    settingsWindow.style.display = "none";
}

span.onclick = function () {
    settingsWindow.style.display = "none";
}
