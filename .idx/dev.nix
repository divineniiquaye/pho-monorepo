# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.jdk21_headless
    pkgs.corepack
    pkgs.gradle
    pkgs.socat
  ];
  # Sets environment variables in the workspace
  env = { EXPO_USE_FAST_RESOLVER = 1; };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
    #   "msjsdiag.vscode-react-native"
      "expo/vscode-expo-tools"
      "fwcd.kotlin"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        install-and-prebuild = ''
          corepack enable pnpm
          pnpm run add:mobile @expo/ngrok@^4.1.0 expo-dev-client && pnpm run --filter native generate --platform android
          # Add more memory to the JVM
          sed -i 's/org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m/org.gradle.jvmargs=-Xmx4g -XX:MaxMetaspaceSize=512m/' "apps/native/android/gradle.properties"
        '';
      };
      # Runs when a workspace restarted
      onStart = {
        forward-ports = ''
          socat -d -d TCP-LISTEN:5554,reuseaddr,fork TCP:$(cat /etc/resolv.conf | tail -n1 | cut -d " " -f 2):5554
        '';
        connect-device = ''
          adb -s localhost:5554 wait-for-device
        '';
        android = ''
          # You can change the `dev --android` to `android` to run the app on development build
          pnpm run --filter native dev --go --port 5554 --tunnel
        '';
      };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "pnpm" "run" "--filter" "web" "dev" "--port" "$PORT" ];
          manager = "web";
        };
        android = {
          # noop
          command = [ "tail" "-f" "/dev/null" ];
          manager = "web";
        };
      };
    };
  };
}
