const highlights = [
  {
    id: "poke",
    name: "포케",
    thumbnail: "poke-thumb.png",
    stories: [
      "poke-01.png",
      "poke-02.png",
      "poke-03.png",
      "poke-04.png",
      "poke-05.png",
      "poke-06.png",
      "poke-07.png",
      "poke-08.png",
    ],
  },
  {
    id: "pasta",
    name: "파스타",
    thumbnail: "pasta-thumb.png",
    stories: ["pasta-01.png", "pasta-02.png", "pasta-03.png", "pasta-04.png"],
  },
  {
    id: "taco-salad",
    name: "타코쌈 샐러드",
    thumbnail: "taco-salad-thumb.png",
    stories: ["taco-salad-01.png", "taco-salad-02.png"],
  },
  {
    id: "diet-box",
    name: "도시락",
    thumbnail: "diet-box-thumb.png",
    stories: [
      "diet-box-01.png",
      "diet-box-02.png",
      "diet-box-03.png",
      "diet-box-04.png",
      "diet-box-05.png",
      "diet-box-06.png",
      "diet-box-07.png",
    ],
  },
  {
    id: "rice-bowl",
    name: "덮밥",
    thumbnail: "rice-bowl-thumb.png",
    stories: ["rice-bowl-01.png", "rice-bowl-02.png"],
  },
];

const imageDirectory = "images/";

const highlightList = document.querySelector("#highlightList");
const storyStack = document.querySelector("#storyStack");
const storyTitle = document.querySelector("#storyTitle");

/* 상단 하이라이트 버튼 생성 */
function renderTabs(activeId) {
  highlightList.innerHTML = highlights
    .map(
      (item) => `
        <li>
          <button
            class="highlight-button"
            type="button"
            role="tab"
            aria-selected="${item.id === activeId}"
            data-id="${item.id}"
          >
            <span class="highlight-thumb">
              <img
                src="${imageDirectory}${item.thumbnail}"
                alt="${item.name} 하이라이트"
              />
            </span>

            <span class="highlight-name">${item.name}</span>
          </button>
        </li>
      `,
    )
    .join("");
}

/* 카드 개수에 따라 겹치는 간격 계산 */
function updateCardSpacing() {
  const cards = storyStack.querySelectorAll(".story-card");
  const cardCount = cards.length;

  if (cardCount === 0) return;

  if (cardCount === 1) {
    storyStack.style.setProperty("--card-margin", "0px");
    return;
  }

  const containerStyle = window.getComputedStyle(storyStack);

  const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;

  const paddingRight = parseFloat(containerStyle.paddingRight) || 0;

  const containerWidth = storyStack.clientWidth - paddingLeft - paddingRight;

  const cardWidth = cards[0].getBoundingClientRect().width;

  const visibleStep = (containerWidth - cardWidth) / (cardCount - 1);

  const cardMargin = visibleStep - cardWidth;

  storyStack.style.setProperty(
    "--card-margin",
    `${Math.min(cardMargin, -20)}px`,
  );
}

/* 선택한 하이라이트의 스토리 생성 */
function renderStories(id) {
  const selected = highlights.find((item) => item.id === id);

  if (!selected) return;

  if (storyTitle) {
    storyTitle.textContent = selected.name;
  }

  renderTabs(id);

  if (!selected.stories.length) {
    storyStack.innerHTML = '<p class="empty">등록된 스토리가 없습니다.</p>';

    return;
  }

  storyStack.innerHTML = selected.stories
    .map((file, index) => {
      const stackOrder = selected.stories.length - index;

      return `
        <article
          class="story-card"
          tabindex="0"
          style="--stack-order:${stackOrder};"
        >
          <img
            src="${imageDirectory}${file}"
            alt="${selected.name} 스토리 ${index + 1}"
          />
        </article>
      `;
    })
    .join("");

  /* 카드가 화면에 만들어진 다음 간격 계산 */
  requestAnimationFrame(updateCardSpacing);
}

/* 하이라이트 클릭 */
highlightList.addEventListener("click", (event) => {
  const button = event.target.closest(".highlight-button");

  if (!button) return;

  renderStories(button.dataset.id);
});

/* 화면 크기가 바뀌면 카드 간격 재계산 */
window.addEventListener("resize", updateCardSpacing);

/* 처음에는 포케 표시 */
renderStories("poke");
