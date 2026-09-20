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

const cardNewsPosts = window.CARD_NEWS_POSTS || [];

const feedGrid = document.querySelector("#feedGrid");
const feedTabs = document.querySelectorAll(".feed-tab");

const postModal = document.querySelector("#postModal");
const modalImage = document.querySelector("#modalImage");
const modalVideo = document.querySelector("#modalVideo");
const modalMedia = document.querySelector(".modal-media");
const modalTitle = document.querySelector("#modalTitle");
const slidePrev = document.querySelector("#slidePrev");
const slideNext = document.querySelector("#slideNext");
const slideCount = document.querySelector("#slideCount");
const modalEyebrow = document.querySelector("#modalEyebrow");
const modalPurpose = document.querySelector("#modalPurpose");
const modalRole = document.querySelector("#modalRole");
const modalDescription = document.querySelector("#modalDescription");

let activePost = null;
let activeSlideIndex = 0;

/* 피드 썸네일 출력 */

function renderFeed(filter = "card") {
  const filteredPosts = cardNewsPosts.filter(
    (post) => post.category === filter,
  );

  feedGrid.innerHTML = filteredPosts
    .map((post) => {
      const isClickable = ["card", "video"].includes(post.category);

      if (isClickable) {
        return `
          <button
            class="feed-card"
            type="button"
            data-post-id="${post.id}"
            aria-label="${post.title} 게시물 열기"
          >
            <img
              src="${imageDirectory}${post.thumbnail}"
              alt="${post.title}"
            />
          </button>
        `;
      }

      return `
        <div class="feed-card is-static">
          <img
            src="${imageDirectory}${post.thumbnail}"
            alt="${post.title}"
          />
        </div>
      `;
    })
    .join("");
}
function getPostSlides(post) {
  const contentSlides = post.slides || post.images || [];
  /* 영상 탭은 썸네일을 제외하고 실제 콘텐츠부터 표시 */
  if (post.category === "video") {
    return contentSlides;
  }
  return [
    {
      type: "image",
      src: post.thumbnail,
    },
    ...contentSlides,
  ];
}

/* 팝업 이미지 변경 */

function updateModalSlide() {
  if (!activePost) return;

  const slides = getPostSlides(activePost);
  const currentSlide = slides[activeSlideIndex];

  /* 이전 영상 재생 중지 */
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();

  if (currentSlide.type === "video") {
    modalImage.hidden = true;
    modalVideo.hidden = false;

    modalVideo.src = `${imageDirectory}${currentSlide.src}`;

    modalVideo.load();
  } else {
    modalVideo.hidden = true;
    modalImage.hidden = false;

    modalImage.src = `${imageDirectory}${currentSlide.src}`;

    modalImage.alt = `${activePost.title} ${activeSlideIndex + 1}번째 이미지`;
  }

  slideCount.textContent = `${activeSlideIndex + 1} / ${slides.length}`;

  slidePrev.disabled = activeSlideIndex === 0;

  slideNext.disabled = activeSlideIndex === slides.length - 1;
}

function positionModalInViewport() {
  let currentWindow = window;
  let totalFrameTop = 0;

  try {
    /*
      현재 iframe부터 최상위 페이지까지 올라가며
      각 iframe의 화면상 위치를 모두 더함
    */
    while (currentWindow !== currentWindow.top && currentWindow.frameElement) {
      const frameRect = currentWindow.frameElement.getBoundingClientRect();

      totalFrameTop += frameRect.top;
      currentWindow = currentWindow.parent;
    }

    /*
      사용자가 실제로 보고 있는 최상위 화면의 중앙을
      현재 iframe 내부 좌표로 변환
    */
    const topViewportCenter = currentWindow.innerHeight / 2;

    const centerInsideIframe = topViewportCenter - totalFrameTop;

    postModal.style.setProperty("--modal-top", `${centerInsideIframe}px`);
  } catch (error) {
    /*
      iframe 접근이 불가능할 경우 현재 창을 기준으로 처리
    */
    const fallbackCenter = window.scrollY + window.innerHeight / 2;

    postModal.style.setProperty("--modal-top", `${fallbackCenter}px`);
  }
}
/* 팝업 열기 */

