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

			for (var i = 0; i < images.length; i++) {
				urls.push({
					src: images[i].src,
					filename: "image" + i + ".webp"
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
})();
