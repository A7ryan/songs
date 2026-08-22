const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");

const songTitle = document.getElementById("songTitle");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

// Change this to 11 if you only have 11 songs.
// Leaving it at 12 is fine even if 12.mp3 doesn't exist.
const TOTAL_SONGS = 1;

let currentSong = 1;


/* -----------------------------
   Load song
----------------------------- */

function loadSong(number, autoplay = false) {
    currentSong = number;

    audio.src = `music/${number}.mp3`;

    songTitle.textContent = `Song ${number}`;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    if (autoplay) {
        audio.play()
            .then(() => {
                updatePlayButton();
            })
            .catch(() => {
                updatePlayButton();
            });
    }

    updatePlayButton();
}


/* -----------------------------
   Play / Pause
----------------------------- */

function togglePlay() {
    if (!audio.src) {
        loadSong(currentSong);
    }

    if (audio.paused) {
        audio.play()
            .then(() => {
                updatePlayButton();
            })
            .catch(() => {
                console.log("Unable to play audio.");
            });
    } else {
        audio.pause();
        updatePlayButton();
    }
}


/* -----------------------------
   Play button icon
----------------------------- */

function updatePlayButton() {
    if (audio.paused) {
        playBtn.textContent = "▶";
        playBtn.setAttribute("aria-label", "Play");
    } else {
        playBtn.textContent = "Ⅱ";
        playBtn.setAttribute("aria-label", "Pause");
    }
}


/* -----------------------------
   Next / Previous
----------------------------- */

function nextSong() {
    let next = currentSong + 1;

    if (next > TOTAL_SONGS) {
        next = 1;
    }

    loadSong(next, true);
}

function previousSong() {
    let previous = currentSong - 1;

    if (previous < 1) {
        previous = TOTAL_SONGS;
    }

    loadSong(previous, true);
}


/* -----------------------------
   Format time
----------------------------- */

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}


/* -----------------------------
   Update progress
----------------------------- */

audio.addEventListener("timeupdate", () => {
    if (!audio.duration) {
        return;
    }

    const percentage =
        (audio.currentTime / audio.duration) * 100;

    progress.value = percentage;

    currentTime.textContent =
        formatTime(audio.currentTime);
});


/* -----------------------------
   Duration loaded
----------------------------- */

audio.addEventListener("loadedmetadata", () => {
    duration.textContent =
        formatTime(audio.duration);
});


/* -----------------------------
   Seek
----------------------------- */

progress.addEventListener("input", () => {
    if (!audio.duration) {
        return;
    }

    const seekTime =
        (progress.value / 100) * audio.duration;

    audio.currentTime = seekTime;
});


/* -----------------------------
   Song finished
----------------------------- */

audio.addEventListener("ended", () => {
    nextSong();
});


/* -----------------------------
   Audio state
----------------------------- */

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);


/* -----------------------------
   Buttons
----------------------------- */

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);


/* -----------------------------
   Start with Song 1
----------------------------- */

loadSong(1);
