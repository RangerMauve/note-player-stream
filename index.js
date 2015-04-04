var xtend = require("xtend");
var through2 = require("through2");
var ctx = require("audio-context");

module.exports = playerStream;

function playerStream(options) {
	var gain = ctx.createGain();

	options = xtend({
		gain: 0.2,
		output: ctx.destination,
		node: make_osc,
		update: update_osc,
		type: "sine"
	}, options || {});

	gain.gain.value = options.gain;
	gain.connect(options.output);

	var note_map = {};

	return through2.obj(process);

	function process(data, enc, cb) {
		var note = data.note;
		var pressed = data.pressed;

		if (pressed)
			play_note(data);
		else stop_note(data);

		cb();
	}

	function play_note(data) {
		var node = get_node(data);
		options.update(node);
		node.connect(gain);
	}

	function stop_note(data) {
		var node = get_node(data);
		options.update(node);
		node.disconnect(gain);
	}

	function update_osc(data, osc) {
		// Do nothing
	}

	function make_osc(data) {
		var frequency = data.frequency;
		var oscillator = ctx.createOscillator();

		oscillator.frequency.value = frequency;
		oscillator.type = options.type;
		oscillator.start();

		return oscillator;
	}

	function get_node(data) {
		var note = data.note;
		if (note_map[note])
			return note_map[note];
		return note_map[note] = options.node(data);
	}
}
