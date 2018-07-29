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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForFB(watch, callback) {
  // observe when post finish loading
  const observer = new MutationObserver(mutationsList => {
    mutationsList.forEach(mutation => {
      // the "async_saving" class indicate loading post
      if (
        mutation.type === "attributes" &&
        !watch.classList.contains("async_saving")
      ) {
        // if post finish loading, then disconnect the observer and call the callback
        observer.disconnect();
        callback();
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
  if (posts === undefined || posts === null || posts.length === 0) {
    return;
  }
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
    )[0].innerText = `...estimated reading time ${time.minutes}m ${time.seconds}s`;
  }
}

function observeMainPage() {
  // get the post stream
  const feed = document.querySelector("[role='feed']");
  const postStream = feed.lastChild.firstChild;
  if (postStream === undefined || postStream === null) {
    throw "couldn't get feed";
  }
  addReadingTime(feed);
  // get fb placeholder for loading post
  const asyncWatch = feed.lastChild.lastChild;
  // set up an observer which detect newly added posts
  const observer = new MutationObserver(mutationsList =>
    mutationsList.forEach(mutation => {
      // call waitForFB on add posts, pass in the loading placeholder and a callback
      waitForFB(asyncWatch, () => addReadingTime(mutation.addedNodes[0]));
    })
  );
  const config = { attributes: false, childList: true, subtree: false };
  observer.observe(postStream, config);
  return observer;
}

function main() {
  let mainpageObserver;
  let success = false;
  // try setting up an observer every 1/2 sec
  async function tryBlock() {
    try {
      // if found call observeMainPage() which will return an observer
      mainpageObserver = observeMainPage();
      success = true;
    } catch (e) {
      success = false;
      await sleep(500);
      tryBlock();
    }
  }
  tryBlock();
  const urlListener = request => {
    // if page change => disconnect old observer and try set up a new one
    if (request.type === "urlChange" && success === true) {
      success = false;
      mainpageObserver.disconnect();
      tryBlock();
    }
  };
  browser.runtime.onMessage.addListener(urlListener);
}

ready(main);
