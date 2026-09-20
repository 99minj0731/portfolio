const highlightFrame = document.querySelector("#highlight-frame");

function resizeHighlightFrame() {
  if (!highlightFrame) return;

  const frameDocument =
    highlightFrame.contentDocument || highlightFrame.contentWindow.document;

  if (!frameDocument) return;

  const contentHeight = Math.max(
    frameDocument.body.scrollHeight,
    frameDocument.body.offsetHeight,
    frameDocument.documentElement.scrollHeight,
    frameDocument.documentElement.offsetHeight,
  );

  highlightFrame.style.height = `${contentHeight}px`;
}

highlightFrame.addEventListener("load", () => {
  resizeHighlightFrame();

  const frameDocument =
    highlightFrame.contentDocument || highlightFrame.contentWindow.document;

  const resizeObserver = new ResizeObserver(() => {
    resizeHighlightFrame();
  });

  resizeObserver.observe(frameDocument.body);

  frameDocument.querySelectorAll("img").forEach((image) => {
    image.addEventListener("load", resizeHighlightFrame);
  });
});

window.addEventListener("resize", resizeHighlightFrame);
