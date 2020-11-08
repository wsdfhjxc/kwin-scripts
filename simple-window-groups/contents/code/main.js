var visibleGroups = [];
var numberOfGroups = 10;
var windowIdGroupsMap = {};

function initGroups() {
    visibleGroups[0] = true;
    for (var i = 1; i < numberOfGroups; i++) {
        visibleGroups[i] = false;
    }
}

function bindWindow(window) {
    if (!window.normalWindow || window.skipTaskbar) {
        return;
    }
    window.onAllDesktops = true;
    windowIdGroupsMap[window.windowId] = visibleGroups.slice();
    print("Window " + window.windowId + " has been bound");
}

function bindWindows() {
    workspace.clientList().forEach(bindWindow);
}

function unbindWindow(window) {
    if (windowIdGroupsMap[window.windowId]) {
        delete windowIdGroupsMap[window.windowId];
        print("Window " + window.windowId + " has been unbound");
    }
}

function showOrHideWindow(window, show) {
    window.minimized = !show;
    window.skipTaskbar = !show;
    window.skipSwitcher = !show;
}

function isWindowVisible(windowGroups) {
    for (var i = 0; i < numberOfGroups; i++) {
        if (windowGroups[i] && visibleGroups[i]) {
            return true;
        }
    }
    return false;
}

function updateCurrentView() {
    workspace.clientList().forEach(function(window) {
        var windowGroups = windowIdGroupsMap[window.windowId];
        if (!windowGroups) {
            return;
        }
        var visible = isWindowVisible(windowGroups);
        showOrHideWindow(window, visible);
    });
}

function toggleGroupOnWindow(group, window) {
    window = window || workspace.activeClient;
    var windowGroups = windowIdGroupsMap[window.windowId];
    var assignedWindowGroups = windowGroups.filter(function(group) {
        return group;
    });

    // Don't touch a group, if it's the only assigned group
    if (assignedWindowGroups.length == 1 && windowGroups[group]) {
        return;
    }

    windowGroups[group] = !windowGroups[group];

    print("Window " + window.windowId + " has been " +
          (windowGroups[group] ? "added to " : "removed from ") +
          "group " + (group + 1));

    updateCurrentView();
}

function toggleGroupVisibility(group) {
    visibleGroups[group] = !visibleGroups[group];

    print("Group " + (group + 1) + " has been set to be " +
          (visibleGroups[group] ? "visible" : "hidden"));

    updateCurrentView();
}

function setExclusiveGroupVisibility(group) {
    for (var i = 0; i < numberOfGroups; i++) {
        visibleGroups[i] = i == group;
    }

    print("Group " + (group + 1) + " has been set to be exclusively visible");

    updateCurrentView();
}

function connectSignals() {
    workspace.clientAdded.connect(function(window) {
        bindWindow(window);
        updateCurrentView();
    });
    workspace.clientRemoved.connect(unbindWindow);
}

function registerKeyboardShortcut(name, action) {
    registerShortcut("Simple Window Groups - " + name, "", "", action);
}

function closure(func, i) {
    return function() {
        return func(i);
    }
}

function registerKeyboardShortcuts() {
    for (var i = 0; i < numberOfGroups; i++) {
        registerKeyboardShortcut("Add/remove window to/from group " + (i + 1),
                                 closure(toggleGroupOnWindow, i));
        registerKeyboardShortcut("Show/hide windows from group " + (i + 1),
                                 closure(toggleGroupVisibility, i));
        registerKeyboardShortcut("Show exclusively windows from group " + (i + 1),
                                 closure(setExclusiveGroupVisibility, i));
    }
}

function main() {
    initGroups();
    bindWindows();
    connectSignals();
    registerKeyboardShortcuts();
    updateCurrentView();
}

main();
