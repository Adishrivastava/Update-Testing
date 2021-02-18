// ? checking whether there is service worker support in browser
if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then((r) => {
			console.log('service worker registered', r);
		})
		.catch((e) => {
			console.log('service worker not registered ', e);
		});
}
