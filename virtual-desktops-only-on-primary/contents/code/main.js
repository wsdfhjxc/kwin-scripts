function prepareWindow(window) {
    window.previousScreen = window.screen;
    window.screenChanged.connect(window, validateWindow);
    window.desktopChanged.connect(window, validateWindow);
    print("Prepared window " + window.windowId);
}

function validateWindow(window) {
    var window = window || this;

    if (!window.normalWindow && window.skipTaskbar) {
        return;
    }

    var primaryScreen = 0;
    var currentScreen = window.screen;
    var previousScreen = window.previousScreen;
    window.previousScreen = currentScreen;

    if (currentScreen != primaryScreen) {
        window.desktop = -1;
        print("Pinned window " + window.windowId);
    } else if (previousScreen != primaryScreen) {
        window.desktop = workspace.currentDesktop;
        print("Unpinned window " + window.windowId);
    }
}

function main() {
    workspace.clientList().forEach(prepareWindow);
    workspace.clientList().forEach(validateWindow);

    workspace.clientAdded.connect(function(window) {
        prepareWindow(window);
        validateWindow(window);
    });
}

main();
