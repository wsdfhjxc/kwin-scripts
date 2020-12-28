#!/bin/bash

printUsage() {
    echo "Usage: helper.sh install|uninstall|upgrade|package name-of-the-script"
    echo "   or: helper.sh showConsole"
}

install() {
    scriptName=$1
    kpackagetool5 -i "$scriptName"
}

uninstall() {
    scriptName=$1
    kpackagetool5 -r "$scriptName"
}

upgrade() {
    scriptName=$1
    kpackagetool5 -u "$scriptName"
}

package() {
    scriptName=$1

    [[ ! -d "$scriptName" ]] && {
        echo "No such script '$scriptName'"
        exit 1
    }

    cd "$scriptName"

    scriptVersion=$(grep -Po "Version=\K(.*)" metadata.desktop)
    zip -r "$scriptName-$scriptVersion.kwinscript" contents metadata.desktop

    cd ..
}

case $1 in
    install|uninstall|upgrade|package)
        command=$1
        scriptName=$2

        [[ -z "$scriptName" ]] && {
            printUsage
            exit 1
        }

        $command "$scriptName"
        ;;

    showConsole)
        qdbus org.kde.plasmashell /PlasmaShell showInteractiveKWinConsole
        ;;

    *)
        printUsage
        exit 1
        ;;
esac
