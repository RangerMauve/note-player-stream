# note-player-stream
Plays different notes with the Web Audio API based on a stream of input

This module expects to be used with [web-midi-note-stream](https://github.com/RangerMauve/web-midi-note-stream), but accepts any stream which outputs objects that look like the following:

``` javascript
{
	pressed: Boolean, // Whether the button has been pressed/released
	note: Number, // Integer between [0-127] which represents a midi note
	frequency: Number, // The frequency to play the oscillator at (note required for custom nodes)
}
```
## Usage

Install:

``` bash
npm install --save note-player-stream
```

Require:

```
var playerStream = require("note-player-stream");
var player = playerStream({type: "square"});
```

## Example

This example will listen for input from a Launchpad and play sound when a button is pressed

``` javascript
var playerStream = require("note-player-stream");
var noteStream = require("web-midi-note-stream");
var webMidi = require("web-midi");

webMidi("Launchpad")
	.pipe(noteStream())
	.pipe(playerStream());
```

## API

`playerStream([options])`

Returns an [object stream](nodejs.org/api/stream.html) which takes in objects representing device input, and plays sound using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

### Options

| Property | Default         | Explanation                                                                         |
|----------|-----------------|-------------------------------------------------------------------------------------|
| gain     | 0.2             | How loud the output should be                                                       |
| output   | ctx.destination | What node to output to                                                              |
| node     | make oscillator | Function that takes data and returns an AudioNode                                   |
| update   | no-op           | Function that takes data and a node that can be used to update the node on new data |
| type     | sine            | Type of oscillator to create                                                        |
