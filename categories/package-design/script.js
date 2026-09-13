const tabs = document.querySelectorAll(".project-tab");
const frame = document.querySelector("#project-frame");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");

    frame.src = tab.dataset.src;
  });
});
