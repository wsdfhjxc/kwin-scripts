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

function isGroupUsed(group) {
    var keys = Object.keys(windowIdGroupsMap);
    for (var i = 0; i < keys.length; i++) {
        var windowGroups = windowIdGroupsMap[keys[i]];
        if (windowGroups && windowGroups[group]) {
            return true;
        }
    }
    return false;
}

function updateDoItYourselfBarWidget() {
    var id = "750";
    var data = "";

    for (var i = 0; i < numberOfGroups; i++) {
        var used = isGroupUsed(i);
        var visible = visibleGroups[i];

        if (used || visible) {
            // Start of the block
            data += "| ";

            // Style
            data += used && visible ? "B" : used ? "A" : "C";
            data += " | ";

            // Label text
            data += i + 1;
            data += " | ";

            // Tooltip text
            data += "Show exclusively";
            data += " | ";

            // Command to be executed on click
            data += "qdbus org.kde.kglobalaccel /component/kwin invokeShortcut "
            data += "'Simple Window Groups - Show exclusively windows from group " + (i + 1) + "'";

            // End of the block
            data += " |";
        }
    }

    callDBus("org.kde.plasma.doityourselfbar", "/id_" + id,
             "org.kde.plasma.doityourselfbar", "pass", data);
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

    updateDoItYourselfBarWidget();
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
    workspace.clientRemoved.connect(function(window) {
        unbindWindow(window);
        updateCurrentView();
    });
}

function registerKeyboardShortcut(name, action) {
    registerShortcut("Simple Window Groups - " + name, "", "", action);
}

function closure(func, i, j) {
    return function() {
        return func(i, j);
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

function registerWindowMenuActions() {
    registerUserActionsMenu(function(client) {
        var menuActions = {
            text: "Simple Window Groups",
            items: []
        };

        var windowGroups = windowIdGroupsMap[client.windowId];
        var assignedWindowGroups = windowGroups.filter(function(group) {
            return group;
        });

        for (var i = 0; i < numberOfGroups; i++) {
            // Ignore group, if it's the only assigned group
            if (assignedWindowGroups.length == 1 && windowGroups[i]) {
                continue;
            }

            var label = "Add to group " + (i + 1);
            if (windowIdGroupsMap[client.windowId][i]) {
                label = "Remove from group " + (i + 1);
            }

            menuActions.items.push({
                text: label,
                triggered: closure(toggleGroupOnWindow, i, client)
            });
        }
        return menuActions;
    });
}

function main() {
    initGroups();
    bindWindows();
    connectSignals();
    registerKeyboardShortcuts();
    registerWindowMenuActions();
    updateCurrentView();
}

main();
