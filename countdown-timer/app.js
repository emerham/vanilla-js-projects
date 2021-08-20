const hoursEl = document.querySelector('#hours');
const minutesEl = document.querySelector('#minutes');
const secondsEL = document.querySelector('#seconds');
const btnStart = document.querySelector('.btn-start-resume');
const btnPause = document.querySelector('.btn-pause');
const btnStop = document.querySelector('.btn-stop');
const btnReset = document.querySelector('.btn-reset');
let interval;
let pause = false;
let initSeconds = 0;
init();

function init() {
    btnPause.style.display = 'none';
    btnStop.style.display = 'none';
    btnReset.style.display = 'none';

    btnStart.addEventListener('click', () => {
        const hours = parseInt(hoursEl.value);
        const minutes = parseInt(minutesEl.value);
        const seconds = parseInt(secondsEL.value);

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        initSeconds = totalSeconds;
        if (totalSeconds < 0) {
            return;
        }
        startTimer(totalSeconds);
        btnPause.style.display = 'inline-block';
        btnStop.style.display = 'inline-block';
        btnReset.style.display = 'inline-block';
        btnStart.style.display = 'none';
    });

    btnPause.addEventListener('click', () => {
        pause = !pause
        if (pause) {
            btnPause.innerText = 'Resume';
        } else {
            btnPause.innerText = 'Pause';
        }
    });

    btnReset.addEventListener('click', () => {
        updateInputs(initSeconds);
    });

    btnStop.addEventListener('click', () => {
        stopTimer();
        updateInputs(initSeconds);
        pause = false;
        btnPause.style.display = 'none';
        btnStop.style.display = 'none';
        btnReset.style.display = 'none';
        btnStart.style.display = 'inline-block';
        btnPause.innerText = 'Pause';
    });
}

function startTimer(totalSeconds) {
    interval = setInterval(() => {
        if (pause) return;
        totalSeconds--;
        if (totalSeconds <= 0) {
            stopTimer();
        }
        updateInputs(totalSeconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function updateInputs(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    hoursEl.value = hours;
    if (minutes > 60) {
        minutesEl.value = minutes % 60
    } else {
        minutesEl.value = minutes;
    }
    secondsEL.value = seconds;
}
