var timers = 0;

var filterByScreens;
var filterByDesktops;

function loadConfig() {
    filterByScreens = readConfig("filterByScreens", true);
    filterByDesktops = readConfig("filterByDesktops", true);
}

function updateDoItYourselfBarWidget() {
    var id = "740";
    var data = "";

    workspace.clientList().forEach(function(window) {
        if (!window.normalWindow || window.skipTaskbar) {
            return;
        }
        if (filterByScreens) {
            if (window.screen != workspace.activeScreen) {
                return;
            }
        }
        if (filterByDesktops) {
            if (!window.onAllDesktops) {
                if (window.desktop != workspace.currentDesktop) {
                    return;
                }
            }
        }

        // Escape potential | separators in window title
        var windowTitle = window.caption.split("|").join("\\|");

        // Start of the block
        data += "| ";

        // Style
        if (window.demandsAttention) {
            data += "C"
        } else if (window.active) {
            data += "B"
        } else {
            data += "A"
        }
        data += " | ";

        // Label text
        data += windowTitle;
        data += " | ";

        // Tooltip text
        data += windowTitle;
        data += " | ";

        // Command to be executed on click
        if (window.active) {
            data += "xdotool windowminimize " + window.windowId;
        } else {
            data += "xdotool windowactivate " + window.windowId;
        }

        // End of the block
        data += " |";
    });

    if (data == "") {
        data = "|||||";
    }

    callDBus("org.kde.plasma.doityourselfbar", "/id_" + id,
             "org.kde.plasma.doityourselfbar", "pass", data);
}

function update() {
    var timer = new QTimer();
    timer.interval = timers * 250;
    timer.singleShot = true;
    timer.timeout.connect(function() {
        if (timers > 0) {
            timers -= 1;
        }
        updateDoItYourselfBarWidget();
    });
    timer.start();
    timers++;
}

function connectSignals() {
    var x = function(window) {
        window.screenChanged.connect(window, update);
        window.captionChanged.connect(window, update);
        update();
    };
    workspace.clientAdded.connect(x);
    workspace.clientList().forEach(x);
    workspace.clientRemoved.connect(update);
    workspace.clientActivated.connect(update);
    workspace.currentDesktopChanged.connect(update);
}

function main() {
    loadConfig();
    connectSignals();
    update();
}

main();
