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

			const crop_images_checkbox = document.createElement('input');
			crop_images_checkbox.type = "checkbox";
			crop_images_checkbox.id = "crop_images";
			crop_images_checkbox.style.marginLeft = "5px";
			crop_images_checkbox.style.marginRight = "5px";
			crop_images_checkbox.style.border = "1px solid #ccc";
			crop_images_checkbox.style.borderRadius = "4px";

			const crop_images_label = document.createElement('label');
			crop_images_label.htmlFor = "crop_images";
			crop_images_label.innerText = "Crop?";
			crop_images_label.style.fontSize = "12px";

			login_button.closest("div").appendChild(crop_images_checkbox);
			login_button.closest("div").appendChild(crop_images_label);

			log('Addded download button to page.');
		} else {
			log('No steps found on this page.');
		}

	} else {
		log('No login button found on this page.');
	}

	function get_cropped_image(image) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		const image_container = image.closest("div[style*='aspect-ratio']");

		canvas.width = image_container.offsetWidth;
		canvas.height = image_container.offsetHeight;

		const clip_container = image_container.querySelector("div");

		const tranform_data = window.getComputedStyle(clip_container).transform.split(",");

		const tranlate_x = parseFloat(tranform_data[4].trim());
		const tranlate_y = parseFloat(tranform_data[5].trim().replace(")", ""))

		ctx.drawImage(image, tranlate_x, tranlate_y, 
			clip_container.getBoundingClientRect().width, clip_container.getBoundingClientRect().height);

		const dataUrl = canvas.toDataURL('image/webp', 1.0);

		return dataUrl;
	}

	function get_images() {

		const crop_images = document.getElementById("crop_images").checked;

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

				if(crop_images) {
					content += "### " + step_title + "\n\n";
				} else {
					content +=  (i + 1)  + ". ";
				}

				content += step_description + "\n\n";

				content += "![" + step_title + "](https://raw.githubusercontent.com/wiki/github_user/wiki_name/wiki_images_path/" + file_name + ")\n\n";

				var image_url = images[i].src;

				if(crop_images) {
					image_url = get_cropped_image(images[i]);
				}
			
				urls.push({
					src: image_url,
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
