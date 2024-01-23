(function() {
	const login_button = document.querySelector("nav a[href^='/login']");

	// only display button when using public link and not logged in
	if(login_button) {
		// check all the steps
		if(document.querySelectorAll('.step').length > 0) {
			// add download images button
			const download_button = document.createElement('button');
			download_button.innerText = 'Download Images';
			download_button.setAttribute('style', 'background: #ff0081; color: white; padding: 0 20px; border-radius: 5px; margin-left: 15px;');

			download_button.addEventListener('click', get_images);

			login_button.closest("div").appendChild(download_button);

			log('Addded download button to page.');
		} else {
			log('No steps found on this page.');
		}

	} else {
		log('No login button found on this page.');
	}

	function get_images() {

		// get all step images
		const images = document.querySelectorAll('.step img');
		if (images && images.length > 0) {
			log('Found ' + images.length + ' images on this page.');
			var urls = [];

			let content = "";

			const title = document.querySelector('h1').innerText;

			content += "## " + title + "\n\n";

			const prefix = snake_case(title);

			for (var i = 0; i < images.length; i++) {

				const number_with_leading_zero = ("0" + (i + 1)).slice(-2);

				const step_title = images[i].closest('.step').querySelector('h3 > span.text-xl > span').innerText;

				const step_description = images[i].closest('.step').querySelector('p').innerText;

				const suffix = snake_case(step_title);

				// create a filename for the image
				const file_name = prefix + number_with_leading_zero + "_" + suffix + ".webp";

				content +=  (i + 1)  + ". " + step_description + "\n\n";

				content += "![" + step_title + "](https://raw.githubusercontent.com/wiki/github_user/wiki_name/wiki_images_path/" + file_name + ")\n\n";

				urls.push({
					src: images[i].src,
					filename: file_name
				});
			}

			//create a base64 encoded string from the content
			const base64 = btoa(content);

			//create a data url from the base64 encoded string
			const dataUrl = "data:text/plain;base64," + base64;

			//add the markdown file to the urls array
			urls.push({
				src: dataUrl,
				filename: prefix + ".md"
			});

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
