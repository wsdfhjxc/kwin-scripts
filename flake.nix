{
  description = "Some KWin scripts";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachSystem
    (with flake-utils.lib.system; [
      i686-linux
      x86_64-linux
      aarch64-linux
    ])
    (system: let
      pkgs = import nixpkgs {inherit system;};
      pkgDef = pkgInfo: (pkgs.libsForQt5.callPackage (
        {
          lib,
          mkDerivation,
          kcoreaddons,
          kwindowsystem,
          plasma-framework,
          systemsettings,
        }:
          mkDerivation rec {
            src = ./${pkgInfo.pname};
            inherit (pkgInfo) pname version;
            buildInputs = [
              kcoreaddons
              kwindowsystem
              plasma-framework
              systemsettings
            ];
            meta = with lib; {
              description = "Some KWin scripts";
              license = licenses.gpl3;
              homepage = "https://github.com/wsdfhjxc/kwin-scripts/";
              inherit (kwindowsystem.meta) platforms;
            };

            dontBuild = true;

            # 1. --global still installs to $HOME/.local/share so we use --packageroot
            # 2. plasmapkg2 doesn't copy metadata.desktop into place, so we do that manually
            installPhase = ''
              runHook preInstall

              mkdir -p $out

              plasmapkg2 --type kwinscript --install ${src} --packageroot $out/share/kwin/scripts
              install -Dm644 ${src}/metadata.desktop $out/share/kservices5/kwin-script-${pkgInfo.pname}.desktop

              runHook postInstall
            '';
          }
      ) {});

      mapPkgList = pkgList:
        builtins.listToAttrs (builtins.map (pkgInfo: {
            name = pkgInfo.pname;
            value = pkgDef pkgInfo;
          })
          pkgList);
    in {
      packages = mapPkgList [
        {
          pname = "virtual-desktops-only-on-primary";
          version = "0.1";
        }
        {
          pname = "task-manager-do-it-yourself-bar";
          version = "0.1";
        }
        {
          pname = "simple-window-groups";
          version = "1.1";
        }
        {
          pname = "temporary-virtual-desktops";
          version = "0.1";
        }
      ];
    });
}
