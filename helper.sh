#!/bin/sh

case $1 in
install)
    kpackagetool5 -i .
    ;;

uninstall)
    kpackagetool5 -r .
    ;;

upgrade)
    kpackagetool5 -u .
    ;;

package)
    name=$(basename "$(pwd)")
    version=$(grep -Po "Version=\K(.*)" metadata.desktop)
    zip -r "$name-$version.kwinscript" contents metadata.desktop
    ;;

show-console)
    qdbus org.kde.plasmashell /PlasmaShell showInteractiveKWinConsole
    ;;

*)
    echo "Usage: helper.sh install|uninstall|upgrade|package|show-console"
    ;;
esac
