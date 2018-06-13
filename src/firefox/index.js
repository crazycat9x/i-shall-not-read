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

function wpm(wordCount) {
	const totalSeconds = wordCount / 3;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds - minutes * 60);
	return { minutes: minutes, seconds: seconds };
}

function main() {
    const feed = document.querySelector("[role='feed']")
	const posts = feed.getElementsByClassName("text_exposed_root");
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

ready(main)
