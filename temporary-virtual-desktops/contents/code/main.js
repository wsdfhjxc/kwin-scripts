var busy = false;

function addDesktop() {
    workspace.desktops += 1;
}

function moveWindows(desktop) {
    workspace.clientList().filter(function(window) {
        return window.desktop > desktop;
    }).forEach(function(window) {
        window.desktop -= 1;
    });
}

function removeDesktop(desktop) {
    if (desktop != undefined &&
        desktop < workspace.desktops) {
        moveWindows(desktop);
    }
    workspace.desktops -= 1;
}

function isDesktopEmpty(desktop) {
    for (var i in workspace.clientList()) {
        var window = workspace.clientList()[i];
        if (window.desktop == desktop && !window.skipTaskbar) {
            return false;
        }
    }
    return true;
}

function getEmptyDesktops() {
    var emptyDesktops = [];
    for (var i = 1; i <= workspace.desktops; i++) {
        if (isDesktopEmpty(i)) {
            emptyDesktops.push(i);
        }
    }
    return emptyDesktops;
}

function balanceDesktops() {
    if (busy) {
        return;
    }

    busy = true;

    var emptyDesktops = getEmptyDesktops();
    if (emptyDesktops.length == 0) {
        addDesktop();
    }
    while (emptyDesktops.length > 1) {
        var desktop = emptyDesktops.shift();
        removeDesktop(desktop);
    }
    
    busy = false;
}

function update() {
    var timer = new QTimer();
    timer.interval = 100;
    timer.singleShot = true;
    timer.timeout.connect(balanceDesktops);
    timer.start();
}

function connectSignals() {
    workspace.clientAdded.connect(update);
    workspace.clientRemoved.connect(update);
    workspace.numberDesktopsChanged.connect(update);
    workspace.desktopPresenceChanged.connect(update);
}

function main() {
    connectSignals();
    update();
}

main();
