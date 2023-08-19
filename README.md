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

### API

You can use this API to create a short URL.

```
GET https://w3.do/get?url=<url>
```

For example: [https://w3.do/get?url=https://github.com/jinglescode/nostr-url-shortener](https://w3.do/get?url=https://github.com/jinglescode/nostr-url-shortener)

This will return a JSON response, for example:

```
{
  "id":"xNQ8b0HZ",
  "url":"w3.do/xNQ8b0HZ",
  "eid":"a62729f9e11506183672f1e37bc4617af94636169b3c5b25db6c16b0cd05fbf1"
}
```

### Support this project

- [Fund Raiser](https://geyser.fund/project/url/) - Join the global community to support project on Geyser Fund, a crowdfunding platform. The funds will be used to pay for contributors and bounties.

- [Contribute](https://github.com/jinglescode/nostr-password-manager/pulls) - Contribute directly by submitting a pull request.

- [Try it and share it](https://w3.do/) - Try the URL shortener service and share it.

### Potential features

- to create links with user's NIP05 and user assigned slug
- support to handle nostr slugs, like nevent, npub, note, nprofile
- something about njump? https://github.com/fiatjaf/njump
- use bech32 too, use nip89 to store user preferred client

### Contributors

<a href="https://github.com/jinglescode/nostr-url-shortener/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=jinglescode/nostr-url-shortener" />
</a>
