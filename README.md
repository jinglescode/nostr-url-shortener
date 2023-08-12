# NOSTR URL Shortener

A free URL shortener service enabled by the NOSTR protocol, that is fast and fuss-free, stripped of all bells and whistles and gimmicks—it just works!

### Kind 1994

```
const id = nanoid(10);
const url = '<user input>';

const event = new NDKEvent();
event.kind = 1994;
event.tags = [
  ["d", id],
  ["r", url],
];
```

Why 1994?

Because URLs (Uniform Resource Locators) were defined in 1994 by Tim Berners-Lee, the inventor of the World Wide Web. [[source: Wikipedia](https://en.wikipedia.org/wiki)]
