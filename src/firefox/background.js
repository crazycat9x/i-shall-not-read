
function onError(error) {
	console.error(`Error: ${error}`);
}

function sendMessageToTabs(tabs) {
	for (let tab of tabs) {
		browser.tabs.sendMessage(tab.id, {
			type: "urlChange"
		});
	}
}

browser.tabs.onUpdated.addListener(() => {
	browser.tabs
		.query({
			currentWindow: true,
			active: true
		})
		.then(sendMessageToTabs)
		.catch(onError);
});
