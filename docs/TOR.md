# Tor-only demo serving

The demo is a static Vite build exposed through a Tor onion service. The local
HTTP server listens on loopback only; it is not a clearnet deployment.

## Run the local service

From the repository root:

```sh
npm install
npm run build
./scripts/serve-static.sh
```

The helper serves `dist/` at `127.0.0.1:8080`. Keep this terminal running. It
exits if `dist/index.html` does not exist, so a missing build is not published.

## Configure Tor

Install Tor using the operating system package manager, then copy the checked-in
template into Tor's configuration directory (the exact path can vary by distro):

```sh
sudo install -m 0644 tor/torrc.example /etc/tor/torrc.d/izi-kalendar.conf
sudo install -d -o debian-tor -g debian-tor -m 0700 /var/lib/tor/izi-kalendar
sudo systemctl restart tor
```

On systems whose Tor service account is named `tor`, use `tor:tor` instead of
`debian-tor:debian-tor`. The resulting configuration must retain:

```text
HiddenServiceDir /var/lib/tor/izi-kalendar/
HiddenServicePort 80 127.0.0.1:8080
```

Tor generates the onion hostname and private keys under
`/var/lib/tor/izi-kalendar/`. Do not commit, copy, or expose that directory.
Read the generated public address with:

```sh
sudo cat /var/lib/tor/izi-kalendar/hostname
```

Open that `.onion` address in Tor Browser. Do not open or advertise a clearnet
address; the app has no backend or external network dependency.

## Stop and inspect

Stop the local server with `Ctrl-C`. Check that the listener is loopback-only:

```sh
ss -ltn '( sport = :8080 )'
```

The expected local address is `127.0.0.1:8080`. If the listener is bound to
`0.0.0.0`, stop it and use `scripts/serve-static.sh`.

The repository intentionally contains only `tor/torrc.example`; hidden-service
keys and the generated `hostname` file are runtime state and must stay out of
version control.
