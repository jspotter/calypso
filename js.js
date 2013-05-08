var note_offsets = {
	"note_lead_c": {"left": 159, "top": 317},
	"note_lead_cs": {"left": 54, "top": 15},
	"note_lead_d": {"left": 303, "top": 216},
	"note_lead_ds": {"left": 10, "top": 162},
	"note_lead_e": {"left": 285, "top": 45},
	"note_lead_f": {"left": 71, "top": 300},
	"note_lead_fs": {"left": 136, "top": 4},
	"note_lead_g": {"left": 251, "top": 291},
	"note_lead_gs": {"left": 16, "top": 78},
	"note_lead_a": {"left": 325, "top": 133},
	"note_lead_as": {"left": 23, "top": 245},
	"note_lead_b": {"left": 228, "top": 8},

	"note_lead_cc": {"left": 183, "top": 251},
	"note_lead_ccs": {"left": 129, "top": 104},
	"note_lead_dd": {"left": 248, "top": 209},
	"note_lead_dds": {"left": 86, "top": 185},
	"note_lead_ee": {"left": 243, "top": 128},
	"note_lead_ff": {"left": 139, "top": 251},
	"note_lead_ffs": {"left": 175, "top": 84},
	"note_lead_gg": {"left": 230, "top": 248},
	"note_lead_ggs": {"left": 93, "top": 142},
	"note_lead_aa": {"left": 261, "top": 169},
	"note_lead_aas": {"left": 105, "top": 230},
	"note_lead_bb": {"left": 220, "top": 95},

	"note_lead_ccc": {"left": 158, "top": 206},
	"note_lead_cccs": {"left": 193, "top": 152},
	"note_lead_ddd": {"left": 203, "top": 213},
	"note_lead_ddds": {"left": 155, "top": 172},
	"note_lead_eee": {"left": 220, "top": 179}
};

var lead_notes = {
	"60": "note_lead_c",
	"61": "note_lead_cs",
	"62": "note_lead_d",
	"63": "note_lead_ds",
	"64": "note_lead_e",
	"65": "note_lead_f",
	"66": "note_lead_fs",
	"67": "note_lead_g",
	"68": "note_lead_gs",
	"69": "note_lead_a",
	"70": "note_lead_as",
	"71": "note_lead_b",

	"72": "note_lead_cc",
	"73": "note_lead_ccs",
	"74": "note_lead_dd",
	"75": "note_lead_dds",
	"76": "note_lead_ee",
	"77": "note_lead_ff",
	"78": "note_lead_ffs",
	"79": "note_lead_gg",
	"80": "note_lead_ggs",
	"81": "note_lead_aa",
	"82": "note_lead_aas",
	"83": "note_lead_bb",

	"84": "note_lead_ccc",
	"85": "note_lead_cccs",
	"86": "note_lead_ddd",
	"87": "note_lead_ddds",
	"88": "note_lead_eee"
};

var note_assets = {
	"lead": lead_notes
};

var track_nums = {
	"lead" : 1
};

function Drum(type, filename) {
	var this_drum = this;
	this.type = type;
	this.midi_file = {};
	this.stopped = true;
	this.assets = note_assets[type];

	// Set up this drum
	this.setup = function() {
		var offset = $("#drum").offset();
		var height = $("#drum").height();
		
		// Put notes in place
		for (var key in lead_notes) {
			id = this.assets[key];
			$("#" + id)
				.attr("name", key)
				.offset({
					left: offset.left + note_offsets[id]["left"],
					top: offset.top + note_offsets[id]["top"]
				})
				.click(function() {
					this_drum.note_on($(this).attr("name"));
					this_drum.note_off($(this).attr("name"));
				});
		}
		
		$("#controls")
			.offset({
				left: offset.left,
				top: offset.top + height
			});
		
		// Load MIDI file and set up controls
		loadRemote(filename, function(data) {
			//alert('DONE');
			this_drum.midi_file = MidiFile(data);
			var play_button = $("<input>", {type: "button", value: "PLAY"})
				.click(function() {
					this_drum.play();
				});
			var stop_button = $("<input>", {type: "button", value: "STOP"})
				.click(function() {
					this_drum.stop();
				});
			$("#controls")
				.html("")
				.append(play_button)
				.append(stop_button);
		});
	}

	this.note_on = function(note) {
		id = this.assets[note];
		$("#" + id).fadeTo(0, 1);
	}

	this.note_off = function(note) {
		id = this.assets[note];
		$("#" + id).fadeTo("fast", 0);
	}
	
	this.find_next_event = function(events, index) {
		var delta = 0;
		var num_events = events.length;
		for (var i = index; i < num_events; i++) {
			var ev = events[i];
			delta = delta + ev.deltaTime;
			if (ev.subtype == "noteOn" || ev.subtype == "noteOff") {
				//console.log("found " + ev.subtype + " " + ev.noteNumber + " " + delta);
				setTimeout(function() {
					this_drum.handle_event(events, i);
				}, delta * 3);
				break;
			}
		}
	}
	
	this.handle_event = function(events, index) {
		if (this.stopped) return;
	
		var ev = events[index];
		
		// handle event
		if (ev.subtype == "noteOn") {
			this.note_on(ev.noteNumber);
		} else if (ev.subtype == "noteOff") {
			this.note_off(ev.noteNumber);
		}
		
		// prepare for next event
		this.find_next_event(events, index + 1);
	}

	this.play = function() {
		if (!this.stopped) return;
		this.stopped = false;
		var track_num = track_nums[this.type];
		var events = this.midi_file["tracks"][track_num];
		this.find_next_event(events, 0);
		
		/*var track_num = track_nums[type];
		var num_events = midi_file["tracks"][track_num].length;
		for (var i = 0; i < num_events; i++) {
			var ev = this.midi_file["tracks"][track_num][i];
			if (ev.subtype == "noteOn") {
				// change this to use setTimeout
			}
		}*/
	}
	
	this.stop = function() {
		this.stopped = true;
		for (var key in lead_notes) {
			this.note_off(key);
		}
	}
}

/****************************
 * Taken from:
 * https://github.com/gasman/jasmid/blob/master/index.html
 ***************************/
function loadRemote(path, callback) {
	var fetch = new XMLHttpRequest();
	fetch.open('GET', path);
	fetch.overrideMimeType("text/plain; charset=x-user-defined");
	fetch.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			/* munge response into a binary string */
			var t = this.responseText || "" ;
			var ff = [];
			var mx = t.length;
			var scc= String.fromCharCode;
			for (var z = 0; z < mx; z++) {
				ff[z] = scc(t.charCodeAt(z) & 255);
			}
			callback(ff.join(""));
		}
	}
	fetch.send();
}
/****************************/

