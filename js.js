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
	"c": "note_lead_c",
	"c#": "note_lead_cs",
	"d": "note_lead_d",
	"d#": "note_lead_ds",
	"e": "note_lead_e",
	"f": "note_lead_f",
	"f#": "note_lead_fs",
	"g": "note_lead_g",
	"g#": "note_lead_gs",
	"a": "note_lead_a",
	"a#": "note_lead_as",
	"b": "note_lead_b",

	"cc": "note_lead_cc",
	"cc#": "note_lead_ccs",
	"dd": "note_lead_dd",
	"dd#": "note_lead_dds",
	"ee": "note_lead_ee",
	"ff": "note_lead_ff",
	"ff#": "note_lead_ffs",
	"gg": "note_lead_gg",
	"gg#": "note_lead_ggs",
	"aa": "note_lead_aa",
	"aa#": "note_lead_aas",
	"bb": "note_lead_bb",

	"ccc": "note_lead_ccc",
	"ccc#": "note_lead_cccs",
	"ddd": "note_lead_ddd",
	"ddd#": "note_lead_ddds",
	"eee": "note_lead_eee"
};

var note_assets = {
	"lead": lead_notes
};

function Drum(type) {
	this.type = type;
	this.assets = note_assets[this.type];
	var this_drum = this;

	this.setup = function(type) {
		var offset = $("#drum").offset();
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
	}

	this.note_on = function(note) {
		id = this.assets[note];
		$("#" + id).fadeTo(0, 1);
	}

	this.note_off = function(note) {
		id = this.assets[note];
		$("#" + id).fadeTo("slow", 0);
	}

	this.play = function(filename) {
		loadRemote(filename, function(data) {
			midi_file = MidiFile(data);
		});
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

