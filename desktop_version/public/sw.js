const staticCacheName = 'dash-static-v1';
const dynamicCacheName = 'dash-dynamic-v1';

const assets = [
	'/',
	'./index.html',
	'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js',
	'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
	'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
	'https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js',
	'https://cdn.datatables.net/buttons/1.5.2/js/buttons.print.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.8.0/js/bootstrap-datepicker.min.js',
	'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.2.0/papaparse.min.js',
	'./assects/styles/style.css',
	'assets/js/jquery.loadingModal.min.js',
	'./manifest.json',
];

// ? listening install event
self.addEventListener('install', async (evt) => {
	let promise = await caches
		.open(staticCacheName)
		.then((cache) => {
			//console.log('caches');
		})
		.catch((e) => {
			console.log(e);
		});
});

// ? activation event
self.addEventListener('activate', (evt) => {
	console.log('activated');
});

// ? todo fetch event
self.addEventListener('fetch', (evt) => {
	const req = evt.request;
	const url = new URL(req.url);
	if (url.origin == location.origin) {
		evt.respondWith(cacheFirst(req));
	} else {
		evt.respondWith(networkFirst(req));
	}
});

// ? looking for cache first in local files
const cacheFirst = async (req) => {
	let cachesRes = await caches.match(req);
	return cachesRes || fetch(req);
};

// ? looking network in hhtp files
const networkFirst = async (req) => {
	const cache = await caches.open(dynamicCacheName);

	if (req.method == 'POST') {
		const res = await fetch(req);

		return res;
	} else {
		try {
			const res = await fetch(req);
			cache.put(req, res.clone());
			return res;
		} catch (e) {
			return cache.match(req);
		}
	}
	//return fetch(req);
};
