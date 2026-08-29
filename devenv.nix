{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/packages/
  packages = [ pkgs.git ];

  # https://devenv.sh/languages/
  # Next.js 15 requires Node 18.18+; use current LTS.
  # npm.install.enable installs package-lock.json deps automatically on shell entry.
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm = {
      enable = true;
      install.enable = true;
    };
  };

  # https://devenv.sh/scripts/
  scripts = {
    dev.exec = "npm run dev";
    build.exec = "npm run build";
    preview.exec = "npm run preview"; # opennextjs-cloudflare build + wrangler dev
    deploy.exec = "npm run deploy";   # opennextjs-cloudflare build + wrangler deploy
    test.exec = "npm run test";
  };

  # https://devenv.sh/basics/
  enterShell = ''
    node --version
    npm --version
    echo
    echo "Available scripts: dev, build, preview, deploy, test"
  '';

  # https://devenv.sh/tests/
  enterTest = ''
    npm run test
  '';

  # See full reference at https://devenv.sh/reference/options/
}
