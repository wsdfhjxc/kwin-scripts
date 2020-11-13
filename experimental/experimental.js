function delay(milliseconds, callbackFunc) {
    var timer = new QTimer();
    timer.timeout.connect(function() {
        timer.stop();
        callbackFunc();
    });
    timer.start(milliseconds);
    return timer;
}

function runCommand(command, parameters) {
    callDBus("org.kde.klauncher5", "/KLauncher", "org.kde.KLauncher",
             "exec_blind", command, parameters);
}

function showNotification(message, title, icon) {
    icon = icon || "";
    title = title || "";
    runCommand("kdialog", ["--icon", icon, "--title", title, "--passivepopup", message]);
}

delay(3000, function() {
    showNotification("This is a message", "This is a title", "help-contextual");
});
