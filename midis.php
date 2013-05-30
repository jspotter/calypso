<select id="midiselect">
	<?php
		if ($handle = opendir("midi")) {
			while (($entry = readdir($handle)) !== false) {
				if ($entry == "." or $entry == "..")
					continue;
	?>
				<option value="<?= $entry ?>"><?= $entry ?></option>
	<?php
			}
			closedir($handle);
		}
	?>
</select>
