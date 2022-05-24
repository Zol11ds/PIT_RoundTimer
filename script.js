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
    ['breakSound', 'break.mp3'],
    ['warningSound', 'notificationTest.mp3'],
    ['endSound', 'endSets.mp3'],
    ['useCustomColors', false],
    ['roundColor', '#118007'],
    ['warningColor', '#b04a0b'],
    ['restColor', '#b08909']
    ]);

const presetSettings1 = new Map([
    ['presetName', 'Sparring'],
    ['roundCount', 6], 
    ['activeTime', 60], 
    ['breakTime', 25], 
    ['endWarningTime', 15], 
    ['prepareTime', 5], 
    ['enableBreakTime', true], 
    ['enableKeepScreen', true], 
    ['startSound', 'break.mp3'],
    ['breakSound', 'startRound.mp3'],
    ['warningSound', 'notificationTest.mp3'],
    ['endSound', 'endSets.mp3'],
    ['useCustomColors', true],
    ['roundColor', '#16C4CC'],
    ['warningColor', '#1C16CC'],
    ['restColor', '#8D1846']
    ]);
var currentSettings = new Map(defaultSettings);
var presetSettings2 = null;

var globalTime = defaultSettings.get('prepareTime');
var fullscreenImages = [ "icons/fullON.svg", "icons/fullOFF.svg" ];
var fullscreenImageNumber = 0;
let wakeLock = null;

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


updateSettingsInputs();
/*
getById("preset-name").value = defaultSettings.get("presetName");
getById("rounds-count").value = defaultSettings.get("roundCount");
getById("active-time").value = defaultSettings.get("activeTime");
getById("break-time").value = defaultSettings.get("breakTime");
getById("warning-time").value = defaultSettings.get("endWarningTime");
getById("prepare-time").value = defaultSettings.get("prepareTime");
*/
function updateSettingsInputs () {
    getById("preset-name").value = currentSettings.get("presetName");
    getById("rounds-count").value = currentSettings.get("roundCount");
    getById("active-time").value = currentSettings.get("activeTime");
    getById("break-time").value = currentSettings.get("breakTime");
    getById("warning-time").value = currentSettings.get("endWarningTime");
    getById("prepare-time").value = currentSettings.get("prepareTime");
    getById("enable-rests").checked = currentSettings.get("enableBreakTime");
    getById("enable-keepscreen").checked = currentSettings.get("enableKeepScreen");
    getById("start-sound").value = currentSettings.get("startSound");
    getById("break-start").value = currentSettings.get("breakSound");
    getById("warning-sound").value = currentSettings.get("warningSound");
    getById("end-sound").value = currentSettings.get("endSound");
    getById("enable-colors").checked = currentSettings.get("useCustomColors");
    getById("round-color").value = currentSettings.get("roundColor");
    getById("warning-color").value = currentSettings.get("warningColor");
    getById("rest-color").value = currentSettings.get("restColor");

    if (getById("enable-colors").checked == true){
        getById("round-color").disabled = false;
        getById("warning-color").disabled = false;
        getById("rest-color").disabled = false;
    }
    else{
        getById("round-color").disabled = true;
        getById("warning-color").disabled = true;
        getById("rest-color").disabled = true;
    }

    if (getById("enable-rests").checked == true){
        getById("break-time").disabled = false;
    }
    else{
        getById("break-time").value = 0;
        getById("break-time").disabled = true;
    }
}

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
    getById("settings").disabled = true;
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
    getById("settings").disabled = false;

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
   if (inputs[0].value == "") return true;
   for (let i = 1; i < 5; i++){
       if (i == 3 && getById("enable-rests").checked == false) {continue;}
       if (inputs[i].value < 1 || inputs[i].value == "") return true;
   }
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
        if (currentSettings.get("useCustomColors") == true) {color.style.backgroundColor = currentSettings.get("roundColor");}
        else {color.style.backgroundColor = defaultSettings.get("roundColor");}
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
        if ( time == currentSettings.get("endWarningTime") && action === "Work" ){
            playAudio(String("sounds/" + currentSettings.get('endSound'))); // warning sound
            if (currentSettings.get("useCustomColors") == true) {color.style.backgroundColor = currentSettings.get("warningColor");}
            else {color.style.backgroundColor = defaultSettings.get("warningColor");}
        }
        if ( time <= 1 && action === "Work" ) {
            // Changes from work to break
            if (currentSettings.get("enableBreakTime") == true){
                playAudio(String("sounds/" + currentSettings.get('breakSound'))); // break sound
                globalTime = pause;
                $( "#timer p" ).innerText = String( ~~( globalTime / 60 ) + ':' + String( globalTime % 60 ).padStart( 2, '0' ) );
                $( "#action p" ).innerText = "Break";
                if (currentSettings.get("useCustomColors") == true) {color.style.backgroundColor = currentSettings.get("restColor");}
                else {color.style.backgroundColor = defaultSettings.get("restColor");}
            }
            else {
                playAudio(String("sounds/" + currentSettings.get('startSound')))
                globalTime = currentSettings.get("activeTime"); // start sound
                if (currentSettings.get("useCustomColors") == true) {color.style.backgroundColor = currentSettings.get("roundColor");}
                else {color.style.backgroundColor = defaultSettings.get("roundColor");}
            }

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
            if (currentSettings.get("useCustomColors") == true) {color.style.backgroundColor = currentSettings.get("roundColor");}
            else {color.style.backgroundColor = defaultSettings.get("roundColor");}
        }
        else if ( time <= 1 && action === "Get Ready!" ) {
            // Used only for first start. Changes from get ready to work
            playAudio(String("sounds/" + currentSettings.get('startSound')));
            globalTime = active;
            $( "#timer p" ).innerText = String( ~~( globalTime / 60 ) + ':' + String( globalTime % 60 ).padStart( 2, '0' ) );
            $( "#action p" ).innerText = "Work";
            if (currentSettings.get("useCustomColors") == true) {color.style.backgroundColor = currentSettings.get("roundColor");}
            else {color.style.backgroundColor = defaultSettings.get("roundColor");}
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
        if (key !== 'startSound' && key !== 'breakSound' && key !== 'warningSound' && key !== 'endSound' ){
            //console.log(key);
            if (i !== 6 && i !== 7 && i !== 8){currentSettings.set(key, String(inputs[i].value));}
            else {currentSettings.set(key, inputs[i].checked);}
            i = i + 1;
        }
    }
    currentSettings.set('startSound', document.getElementById('start-sound').value);
    currentSettings.set('breakSound', document.getElementById('break-start').value);
    currentSettings.set('warningSound', document.getElementById('warning-sound').value);
    currentSettings.set('endSound', document.getElementById('end-sound').value);
}

