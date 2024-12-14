window.addEventListener('load', function () {
	function countdown(time, timer) {
		let remTime = time;
		return new Promise(resolve => {
			function tick() {
				timer.querySelector('.countdown').textContent = remTime;
				if (remTime > 0) {
					remTime--;
					setTimeout(tick, 1000);
				} else {
					resolve();
				}
			}
			tick();
		});
	}

	function createTimer() {
		let counter = 0;
		return async function (time) {
			if (time && time > 0) {
				const timerNum = ++counter;
				const timerList = document.getElementById('timers');
				const timer = document.createElement('li');
				timer.classList.add('timers__item');
				timer.innerHTML = `<div> <div class="timer__title"> Таймер №${timerNum}</div> <div class="countdown">${time}</div></div> <button class="timer__control">Удалить таймер</button>`;
				timerList.appendChild(timer);
				document.getElementById('time-input').value = '';

				const removeTimer = () => {
					timer.removeEventListener('click', removeTimer);
					timer.remove();
				};

				timer
					.querySelector('.timer__control')
					.addEventListener('click', removeTimer);

				countdown(time, timer).then(removeTimer);
			}
		};
	}
	const newTimer = createTimer();

	const addTimer = document.getElementById('add-timer');
	addTimer.addEventListener('click', () =>
		newTimer(document.getElementById('time-input').value)
	);
});
