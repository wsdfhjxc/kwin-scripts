#!/bin/bash

printUsage() {
    echo "Usage: helper.sh install|uninstall|upgrade|package name-of-the-script"
    echo "   or: helper.sh show-dev-console"
}

install() {
    local scriptName=$1
    kpackagetool5 -i "$scriptName"
}

uninstall() {
    local scriptName=$1
    kpackagetool5 -r "$scriptName"
}

upgrade() {
    local scriptName=$1
    kpackagetool5 -u "$scriptName"
}

package() {
    local scriptName=$1

    [[ ! -d "$scriptName" ]] && {
        echo "No such script '$scriptName'"
        exit 1
    }

    cd "$scriptName" || exit 1

    local scriptVersion=$(grep -Po "Version=\K(.*)" metadata.desktop)
    zip -r "$scriptName-$scriptVersion.kwinscript" contents metadata.desktop

    cd ..
}

show-dev-console() {
    qdbus org.kde.plasmashell /PlasmaShell showInteractiveKWinConsole
}

main() {
    local command=$1

    case $command in
        install|uninstall|upgrade|package)
            [[ -z "$2" ]] && {
                printUsage
                exit 1
            }
            $command "$2"
            ;;

        show-dev-console)
            $command
            ;;

        *)
            printUsage
            exit 1
            ;;
    esac
}

main $*
