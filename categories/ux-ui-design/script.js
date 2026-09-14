// UX/UI Design 페이지 전용 동작을 아래에 추가하세요.
const tabs = document.querySelectorAll(".project-tab");
const frame = document.querySelector("#project-frame");
const topButton = document.querySelector(".top-button");

function resizeFrame() {
  const frameDocument = frame.contentDocument || frame.contentWindow.document;

  frame.style.height = "auto";

  const height = Math.max(
    frameDocument.body.scrollHeight,
    frameDocument.body.offsetHeight,
    frameDocument.documentElement.scrollHeight,
    frameDocument.documentElement.offsetHeight,
  );

  frame.style.height = `${height}px`;
}

frame.addEventListener("load", () => {
  resizeFrame();

  setTimeout(resizeFrame, 100);
  setTimeout(resizeFrame, 500);
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");

    frame.src = tab.dataset.src;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});

topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
