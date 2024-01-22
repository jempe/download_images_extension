(function() {
	const images = document.querySelectorAll('.step img');
	if (images && images.length > 0) {
		console.log('Found ' + images.length + ' images on this page.');
		var urls = [];

		for (var i = 0; i < images.length; i++) {
			urls.push(images[i].src);
		}

		chrome.runtime.sendMessage({urls});
	} else {
		console.log('No images found on this page.');
	}
})();