function openPostModal(postId) {
  activePost = cardNewsPosts.find((post) => post.id === postId);

  if (!activePost) return;

  /* 게시물 카테고리에 따라 팝업 비율 설정 */
  modalMedia.classList.remove("is-card", "is-video");

  if (activePost.category === "video") {
    modalMedia.classList.add("is-video");
  } else {
    modalMedia.classList.add("is-card");
  }

  activeSlideIndex = 0;

  modalEyebrow.textContent = activePost.eyebrow || "";
  modalTitle.textContent = activePost.title || "";
  modalPurpose.textContent = activePost.purpose || "";
  modalRole.textContent = activePost.role || "";

  modalDescription.innerHTML = "";

  (activePost.description || []).forEach((paragraph) => {
    const paragraphElement = document.createElement("p");

    paragraphElement.textContent = paragraph;
    modalDescription.appendChild(paragraphElement);
  });
  positionModalInViewport();
  updateModalSlide();

  postModal.classList.add("is-open");
  postModal.setAttribute("aria-hidden", "false");
}

/* 팝업 닫기 */

function closePostModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();

  postModal.classList.remove("is-open");
  postModal.setAttribute("aria-hidden", "true");

  activePost = null;
  activeSlideIndex = 0;
}

function repositionOpenedModal() {
  if (postModal.classList.contains("is-open")) {
    positionModalInViewport();
  }
}

let currentWindow = window;

try {
  while (currentWindow) {
    currentWindow.addEventListener("scroll", repositionOpenedModal, {
      passive: true,
    });

    currentWindow.addEventListener("resize", repositionOpenedModal);

    if (currentWindow === currentWindow.top) {
      break;
    }

    currentWindow = currentWindow.parent;
  }
} catch (error) {
  window.addEventListener("scroll", repositionOpenedModal, {
    passive: true,
  });

  window.addEventListener("resize", repositionOpenedModal);
}

window.addEventListener("resize", repositionOpenedModal);

if (window.parent !== window) {
  window.parent.addEventListener("scroll", repositionOpenedModal);
  window.parent.addEventListener("resize", repositionOpenedModal);
}

/* 피드 클릭 */

feedGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".feed-card");

  if (!card) return;

  const post = cardNewsPosts.find((item) => item.id === card.dataset.postId);

  if (!post) return;

  /* card와 video 게시물만 팝업 열기 */
  if (!["card", "video"].includes(post.category)) {
    return;
  }

  openPostModal(post.id);
});

/* 상단 탭 클릭 */

feedTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    feedTabs.forEach((item) => {
      item.classList.remove("is-active");
    });

    tab.classList.add("is-active");

    renderFeed(tab.dataset.filter);
  });
});

/* 이전 이미지 */

slidePrev.addEventListener("click", () => {
  if (!activePost || activeSlideIndex === 0) {
    return;
  }

  activeSlideIndex -= 1;
  updateModalSlide();
});

/* 다음 이미지 */

slideNext.addEventListener("click", () => {
  if (!activePost) return;

  const slides = getPostSlides(activePost);

  if (activeSlideIndex >= slides.length - 1) {
    return;
  }

  activeSlideIndex += 1;
  updateModalSlide();
});

/* 닫기 버튼 및 배경 클릭 */

postModal.addEventListener("click", (event) => {
  if (event.target.closest("[data-modal-close]")) {
    closePostModal();
  }
});

/* ESC로 팝업 닫기 */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePostModal();
  }

  if (!postModal.classList.contains("is-open")) {
    return;
  }

  if (event.key === "ArrowLeft") {
    slidePrev.click();
  }

  if (event.key === "ArrowRight") {
    slideNext.click();
  }
});

renderFeed("card");
