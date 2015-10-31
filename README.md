# image-thumb

Image thumbnail generator server written for NodeJS that requires no external
dependencies to run (apart from NodeJS) unlike
[more complete](https://github.com/thumbor/thumbor/wiki/Requirements)
[alternatives](https://github.com/ssaw/openross#requirements).
Fewer moving parts means it's much easier to set up and maintain.

Source images need to be a jpg/png/gif file hosted on a server. Source
images are downloaded, processed, then returned as http response with the same
file type as the source image.

The image thumbnail generation consists of a crop operation then a resize.
The image covers fully the given dimensions even if it gets stretched ('Fill' mode).
The part of the source image that gets cropped can be configured within the url.

Images are processed in memory to keep things fast, and an optional filesystem
cache keeps a copy of the downloaded file to avoid downloading them multiple
times.

The core image processing functionality is handled by the
[EyalAr/lwip](https://github.com/EyalAr/lwip) NodeJS library.

## Main features

- on the fly image thumbnail generation
- filesystem cache
- URLs are [Thumbor](https://github.com/thumbor/thumbor) compliant
- service access can be restricted to avoid abuse
- Docker ready
- easy to set up
- fast!

## Requirements

- NodeJS v0.12+
- npm
- build-essential tools required for `npm install`

## Installation

- clone this project
- ```npm install```

## Usage

### Running the server

```node index.js```

This will run a local server on: http://127.0.0.1:8081/

You can change the port number using the `SERVER_PORT` environment variable
(see _Options_ below).

Alternatively you can run the server using gulp:
```./gulp serve```

### Generating thumbnails

To create a thumbnail image:

```http://127.0.0.1:8081/[HMAC/]WIDTHxHEIGHT/[HALIGN/VALIGN/]IMAGE_URL```

- HMAC: security token
- WIDTH: new width in pixels
- HEIGHT: new height in pixels
- HALIGN: horizontal alignment in case the image gets cropped; possible values:
`left`, `center`, `right` (default: `center`)
- VALIGN: vertical alignment in case the image gets cropped; possible values:
`top`, `middle`, `bottom` (default: `middle`)
- IMAGE_URL: the complete URL to the source image, it does not need to be escaped

For instance:

`http://127.0.0.1:8081/100x150/https://fr.animalblog.co/wp-content/uploads/2013/08/chat_peur1.jpg`

`http://127.0.0.1:8081/300x200/right/middle/https://fr.animalblog.co/wp-content/uploads/2013/08/chat_peur1.jpg`

You can omit one of the width/height properties by setting a `0` value in order
to keep the original aspect ratio. For instance:
`http://127.0.0.1:8081/0x200/center/middle/https://fr.animalblog.co/wp-content/uploads/2013/08/chat_peur1.jpg`

### Options

Options and their defaults are set in the services/options.js file.
These options can be overridden via environment variables.
For instance you can run: ```LOG_LEVEL=0 node index.js``` to start the server
with logging disabled.

### Security

Access to the service can be restricted to authorized users. All they need to
know is a private security key. This key is then used along with the path of the
requested URL using HMAC (SHA-1) to generate an hexadecimal token string. This
token then needs to be set within the URL at the beginning of the URL path.

As the token depends on the given path, if the source image is different or the
requested thumbnail formats differ, a new token will need to be created using the
private key. This effectively restricts the access to unauthorized people.

This is the same security mechanism as
[Thumbor's](https://github.com/thumbor/thumbor/wiki/Security#stopping-tampering).

To enable security, set the environment variable `SECURITY_KEY` with your private
security key (it could be any string).

The command line tool `command/hmac.js` is provided to generate tokens.

#### Example

Let's say I want to use the 'mytest' security key like this:

`SECURITY_KEY=mytest node index.js`

From the given thumbnail URL:

`http://127.0.0.1:8081/300x100/https://www.google.fr/images/logo.png`

We extract the path:

`/300x100/https://www.google.fr/images/logo.png`

Let's generate the security token (HMAC):

`node command/hmac.js mytest /300x100/https://www.google.fr/images/logo.png`

We get the following security token:

`4a79a53213c97c615e4ef50e856dd7797c9dbdb9`

Now the thumbnail image can be accessed using the following URL:

`http://127.0.0.1:8081/4a79a53213c97c615e4ef50e856dd7797c9dbdb9/300x100/https://www.google.fr/images/logo.png`

If the security token is not provided or invalid, the server will return a 403
Forbidden response.

### Command line utilities

The following gulp commands can be used:
- `gulp serve` / `node index.js`: runs the server
- `gulp`: checks the code for errors, runs the server and reloads it when any of
 the source files has changed
- `gulp watch`: watches for file changes
- `gulp clear-cache`: clears the _cache/_ folder
- `gulp lint` / `npm run lint`: runs [jshint](http://jshint.com/) static analysis of the code
- `npm test`: runs the unit tests
- `node command/hmac.js`: generates a security token using the secret key and a
URL path.

## Cache

An optional filesystem cache (enabled by default) copies the downloaded files into
the _cache/_ folder. If the given URL has already been stored in the cache, the file
is not downloaded again and instead loaded directly from the filesystem cache.

## Docker

To build a docker container running the server:

`docker build .`

To run it:

`docker run -p 8081:8081 DOCKER_IMAGE_ID`

## TODO

### Tests
- Add functional tests to the existing unit tests

### Cache
- Forward _Expires_ cache headers returned by the source image to activate browser cache
- Add a max disk space allowed for the cache directory
- Discard cached files if expired
