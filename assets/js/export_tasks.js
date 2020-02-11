// Based off https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser

function buildDataString(jsonObject) {
	return `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsonObject))}`;
}

function addDataToElement(data, element, fileName = 'export') {
	element.setAttribute('href', data);
	element.setAttribute('download', `${fileName}.json`);
	document.body.appendChild(element); // required for firefox
}

function triggerDownloadWindow(element) {
	element.click();
	element.remove();
}

export default function promptUserToDownloadJSON(jsonObject) {
	const data = buildDataString(jsonObject);
	const temporaryNode = document.createElement('a');
	addDataToElement(data, temporaryNode);
	triggerDownloadWindow(temporaryNode);
}
