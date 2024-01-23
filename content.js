(function() {
	const login_button = document.querySelector("nav a[href^='/login']");

	if(login_button) {
		if(document.querySelectorAll('.step').length > 0) {
			const download_button = document.createElement('button');
			download_button.innerText = 'Download Images';
			download_button.addEventListener('click', get_images);
			download_button.setAttribute('style', 'background: #ff0081; color: white; padding: 0 20px; border-radius: 5px; margin-left: 15px;');

			login_button.closest("div").appendChild(download_button);

			log('Addded download button to page.');
		} else {
			log('No steps found on this page.');
		}

	} else {
		log('No login button found on this page.');
	}

	function get_images() {
		const images = document.querySelectorAll('.step img');
		if (images && images.length > 0) {
			log('Found ' + images.length + ' images on this page.');
			var urls = [];

			const prefix = snake_case(document.querySelector('h1').innerText);

			for (var i = 0; i < images.length; i++) {

				const number_with_leading_zero = ("0" + (i + 1)).slice(-2);

				const suffix = snake_case(images[i].closest('.step').querySelector('h3 > span.text-xl > span').innerText);

				urls.push({
					src: images[i].src,
					filename: prefix + number_with_leading_zero + "_" + suffix + ".webp"
				});
			}

			chrome.runtime.sendMessage({
				action: 'download',
				urls: urls
			});
		} else {
			log('No images found on this page.');
		}
	}

	function log(message) {
		console.log("Download Image Extension:", message);
	}

	function snake_case(str) {
		return str.replace(/\W+/g, " ")
			.split(/ |\B(?=[A-Z])/)
			.map(word => word.toLowerCase())
			.join('_');
	}
})();
