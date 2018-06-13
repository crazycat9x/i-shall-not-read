function ready(fn) {
	if (
		document.attachEvent
			? document.readyState === "complete"
			: document.readyState !== "loading"
	) {
		fn();
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

function waitForFB(watch, callback) {
	const observer = new MutationObserver(mutationsList => {
		mutationsList.forEach(mutation => {
			if (
				mutation.type === "attributes" &&
				watch.classList.contains("async_saving")
			) {
                observer.disconnect()
                callback()
			}
		});
	});
	const config = { attributes: true, childList: false, subtree: false };
	observer.observe(watch, config);
}

function wpm(wordCount) {
	const totalSeconds = wordCount / 3;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds - minutes * 60);
	return { minutes: minutes, seconds: seconds };
}

function addReadingTime(target) {
	const posts = target.getElementsByClassName("text_exposed_root");
	console.log(target, posts, posts.length)
	if(posts.length === 0) { return }
	for (o of posts) {
		const wordCount = Array.from(o.getElementsByTagName("p")).reduce(
			(accumulator, currentValue) => {
				return accumulator + currentValue.innerText.split(" ").length;
			},
			0
		);
		const time = wpm(wordCount);
		o.getElementsByClassName(
			"see_more_link_inner"
		)[0].innerText += ` estimate reading time ${time.minutes}m ${
			time.seconds
		}s`;
	}
}

function main() {
	const feed = document.querySelector("[role='feed']");
	addReadingTime(feed);
	const postStream = feed.lastChild.firstChild;
	const asyncWatch = feed.lastChild.lastChild;
	const observer = new MutationObserver(mutationsList =>
		mutationsList.forEach(mutation =>
			waitForFB(asyncWatch, () => addReadingTime(mutation.addedNodes[0]))
		)
	);
	const config = { attributes: false, childList: true, subtree: false };
	observer.observe(postStream, config);
}

ready(main);
