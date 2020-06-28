# Virtual Desktops Only On Primary

This is a KWin script that brings a feature similar to GNOME Mutter's `workspaces-only-on-primary` option, that is switchable virtual desktops on the primary monitor, and non-switchable virtual desktops on other monitors.

The script is intended to be used with KWin running under KDE Plasma desktop environment.

## Explanation

By default, virtual desktops are shared by all monitors, due to KWin following X11 standards, like EWMH. It means that switching virtual desktops changes visible content on all monitors at the same time, which may be undesirable.

When the script is enabled, all windows placed on monitors other than the primary, are automatically set to be shown on all virtual desktops. This can be considered a hack, but from the user's perspective, this effectively results in having multiple switchable virtual desktops on the primary monitor, and fixed non-switchable virtual desktops on other monitors. That's how GNOME Shell handles workspaces by default, and the script mimics that.

For example, this can be useful in a setup with a laptop and an external monitor, where the laptop acts as a primary monitor, or in general, any other setup, where multiple virtual desktops on the primary monitor make sense, but for external monitors it's enough to only have fixed virtual desktops.

## Installation

### From System Settings

The fastest way is to find and install the script in the *System Settings Add-On Installer*. To do so, open *System Settings*, select *Window Management* category, then select *KWin Scripts* tab, click *Get New Scripts* button and type "virtual desktops only on primary" in the search box. After that, you should be able to install the script.

To upgrade, or uninstall the script, KDE Plasma's Discover can be used.

### From downloaded kwinscript file

The downloaded kwinscript file can be installed either by choosing *Install from File* option in the *System Settings* (as mentioned earlier), or by running some commands in terminal.

To install the script, run:

```
kpackagetool5 -i virtual-desktops-only-on-primary-*.kwinscript
```

To upgrade the script to a newer version, run:

```
kpackagetool5 -u virtual-desktops-only-on-primary-*.kwinscript
```

To uninstall the script, regardless of the installation method, run:

```
kpackagetool5 -t KWin/Script -r virtual-desktops-only-on-primary
```

### From cloned repository

To install the script, run: `./helper.sh install`

To upgrade the script to a newer version, run: `./helper.sh upgrade`

To uninstall the script, regardless of the installation method, run: `./helper.sh uninstall`

## Usage

You just have to enable the script in the *System Settings* after installation.
