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
    latestTag=$(git describe --tags --abbrev=0)
    zip -r "virtual-desktops-only-on-primary-$latestTag.kwinscript" contents metadata.desktop
    ;;

show-console)
    qdbus org.kde.plasmashell /PlasmaShell showInteractiveKWinConsole
    ;;

*)
    echo "Usage: helper.sh install|uninstall|upgrade|package|show-console"
    ;;
esac