function isScreenLockSupported() {
    return ('wakeLock' in navigator);
}

async function enableScreenLock (){
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        //statusElem.textContent = 'Wake Lock is active!';
      } catch (err) {
        // The Wake Lock request has failed - usually system related, such as battery.
        //statusElem.textContent = `${err.name}, ${err.message}`;
      }
}

saveSettings.onclick = function () {
    if (checkEmptyInputs()){
        getById( "required" ).style.opacity = 1;
        getById( "saveSettings" ).style.backgroundColor = "#df3030";
    }
    else {
    getById( "required" ).style.opacity = 0; 
    getById( "saveSettings" ).style.backgroundColor = "#5eaba2";
    saveToCurrentSettings();
    if (currentSettings.get("enableKeepScreen") == true){enableScreenLock();}
    else { // if it's on release it
        if (wakeLock != null){
            wakeLock.release()
            .then(() => {
              wakeLock = null;
            })
        } 
    }
    globalTime = currentSettings.get('prepareTime');
    settingsWindow.style.display = "none";
    }
}

span.onclick = function () {
    settingsWindow.style.display = "none";
}

getById('enable-colors').addEventListener( "click", () => {
    if (getById("enable-colors").checked == true){
        getById("round-color").disabled = false;
        getById("warning-color").disabled = false;
        getById("rest-color").disabled = false;
    }
    else{
        getById("round-color").disabled = true;
        getById("warning-color").disabled = true;
        getById("rest-color").disabled = true;
    }
} );

getById('enable-rests').addEventListener( "click", () => {
    if (getById("enable-rests").checked == true){
        getById("break-time").disabled = false;
    }
    else{
        getById("break-time").value = 0;
        getById("break-time").disabled = true;
    }
} );

if (!isScreenLockSupported){
    getById("enable-keepscreen").disabled = true;
}

getById('resetSettings').addEventListener( "click", () => {
    currentSettings = new Map(defaultSettings);
    updateSettingsInputs();
} );

getById('save-preset').addEventListener( "click", () => {
    if (checkEmptyInputs()){
        getById( "required" ).style.opacity = 1;
        getById( "saveSettings" ).style.backgroundColor = "#df3030";
    }
    else {
        getById( "required" ).style.opacity = 0; 
        getById( "saveSettings" ).style.backgroundColor = "#5eaba2";
        let copysettings = new Map(currentSettings);
        saveToCurrentSettings();
        let savedSettings = new Map(currentSettings);
        presetSettings2 = new Map(currentSettings);c
        getById("preset-code").value = "XqcL0w"; // this is the place where code should be generated and settings sent to database
        currentSettings = new Map(copysettings);
    }
} );

getById('load-preset').addEventListener( "click", () => {
    let preset = getById("preset-code").value;
    if (preset == 'Zol11ds'){
        currentSettings = new Map(presetSettings1);
    }
    if (preset == 'XqcL0w' && presetSettings2 != null){
        currentSettings = new Map(presetSettings2);
    }
    updateSettingsInputs();
} );