function bind(window) {
    window.previousScreen = window.screen;
    window.screenChanged.connect(window, update);
    window.desktopChanged.connect(window, update);
    print("Window " + window.windowId + " has been bound");
}

function update(window) {
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
        print("Window " + window.windowId + " has been pinned");
    } else if (previousScreen != primaryScreen) {
        window.desktop = workspace.currentDesktop;
        print("Window " + window.windowId + " has been unpinned");
    }
}

function bindUpdate(window) {
    bind(window);
    update(window);
}

function main() {
    workspace.clientList().forEach(bind);
    workspace.clientList().forEach(update);
    workspace.clientAdded.connect(bindUpdate);
}

main();
