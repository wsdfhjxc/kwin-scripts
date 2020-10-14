# KWin scripts

This is a repository with some KWin scripts.

The scripts are intended to be used under KDE Plasma.

## Installation

Enter the directory of a choosen script, e.g.:

```
cd virtual-desktops-only-on-primary
```

To install the script, run: `../helper.sh install`

To upgrade the script to a newer version, run: `../helper.sh upgrade`

To uninstall the script, regardless of the installation method, run: `../helper.sh uninstall`

After installing the script, it must be also enabled in the System Settings.

## Available scripts

- [Virtual Desktops Only On Primary](#virtual-desktops-only-on-primary)

## Virtual Desktops Only On Primary

This is a script that brings a feature similar to GNOME Mutter's `workspaces-only-on-primary` option, that is switchable virtual desktops on the primary monitor, and non-switchable virtual desktops on other monitors.

When the script is enabled, all windows placed on monitors other than the primary, are automatically set to be shown on all virtual desktops. This can be considered a hack, but from the user's perspective, this effectively results in having multiple switchable virtual desktops on the primary monitor, and fixed non-switchable virtual desktops on other monitors. That's how GNOME Shell handles workspaces by default, and the script mimics that.

### Additional installation method

The script is listed on the KDE Store, so it can be installed via the System Settings Add-On Installer.
