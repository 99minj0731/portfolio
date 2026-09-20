const topButton = document.querySelector(".top-button");

if (topButton) {
  function updateTopButton() {
    const isVisible = window.scrollY > 300;

    topButton.classList.toggle("is-visible", isVisible);
  }

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", updateTopButton, {
    passive: true,
  });

  updateTopButton();
}
