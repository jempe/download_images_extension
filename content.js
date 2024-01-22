(function() {
	const images = document.querySelectorAll('.step img');
	if (images && images.length > 0) {
		console.log('Found ' + images.length + ' images on this page.');
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
		console.log('No images found on this page.');
	}
})();
