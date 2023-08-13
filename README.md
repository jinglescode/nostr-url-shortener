# URL Shortener

A free URL shortener service enabled by the NOSTR protocol, that is fast and fuss-free, stripped of all bells and whistles, no gimmicks—it just works!

Visit [w3.do](https://w3.do), the URL shortener service enabled by the NOSTR protocol.

### Kind 1994

```
const id = nanoid(8);

const event = new NDKEvent();
event.kind = 1994;
event.tags = [
  ["d", id],
  ["r", '<user input>'],
];
```

Why 1994?

Because URLs (Uniform Resource Locators) were defined in 1994 by Tim Berners-Lee, the inventor of the World Wide Web. [[source: Wikipedia](https://en.wikipedia.org/wiki)]

### Potential features

- to create links with user's NIP05 and user assigned slug
- support to handle nostr slugs, like nevent, npub, note, nprofile
- something about njump? https://github.com/fiatjaf/njump
- use bech32 too, use nip89 to store user preferred client
