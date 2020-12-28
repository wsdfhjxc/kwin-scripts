#!/bin/bash

printUsage() {
    echo "Usage: helper.sh install|uninstall|upgrade|package name-of-the-script"
    echo "   or: helper.sh showInteractiveConsole"
}

case $1 in
    install|uninstall|upgrade|package)
        scriptName=$2

        [[ -z "$scriptName" ]] && {
            printUsage
            exit 1
        }

        case $1 in
            install)
                kpackagetool5 -i "$scriptName"
                ;;

            uninstall)
                kpackagetool5 -r "$scriptName"
                ;;

            upgrade)
                kpackagetool5 -u "$scriptName"
                ;;

            package)
                cd "$scriptName" 2>/dev/null || {
                    echo "No such script '$scriptName'"
                    exit 1
                }

                scriptVersion=$(grep -Po "Version=\K(.*)" metadata.desktop)
                zip -r "$scriptName-$scriptVersion.kwinscript" contents metadata.desktop

                cd ..
                ;;
            *)
                printUsage
                exit 1
                ;;
        esac
    ;;

    showInteractiveConsole)
        qdbus org.kde.plasmashell /PlasmaShell showInteractiveKWinConsole
        ;;

    *)
        printUsage
        exit 1
        ;;
esac
