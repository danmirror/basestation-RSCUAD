//
// Dashboard UI untuk Base Station R-SCUAD
// Semua data tetap diproses oleh client.js (class Status & Entry);
// file ini hanya membaca hasilnya lalu menyajikannya secara visual.
//
(function () {
	'use strict';

	var ROBOTS = [1, 2, 3, 4, 5];
	var STATE_LABEL = { run: 'ACTIVE', standby: 'STANDBY', loss: 'OFFLINE', idle: 'IDLE' };
	var METRICS = ['tilt', 'pan', 'gyro'];
	var SPARK_SLOT_MS = 150;	// lebar satu batang grafik aktivitas
	var SAMPLE_MS = 40;			// pembacaan nilai & penghitungan rate paket

	var $ = function (id) { return document.getElementById(id); };

	// ==================================================================
	// Tab navigation
	// ==================================================================
	var tabs = document.querySelectorAll('.tab');
	var panels = document.querySelectorAll('.panel');

	function showTab(name) {
		tabs.forEach(function (t) {
			var on = t.dataset.tab === name;
			t.classList.toggle('active', on);
			t.setAttribute('aria-selected', on ? 'true' : 'false');
		});
		panels.forEach(function (p) {
			p.classList.toggle('active', p.id === 'panel-' + name);
		});
		if (name === 'position') scaleField();
		if (location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
	}

	tabs.forEach(function (t) {
		t.addEventListener('click', function () { showTab(t.dataset.tab); });
	});

	// ==================================================================
	// Modal & shortcut
	// ==================================================================
	var modal = $('myModal');

	$('myBtn').addEventListener('click', function () { modal.classList.add('open'); });
	document.querySelector('.close').addEventListener('click', function () { modal.classList.remove('open'); });
	modal.addEventListener('click', function (e) {
		if (e.target === modal) modal.classList.remove('open');
	});

	document.addEventListener('keydown', function (e) {
		if (e.target.tagName === 'INPUT') return;
		if (e.key === 'Escape') modal.classList.remove('open');
		else if (e.key === '1') showTab('robot');
		else if (e.key === '2') showTab('stream');
		else if (e.key === '3') showTab('position');
		else if (e.key === 'g' || e.key === 'G') modal.classList.toggle('open');
	});

	// ==================================================================
	// System log
	// ==================================================================
	var logList = $('logList');
	var LOG_TONE = {
		ok: 'text-emerald-400',
		warn: 'text-amber-400',
		bad: 'text-red-400',
		info: 'text-sky-400'
	};

	function log(tone, source, message) {
		var row = document.createElement('div');
		row.className = 'log-line';
		row.innerHTML =
			'<span class="log-time">' + new Date().toLocaleTimeString('id-ID', { hour12: false }) + '</span>' +
			'<span class="w-14 shrink-0 ' + (LOG_TONE[tone] || LOG_TONE.info) + '">' + source + '</span>' +
			'<span class="min-w-0 truncate text-slate-400">' + message + '</span>';

		logList.prepend(row);
		while (logList.childElementCount > 40) logList.lastElementChild.remove();
	}

	// ==================================================================
	// Status robot: dibaca dari class yang di-toggle client.js
	// ==================================================================
	var lastState = {};

	function readState(n) {
		var card = $('r' + n);
		return card.classList.contains('run') ? 'run'
			: card.classList.contains('standby') ? 'standby'
				: card.classList.contains('loss') ? 'loss' : 'idle';
	}

	function syncStatus(n) {
		var state = readState(n);
		if (lastState[n] === state) return;

		if (lastState[n] !== undefined) {
			var tone = state === 'run' ? 'ok' : state === 'standby' ? 'warn' : state === 'loss' ? 'bad' : 'info';
			log(tone, 'ROBOT ' + n, 'status → ' + STATE_LABEL[state]);
		}
		lastState[n] = state;

		$('badge' + n).textContent = STATE_LABEL[state];
		$('fleet' + n).dataset.state = state;
		$('legendState' + n).textContent = STATE_LABEL[state];
		updateFleetCounters();
	}

	function updateFleetCounters() {
		var count = { run: 0, standby: 0, loss: 0, idle: 0 };
		ROBOTS.forEach(function (n) { count[lastState[n] || 'idle']++; });

		$('kpiActive').textContent = count.run;
		$('kpiStandby').textContent = count.standby;
		$('kpiOffline').textContent = count.loss + count.idle;
	}

	ROBOTS.forEach(function (n) {
		new MutationObserver(function () { syncStatus(n); })
			.observe($('r' + n), { attributes: true, attributeFilter: ['class'] });
		syncStatus(n);
	});

	// ==================================================================
	// Meter, flag, dan aktivitas paket
	// ==================================================================
	// Nilai TILT/PAN/GYRO tidak punya rentang tetap, jadi bar memakai skala
	// otomatis terhadap nilai terbesar yang pernah diterima (minimal 90).
	var scale = {};
	var prevValue = {};
	var packetTimes = {};
	var slotHit = {};
	var sparkBars = {};
	var sparkHist = {};
	var el = {};

	ROBOTS.forEach(function (n) {
		packetTimes[n] = [];
		slotHit[n] = false;
		sparkBars[n] = Array.prototype.slice.call($('spark' + n).children);
		sparkHist[n] = sparkBars[n].map(function () { return 0; });

		// elemen di-cache sekali supaya loop cepat tidak query DOM terus
		el[n] = {
			recv: $('recv_' + n),
			meters: METRICS.map(function (m) {
				scale[m + '_' + n] = 90;
				return {
					key: m + '_' + n,
					input: $(m + '_' + n),
					fill: document.querySelector('[data-fill="' + m + '_' + n + '"]')
				};
			}),
			chips: Array.prototype.map.call(
				document.querySelectorAll('#r' + n + ' [data-flag]'),
				function (chip) {
					return { chip: chip, input: $(chip.dataset.flag), style: chip.dataset.flagStyle || 'on' };
				})
		};
	});

	function num(v) {
		var f = parseFloat(v);
		return isNaN(f) ? null : f;
	}

	function updateMeters(n) {
		el[n].meters.forEach(function (m) {
			var value = num(m.input.value);
			if (value === null) { m.fill.style.width = '0%'; return; }

			scale[m.key] = Math.max(scale[m.key] * 0.999, Math.abs(value), 90);
			m.fill.style.width = Math.min(100, (Math.abs(value) / scale[m.key]) * 100).toFixed(1) + '%';
		});
	}

	function updateFlags(n) {
		el[n].chips.forEach(function (c) {
			var on = num(c.input.value) > 0;
			if (c.chip.classList.contains(c.style) === on) return;
			c.chip.classList.toggle(c.style, on);

			// bola bisa muncul-hilang sangat cepat, cukup ditandai kilat
			// pada nilainya supaya log tidak dibanjiri
			if (c.input.id.indexOf('ball') === 0) {
				c.input.classList.add('flash');
				setTimeout(function () { c.input.classList.remove('flash'); }, 600);
			}
		});
	}

	// tiap perubahan nilai RECV = satu paket baru dari robot tersebut
	function trackPacket(n) {
		var recv = el[n].recv.value;
		if (recv === '' || recv === prevValue[n]) return;

		prevValue[n] = recv;
		packetTimes[n].push(Date.now());
		slotHit[n] = true;
	}

	function renderSpark(n) {
		var hist = sparkHist[n];
		hist.shift();
		hist.push(slotHit[n] ? 60 + Math.round(Math.random() * 40) : 0);
		slotHit[n] = false;

		sparkBars[n].forEach(function (bar, i) {
			bar.style.height = (hist[i] || 12) + '%';
			bar.classList.toggle('hit', hist[i] > 0);
		});
	}

	// loop cepat: cukup rapat untuk menangkap paket 10 Hz tanpa terlewat
	setInterval(function () {
		ROBOTS.forEach(function (n) {
			trackPacket(n);
			updateMeters(n);
			updateFlags(n);
		});
	}, SAMPLE_MS);

	// loop grafik: satu batang per slot waktu
	setInterval(function () {
		ROBOTS.forEach(renderSpark);
	}, SPARK_SLOT_MS);

	// hitung rate paket per detik
	setInterval(function () {
		var cutoff = Date.now() - 1000;
		var total = 0;

		ROBOTS.forEach(function (n) {
			packetTimes[n] = packetTimes[n].filter(function (t) { return t > cutoff; });
			$('hz' + n).textContent = packetTimes[n].length.toFixed(1);
			total += packetTimes[n].length;
		});

		$('kpiRate').textContent = total + ' Hz';
	}, 500);

	// ==================================================================
	// Header: jam, uptime, game state
	// ==================================================================
	var linkSince = null;

	setInterval(function () {
		$('clock').textContent = new Date().toLocaleTimeString('id-ID', { hour12: false });

		if (linkSince) {
			var s = Math.floor((Date.now() - linkSince) / 1000);
			$('kpiUptime').textContent =
				String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
		}

		var refree = $('refree').textContent.trim();
		if ($('kpiState').textContent !== refree) {
			$('kpiState').textContent = refree;
			log('info', 'REFEREE', 'game state → ' + refree);
		}
	}, 1000);

	// ==================================================================
	// Lapangan: stage tetap 900x600 (koordinat paket dalam px), di-scale
	// ==================================================================
	var FIELD_W = 900, FIELD_H = 600;
	var viewport = $('fieldViewport');
	var stage = $('fieldBackground');

	function scaleField() {
		var avail = viewport.parentElement.clientWidth - 32;	// padding .surface
		var s = Math.min(avail / FIELD_W, (window.innerHeight - 250) / FIELD_H, 1.6);
		s = Math.max(s, 0.35);

		stage.style.transform = 'scale(' + s + ')';
		viewport.style.width = (FIELD_W * s) + 'px';
		viewport.style.height = (FIELD_H * s) + 'px';
	}

	window.addEventListener('resize', scaleField);
	scaleField();

	// titik dibuat ulang oleh client.js tiap paket, jadi cukup dibaca berkala
	setInterval(function () {
		ROBOTS.forEach(function (n) {
			var dot = document.getElementsByClassName('pointR' + n)[0];
			$('coord' + n).textContent = dot
				? parseInt(dot.style.left, 10) + ', ' + parseInt(dot.style.top, 10)
				: '—';
		});
	}, 200);

	// ==================================================================
	// Websocket telemetry
	// ==================================================================
	window.Init = function () {
		var status = new Status();
		status.RobotLoss1();
		status.RobotLoss2();
		status.RobotLoss3();
		status.RobotLoss4();
		status.RobotLoss5();
	};

	window.EntryData = function (data) {
		new Entry(data, data[11], new Status()).Calculation();
	};

	(function () {
		var state = $('state');
		var linkStatus = $('linkStatus');
		var linkText = $('linkText');

		if (window.WebSocket === undefined) {
			alert("Your browser does not support WebSockets");
			return;
		}

		var ws = new WebSocket('ws://' + window.location.host + '/ws');

		ws.onopen = function () {
			state.classList.add('staterun');
			linkStatus.classList.remove('text-red-400');
			linkStatus.classList.add('text-emerald-400');
			linkText.textContent = 'ONLINE';
			linkSince = Date.now();
			log('ok', 'LINK', 'websocket tersambung ke ' + window.location.host);
			Init();
		};

		ws.onmessage = function (e) {
			var data = e.data;
			data = data.replace(/(\r\n|\n|\r)/gm, "");
			data = data.replace('\"', "");
			data = data.replace('\"', "");

			EntryData(data.split(","));
		};

		ws.onclose = function () {
			state.classList.remove('staterun');
			linkStatus.classList.add('text-red-400');
			linkStatus.classList.remove('text-emerald-400');
			linkText.textContent = 'OFFLINE';
			linkSince = null;
			$('kpiUptime').textContent = '—';
			log('bad', 'LINK', 'websocket terputus');
		};

		setInterval(function () {
			if (ws.readyState !== WebSocket.OPEN) return;
			for (var n = 0; n <= 5; n++) {	// 0 = referee box, 1..5 = robot
				ws.send(JSON.stringify({ Num: n }));
			}
		}, 100);
	})();

	// ==================================================================
	// Camera stream
	// ==================================================================
	(function () {
		var lastFrame = {};
		var frameCount = {};

		ROBOTS.forEach(function (n) {
			var img = $('video' + n);
			var card = $('stream' + n);
			var socket = new WebSocket('ws://' + window.location.host + '/video' + n);
			socket.binaryType = "arraybuffer";
			frameCount[n] = 0;

			socket.onmessage = function (event) {
				var url = URL.createObjectURL(new Blob([event.data], { type: 'image/jpeg' }));
				if (img.src) URL.revokeObjectURL(img.src);
				img.src = url;

				frameCount[n]++;
				lastFrame[n] = Date.now();
				if (!card.classList.contains('live')) {
					card.classList.add('live');
					log('ok', 'CAM ' + n, 'stream aktif');
				}
			};

			socket.onerror = function (error) {
				console.error('WebSocket error (video' + n + '):', error);
			};

			socket.onclose = function () { card.classList.remove('live'); };
		});

		// FPS + deteksi stream mati (tanpa frame > 2 detik)
		setInterval(function () {
			ROBOTS.forEach(function (n) {
				$('fps' + n).textContent = frameCount[n];
				frameCount[n] = 0;

				if (Date.now() - (lastFrame[n] || 0) > 2000) {
					var card = $('stream' + n);
					if (card.classList.contains('live')) log('warn', 'CAM ' + n, 'stream terputus');
					card.classList.remove('live');
				}
			});
		}, 1000);
	})();

	// ==================================================================
	// Boot
	// ==================================================================
	if (['#robot', '#stream', '#position'].indexOf(location.hash) !== -1) {
		showTab(location.hash.slice(1));
	}

	log('info', 'SYSTEM', 'dashboard siap — menunggu data robot');
})();
