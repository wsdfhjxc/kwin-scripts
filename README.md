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

- [Temporary Virtual Desktops](#temporary-virtual-desktops)
- [Virtual Desktops Only On Primary](#virtual-desktops-only-on-primary)

## Temporary Virtual Desktops

This is a script that automatically adds and removes virtual desktops.

When the script is enabled, virtual desktops will be added and removed in a way, so that there is always exactly one empty virtual desktop available (until hitting the limit of 20). Once a virtual desktop becomes empty (due to closing windows), it'll be removed, unless it's the only virtual desktop left. That's a feature known from the GNOME Shell, and while it works best with its unmatched overview mode, that feature can be also useful when using KDE Plasma.

Besides enabling the script in the System Settings, no additional steps are required.

## Virtual Desktops Only On Primary

This is a script that brings a feature similar to GNOME Mutter's `workspaces-only-on-primary` option, that is switchable virtual desktops on the primary monitor, and non-switchable virtual desktops on other monitors.

When the script is enabled, all windows placed on monitors other than the primary, are automatically set to be shown on all virtual desktops. This can be considered a hack, but from the user's perspective, this effectively results in having multiple switchable virtual desktops on the primary monitor, and fixed non-switchable virtual desktops on other monitors. That's how GNOME Shell handles workspaces by default, and the script mimics that.

Besides enabling the script in the System Settings, no additional steps are required.
