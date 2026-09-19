/*
  모든 이미지는 images 폴더 한 곳에 저장합니다.

  images/profile-logo.png
  images/poke-thumb.png
  images/poke-01.jpg

  게시물 수가 다르면 stories 배열의 파일명을 추가하거나 삭제하세요.
*/
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

function renderTabs(activeId) {
  highlightList.innerHTML = highlights
    .map(
      (item) => `
    <li>
      <button class="highlight-button" type="button" role="tab"
        aria-selected="${item.id === activeId}" data-id="${item.id}">
        <span class="highlight-thumb">
          <img src="${imageDirectory}${item.thumbnail}" alt="${item.name} 하이라이트" />
        </span>
        <span class="highlight-name">${item.name}</span>
      </button>
    </li>
  `,
    )
    .join("");
}

function renderStories(id) {
  const selected = highlights.find((item) => item.id === id);
  if (!selected) return;

  storyTitle.textContent = selected.name;
  renderTabs(id);

  if (!selected.stories.length) {
    storyStack.innerHTML = '<p class="empty">등록된 스토리가 없습니다.</p>';
    return;
  }

  storyStack.innerHTML = selected.stories
    .map((file, index) => {
      const tilt = ((index % 5) - 2) * 1.25;
      const stackOrder = selected.stories.length - index;

      return `
    <article
      class="story-card"
      tabindex="0"
      style="--tilt:${tilt}deg; --stack-order:${stackOrder};"
      data-number="${index + 1}"
    >
      <img
        src="${imageDirectory}${file}"
        alt="${selected.name} 스토리 ${index + 1}"
      />
    </article>
  `;
    })
    .join("");
}

highlightList.addEventListener("click", (event) => {
  const button = event.target.closest(".highlight-button");
  if (button) renderStories(button.dataset.id);
});

renderStories("poke");
