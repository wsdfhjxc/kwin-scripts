# KWin scripts

This is a repository with some KWin scripts.

The scripts are intended to be used under KDE Plasma.

## Table of Contents

- [Installation](#installation)
  - [From source](#from-source)
  - [kwinscript file](#kwinscript-file)
- [Available scripts](#available-scripts)
  - [Simple Window Groups](#simple-window-groups)
    - [Configuration and usage](#configuration-and-usage)
    - [Available keyboard shortcuts](#available-keyboard-shortcuts)
    - [Setting up the panel widget](#setting-up-the-panel-widget)
    - [In case of terrible things that could happen](#in-case-of-terrible-things-that-could-happen)
  - [Task Manager - Do It Yourself Bar](#task-manager---do-it-yourself-bar)
    - [Configuration and usage](#configuration-and-usage-1)
    - [Setting up the panel widget](#setting-up-the-panel-widget-1)
  - [Temporary Virtual Desktops](#temporary-virtual-desktops)
  - [Virtual Desktops Only On Primary](#virtual-desktops-only-on-primary)
- [License](#license)

## Installation

### From source

To install a script, run:
```
./helper.sh install name-of-the-script
```

To upgrade a script to a newer version, run:

```
./helper.sh upgrade name-of-the-script
```

To uninstall a script, regardless of the installation method, run:

```
./helper.sh uninstall name-of-the-script
```

After installing the script, it must be also enabled in the System Settings.

### kwinscript file

Visit the [releases section](https://github.com/wsdfhjxc/kwin-scripts/releases) and download the kwinscript file of a chosen script.

After that, you will be able to select this file in System Settings (KWin Scripts, Install from File).

## Available scripts

### Simple Window Groups

This is a script that provides a window grouping system, similar as in some window managers.

Groups, as implemented in this script, are kind of a replacement for virtual desktops. A window can be added to multiple groups at the same time, and windows from different groups can be shown together or hidden on demand. Also, actual virtual desktops are completely ignored while using window groups, because it'd be too confusing to mix these concepts together. However, the regular virtual desktops workflow can be recreated with this script.

On its own, the script isn't very convenient in regard to user experience. However, you can use an additional panel widget which will display visual cues, like the Pager applet. Please see the section about setting up the panel widget.

#### Configuration and usage

After enabling the script, and while still being in the System Settings, you should head up to the Shortcuts section and select the KWin component, as the script is mostly controllable through keyboard shortcuts.

There are 10 available window groups which can be used, and there are 3 actions that can be invoked for each of the groups. In total there are 30 keyboard shortcuts, but you don't need to set up all of them.

The keyboard shortcuts allow you to toggle a group on the active window (add it to the group, or remove it), show or hide windows from a specific group (e.g. show windows from group 1 and group 3), and show exclusively windows from a specific group (in such case, all windows not present in that group will be hidden).

Besides the keyboard shortcuts, you can also use the window actions menu (right-click on the titlebar) to add or remove windows from specific groups. That requires some clicking though, due to a couple of nested menus.

By default, all new windows are added to groups which are visible at the moment of their opening. It means that when group 1 and group 3 are set to be shown, a new window will be added to both these groups.

#### Available keyboard shortcuts

* Add/remove window to/from group 1..10
* Show/hide windows from group 1..10
* Show exclusively windows from group 1..10

Note: All keyboard shortucts have `Simple Window Groups` prefix for easier recognition.

#### Setting up the panel widget

The script sends data about its current state (used groups, visible groups) to the [Do It Yourself Bar](https://github.com/wsdfhjxc/do-it-yourself-bar) plasmoid.

You can put an instance of that plasmoid in a Plasma's panel or Latte Dock. Please refer to the installation and configuration instructions in the plasmoid's readme. Everything is clearly explained there.

**Important information**

* The plasmoid's instance ID should be set to 750
* Labels and indicators for used groups use visual style A
* Labels and indicators for visible groups use visual style B
* Labels and indicators for visible & unused groups use style C

#### In case of terrible things that could happen

Potentially, there is a chance that your windows might become unaccessible.

In order to restore the windows, open KRunner (Alt+Space), launch Konsole and run:

```
kwin_x11 --replace & disown
```

### Task Manager - Do It Yourself Bar

This is a script to create a text-only task manager with the use of the [Do It Yourself Bar](https://github.com/wsdfhjxc/do-it-yourself-bar) plasmoid.

Note: The script requires the `xdotool` program to be installed, so it's possible to switch between windows.

#### Configuration and usage

Besides enabling the script in the System Settings, and setting up the required panel widget (see the next section), there are also two possible configuration options which can be changed. There is no configuration dialog though.

The first option is about filtering windows by screens/monitors (enabled by default). To change it, run:

```
kwriteconfig5 --file ~/.config/kwinrc \
--group Script-task-manager-do-it-yourself-bar \
--key filterByScreens false
```

The second option is about filtering windows by virtual desktops (enabled by default). To change it, run:

```
kwriteconfig5 --file ~/.config/kwinrc \
--group Script-task-manager-do-it-yourself-bar \
--key filterByDesktops false
```

To apply the changes, the script needs to be restarted, but the quickest way is to just restart KWin:

```
kwin_x11 --replace & disown
```

#### Setting up the panel widget

The script sends data about visible windows to the [Do It Yourself Bar](https://github.com/wsdfhjxc/do-it-yourself-bar) plasmoid.

You can put an instance of that plasmoid in a Plasma's panel or Latte Dock. Please refer to the installation and configuration instructions in the plasmoid's readme. Everything is clearly explained there.

**Important information**

* The instance ID should be set to 740
* Titles of idle windows use visual style A
* Titles of active windows use visual style B
* Titles of windows needing attention use style C

### Temporary Virtual Desktops

This is a script that automatically adds and removes virtual desktops.

When the script is enabled, virtual desktops will be added and removed in a way, so that there is always exactly one empty virtual desktop available (until hitting the limit of 20). Once a virtual desktop becomes empty (due to closing windows), it'll be removed, unless it's the only virtual desktop left. That's a feature known from the GNOME Shell, and while it works best with its unmatched overview mode, that feature can be also useful when using KDE Plasma.

Besides enabling the script in the System Settings, no additional steps are required.

### Virtual Desktops Only On Primary

This is a script that brings a feature similar to GNOME Mutter's `workspaces-only-on-primary` option, that is switchable virtual desktops on the primary monitor, and non-switchable virtual desktops on other monitors.

When the script is enabled, all windows placed on monitors other than the primary, are automatically set to be shown on all virtual desktops. This can be considered a hack, but from the user's perspective, this effectively results in having multiple switchable virtual desktops on the primary monitor, and fixed non-switchable virtual desktops on other monitors. That's how GNOME Shell handles workspaces by default, and the script mimics that.

Besides enabling the script in the System Settings, no additional steps are required.

## License

[GNU General Public License v3.0](LICENSE)
