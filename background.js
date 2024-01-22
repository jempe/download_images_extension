chrome.runtime.onMessage.addListener((message) => {
	const urls = message.urls;
	urls.forEach((url) => {
		chrome.downloads.download({url: url.src, filename: url.filename});
	});
});
