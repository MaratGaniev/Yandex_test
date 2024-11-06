const sliders = document.querySelectorAll('.slider');

sliders.forEach(slider => activateSlider(slider));

function activateSlider(slider) {
	const controls = {
		prev: slider.querySelector('.arrow_prev'),
		next: slider.querySelector('.arrow_next'),
		wrap: slider.querySelector('.slider__list'),
	};
	const autoPlay = slider.dataset.autoplay === 'true';
	const loop = slider.dataset.loop === 'true';
	const paginationType = slider.dataset.paginationType;
	const sliderItems = slider.querySelectorAll('.slider__item');
	const sliderCount = sliderItems.length;
	let slideCount = 0;
	let currentSlide = 1;
	let playAuto;

	const getSlidePerScreen = () => {
		const sliderWidth = slider.offsetWidth;
		const sliderItemsWidth = slider.querySelector('.slider__list').scrollWidth;
		const slidePerScreen = Math.floor(sliderWidth / sliderItems[0].offsetWidth);
		const screenCount = Math.floor(sliderItemsWidth / sliderWidth);
		return { slidePerScreen, screenCount };
	};

	const getCurrentIndex = () =>
		Math.min(currentSlide * getSlidePerScreen().slidePerScreen, sliderCount);

	const resetSlide = () => {
		const { slidePerScreen, screenCount } = getSlidePerScreen();
		currentSlide = Math.floor(getCurrentIndex() / slidePerScreen);
		moveSlides();
		setPagination();
	};

	const blockedButton = () => {
		const isPrevDisabled = currentSlide === 1;
		const isNextDisabled = loop ? false : currentSlide === slideCount;
		controls.prev.classList.toggle('button_disabled', isPrevDisabled);
		controls.next.classList.toggle('button_disabled', isNextDisabled);
	};
	const addPagination = () => {
		const { slidePerScreen, screenCount } = getSlidePerScreen();
		const pagination = slider.querySelector('.slider__pagination');
		slideCount = screenCount;

		if (paginationType === 'count') {
			const startIndex = getCurrentIndex();
			pagination.innerHTML = `<span class="slider__current">${startIndex}</span><span class="slider__length"> / ${sliderCount}</span>`;
			moveSlides();
		}
		if (paginationType === 'dots') {
			const dot = '<button class="slider__dot"></button>';
			pagination.innerHTML = `<div class="slider__dotes">${dot.repeat(
				screenCount
			)}</div>`;
			slider
				.querySelector('.slider__dot:nth-child(' + currentSlide + ')')
				.classList.add('slider__dot_active');

			pagination
				.querySelector('.slider__dotes')
				.addEventListener('click', e => {
					const target = e.target;
					if (
						target.classList.contains('slider__dot') &&
						!target.classList.contains('slider__dot_active')
					) {
						const index = [...target.parentNode.children].indexOf(target);
						currentSlide = index + 1;
						moveSlides();
						setPagination();
					}
				});
		}
		blockedButton();
		if (autoPlay) startPlay();
	};

	const setPagination = () => {
		const index = getCurrentIndex();
		if (paginationType === 'count') {
			slider.querySelector('.slider__pagination .slider__current').textContent =
				index;
		}
		if (paginationType === 'dots') {
			const { slidePerScreen, screenCount } = getSlidePerScreen();
			if (screenCount !== slideCount) {
				slider.querySelector('.slider__dotes').innerHTML =
					'<button class="slider__dot"></button>'.repeat(screenCount);
				slideCount = screenCount;
			}
			slider
				.querySelectorAll('.slider__dot')
				.forEach(dot => dot.classList.remove('slider__dot_active'));
			slider
				.querySelector('.slider__dot:nth-child(' + currentSlide + ')')
				.classList.add('slider__dot_active');
		}
		blockedButton();
	};

	const moveSlides = async () => {
		const slide = -(currentSlide - 1) * 100 + '%';
		controls.wrap.style = `transform: translateX(calc( ${slide} - ${
			currentSlide * 20
		}px))`;
	};

	const nextSlide = () => {
		const thisIndex = getCurrentIndex();
		if (currentSlide < slideCount) {
			currentSlide++;
			moveSlides();
			setPagination();
		} else if (loop) {
			const { slidePerScreen } = getSlidePerScreen();
			const tempSlide = [...sliderItems].slice(0, slidePerScreen);
			const addSlide = tempSlide.map(item => {
				const temp = item.cloneNode(true);
				slider.querySelector('.slider__list').appendChild(temp);
				return temp;
			});
			currentSlide++;
			moveSlides();
			currentSlide = 1;
			setPagination();
			setTimeout(async () => {
				slider.querySelector('.slider__list').classList.add('noTransition');
				moveSlides();
				setTimeout(() => {
					slider
						.querySelector('.slider__list')
						.classList.remove('noTransition');
					addSlide.forEach(item => {
						item.remove();
					});
				}, 100);
			}, 600);
		}
	};

	const prevSlide = () => {
		if (currentSlide > 1) {
			currentSlide--;
			moveSlides();
			setPagination();
		}
	};

	const pausePlay = () => {
		clearInterval(playAuto);
		slider.removeEventListener('mouseover', pausePlay);
		slider.addEventListener('mouseout', startPlay);
	};
	const startPlay = () => {
		slider.removeEventListener('mouseout', startPlay);
		playAuto = setInterval(nextSlide, 4000);
		slider.addEventListener('mouseover', pausePlay);
	};
	controls.prev.addEventListener('click', prevSlide);
	controls.next.addEventListener('click', nextSlide);

	addPagination();

	function disableStageSlider() {
		const screenWidth = window.innerWidth;
		if (screenWidth > 840) {
			currentSlide = 1;
			moveSlides();
		} else {
			resetSlide();
		}
	}

	window.addEventListener('resize', () => {
		if (slider.classList.contains('stages__slider')) {
			disableStageSlider();
		} else {
			resetSlide();
		}
	});
}
