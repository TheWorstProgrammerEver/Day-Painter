# Local HTTPS

Day Painter uses real local certificate files when they exist, and falls back to normal HTTP when they do not.

The certificate files live in `.certs`, which is git-ignored:

```text
.certs/day-painter.pem
.certs/day-painter-key.pem
```

## Recommended Setup

Use `mkcert` so browsers trust the certificate without warning screens:

```sh
brew install mkcert nss
mkcert -install
mkdir -p .certs
mkcert \
  -cert-file .certs/day-painter.pem \
  -key-file .certs/day-painter-key.pem \
  localhost 127.0.0.1 ::1
```

After that, `npm run dev` and `npm run preview` will use HTTPS automatically.

Or just run these scripts:

```sh
npm run install-local-https-certs
npm run uninstall-local-https-certs
```

## iPad Testing

For quick iPad PWA testing, a Netlify deploy preview is usually easier than trusting a local CA on the iPad.

For LAN testing from an iPad, regenerate the cert with your Mac hostname or LAN IP included:

```sh
mkcert \
  -cert-file .certs/day-painter.pem \
  -key-file .certs/day-painter-key.pem \
  localhost 127.0.0.1 ::1 your-mac-name.local 192.168.x.x
```

Then install and fully trust the mkcert root CA on the iPad.
