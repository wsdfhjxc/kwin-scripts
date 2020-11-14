var groupArray = [];
var numberOfGroups = 10;

function delay(milliseconds, callbackFunc) {
    var timer = new QTimer();
    timer.timeout.connect(function() {
        timer.stop();
        callbackFunc();
    });
    timer.start(milliseconds);
    return timer;
}

function initGroups() {
    for (var i = 0; i < numberOfGroups; i++) {
        groupArray[i] = {
            number: i + 1,
            visible: i == 0,
            windowIdArray: [],
            focusedWindowId: null,

            isUsed: function() {
                return this.windowIdArray.length > 0;
            },

            hasWindow: function(window) {
                return this.windowIdArray.indexOf(window.windowId) >= 0;
            },

            addWindow: function(window) {
                if (this.windowIdArray.indexOf(window.windowId) == -1) {
                    this.windowIdArray.push(window.windowId);
                }
            },

            removeWindow: function(window) {
                var index = this.windowIdArray.indexOf(window.windowId);
                if (index >= 0) {
                    this.windowIdArray.splice(index, 1);
                    if (this.focusedWindowId == window.windowId) {
                        this.focusedWindowId = null;
                    }
                }
            }
        };
    }
}

function bindWindow(window) {
    if (!window.normalWindow || window.skipTaskbar) {
        return;
    }
    window.onAllDesktops = true;
    window.desktopChanged.connect(window, function() {
        var window = this;
        window.onAllDesktops = true;
    });

    groupArray.filter(function(group) {
        return group.visible;
    }).forEach(function(group) {
        group.addWindow(window);
    });

    print("Window " + window.windowId + " has been bound");
}

function bindWindows() {
    workspace.clientList().forEach(bindWindow);
}

function unbindWindow(window) {
    groupArray.forEach(function(group) {
        group.removeWindow(window);
    });

    print("Window " + window.windowId + " has been unbound");
}

function isWindowBound(window) {
    return groupArray.filter(function(group) {
        return group.hasWindow(window);
    }).length > 0;
}

function isWindowVisible(window) {
    return groupArray.filter(function(group) {
        return group.visible && group.hasWindow(window);
    }).length > 0;
}

function showOrHideWindow(window, show) {
    window.minimized = !show;
    window.skipTaskbar = !show;
    window.skipSwitcher = !show;
}

function updateDoItYourselfBarWidget() {
    var id = "750";
    var data = "";

    groupArray.forEach(function(group) {
        var used = group.isUsed();
        var visible = group.visible;

        if (used || visible) {
            // Start of the block
            data += "| ";

            // Style
            data += used && visible ? "B" : used ? "A" : "C";
            data += " | ";

            // Label text
            data += group.number;
            data += " | ";

            // Tooltip text
            data += "Show exclusively";
            data += " | ";

            // Command to be executed on click
            data += "qdbus org.kde.kglobalaccel /component/kwin invokeShortcut "
            data += "'Simple Window Groups - Show exclusively windows from group " + group.number + "'";

            // End of the block
            data += " |";
        }
    });

    callDBus("org.kde.plasma.doityourselfbar", "/id_" + id,
             "org.kde.plasma.doityourselfbar", "pass", data);
}

function updateCurrentView() {
    workspace.clientList().forEach(function(window) {
        if (isWindowBound(window)) {
            var visible = isWindowVisible(window);
            showOrHideWindow(window, visible);
        }
    });

    updateDoItYourselfBarWidget();
}

function toggleGroupOnWindow(group, window) {
    window = window || workspace.activeClient;
    var windowGroupArray = groupArray.filter(function(group) {
        return group.hasWindow(window);
    });

    // Don't touch a group, if it's the only assigned group
    if (windowGroupArray.length == 1 &&
        windowGroupArray[0] == group) {
        return;
    }

    var added = false;
    if (group.hasWindow(window)) {
        group.removeWindow(window);
    } else {
        group.addWindow(window);
        added = true;
    }

    print("Window " + window.windowId + " has been " +
          (added ? "added to " : "removed from ") +
          "group " + group.number);

    updateCurrentView();
}

function updateGroupsForFocusedWindow(window) {
    if (!window) {
        return;
    }
    groupArray.filter(function(group) {
        return group.visible && group.hasWindow(window);
    }).forEach(function(group) {
        print("Window " + window.windowId + " focused in group " + group.number);
        group.focusedWindowId = window.windowId;
    });
}

function restoreFocusedWindow(group) {
    if (group.focusedWindowId) {
        var window = workspace.getClient(group.focusedWindowId);

        delay(50, function() {
            if (!window) {
                return;
            }

            // First bring it to front
            if (!window.keepAbove) {
                window.keepAbove = true;
                window.keepAbove = false;
            } else {
                window.keepAbove = false;
                window.keepAbove = true;
            }

            // Then set it as focused
            workspace.activeClient = window;

            print("Window " + group.focusedWindowId + " focus restored in group " + group.number);
        });
    }
}

function toggleGroupVisibility(group) {
    group.visible = !group.visible;
    if (group.visible) {
        restoreFocusedWindow(group);
    }

    print("Group " + group.number + " has been set to be " +
          (group.visible ? "visible" : "hidden"));

    updateCurrentView();
}

function setExclusiveGroupVisibility(group) {
    groupArray.forEach(function(someGroup) {
        someGroup.visible = someGroup == group;
        if (someGroup.visible) {
            restoreFocusedWindow(group);
        }
    });

    print("Group " + group.number + " has been set to be exclusively visible");

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
    workspace.clientActivated.connect(function(window) {
        updateGroupsForFocusedWindow(window);
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
    groupArray.forEach(function(group) {
        registerKeyboardShortcut("Add/remove window to/from group " + group.number,
                                 closure(toggleGroupOnWindow, group));
        registerKeyboardShortcut("Show/hide windows from group " + group.number,
                                 closure(toggleGroupVisibility, group));
        registerKeyboardShortcut("Show exclusively windows from group " + group.number,
                                 closure(setExclusiveGroupVisibility, group));
    });
}

function registerWindowMenuActions() {
    registerUserActionsMenu(function(window) {
        var menuActions = {
            text: "Simple Window Groups",
            items: []
        };

        var windowGroupArray = groupArray.filter(function(group) {
            return group.hasWindow(window);
        });

        groupArray.forEach(function(group) {
            // Ignore group, if it's the only assigned group
            if (windowGroupArray.length == 1 &&
                windowGroupArray[0] == group) {
                return;
            }

            menuActions.items.push({
                text: (group.hasWindow(window) ? "Remove from group " : "Add to group ") + group.number,
                triggered: closure(toggleGroupOnWindow, group, window)
            });
        });
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
