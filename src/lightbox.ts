type LightBoxProps = {
  data_selector: string;
};

const LightBoxSelectors = {
  container: ".lightbox-container",
  close: ".lightbox-close",
  slides: ".lightbox-slides",
  slide: ".lightbox-slide",
  next: ".lightbox-next",
  arrow: ".lightbox-arrow",
  prev: ".lightbox-prev",
  root: ".lightbox-root",
  slide_wrapper: ".lightbox-slide-wrapper",
  currentSlide: ".active",
};

function lightBox_init(props?: LightBoxProps) {
  const selector = LightBoxSelectors.root;
  const lightBoxes = document.querySelectorAll(selector);
  setUpContainer();
  lightBoxes.forEach((lightBox) => {
    setUpLightBox(lightBox);
  });
}

function getClassFromSelector(selector: string) {
  return selector.replace(/\./g, " ").trim();
}

function setUpContainer() {
  const _toClass = getClassFromSelector;
  const container = document.createElement("div");
  container.classList.add(_toClass(LightBoxSelectors.container));
  container.classList.add("hidden");
  container.innerHTML = `
        <button class=" ${_toClass(LightBoxSelectors.close)}">
            <span class="lightbox-close-icon">&times;</span>
        </button>
        <button class="${_toClass(LightBoxSelectors.arrow)} ${_toClass(
    LightBoxSelectors.prev
  )}">
            <span class="lightbox-previous-icon">&#10094;</span>
        </button>
        <button class="${_toClass(LightBoxSelectors.arrow)} ${_toClass(
    LightBoxSelectors.next
  )}">
            <span class="lightbox-next-icon">&#10095;</span>
        </button>
        <div class="${_toClass(LightBoxSelectors.slides)}">
            </div>
    `;
  document.body.appendChild(container);

  addInlineCss();

  setUp_container_event_listeners(container);
}

function getLightBoxContainer() {
  const container = document.querySelector(".lightbox-container");
  if (!container) {
    setUpContainer();
  }
  return document.querySelector(".lightbox-container");
}
function toggleLightBox() {
  const container = getLightBoxContainer();
  if (container.classList.contains("hidden")) {
    openLightBox();
  } else {
    closeLightBox();
  }
  container.classList.toggle("hidden");
}

function createSlider(slides: NodeListOf<Element> | Element[]) {
  const _toClass = getClassFromSelector;
  const slider = document.createElement("div");
  slider.classList.add(_toClass(LightBoxSelectors.slides));
  slides.forEach((slide, index) => {
    const slide_wrapper = document.createElement("div");
    slide_wrapper.classList.add(_toClass(LightBoxSelectors.slide_wrapper));
    if (index === 0) {
      slide_wrapper.classList.add(_toClass(LightBoxSelectors.currentSlide));
    }
    const clonedSlide = slide.cloneNode(true);
    slide_wrapper.appendChild(clonedSlide);
    slider.appendChild(slide_wrapper);
  });

  return slider;
}
function setUpLightBox(lightBox: Element) {
  const _toClass = getClassFromSelector;
  lightBox.setAttribute("tabindex", "0");

  function loadLightBox() {
    //clone all direct children of lightbox
    const slides_selector = lightBox.getAttribute("data-slides");

    const slides = slides_selector
      ? lightBox.querySelectorAll(
          slides_selector || _toClass(LightBoxSelectors.slide)
        )
      : Array.from(lightBox.children);

    const slider = createSlider(slides);

    const container_slider = getLightBoxContainerSlider();

    const container = getLightBoxContainer();

    container.replaceChild(slider, container_slider);

    toggleLightBox();
  }
  // add event listener to element to open lightbox
  lightBox.addEventListener("click", loadLightBox);
  lightBox.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      loadLightBox();
    }
  });
}

function getLightBoxContainerSlider() {
  const container = getLightBoxContainer();
  const slider = container.querySelector(LightBoxSelectors.slides);
  if (!slider) {
    const slider = document.createElement("div");
    slider.classList.add(getClassFromSelector(LightBoxSelectors.slides));
    container.appendChild(slider);
  }
  return slider;
}

function loadCss(path: string) {
  //create a link tag
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", path);
  //append to head
  document.head.appendChild(link);
}

function addInlineCss() {
  const style = document.createElement("style");
  const head = document.head || document.getElementsByTagName("head")[0];
  head.appendChild(style);
  style.innerHTML = `
    .lightbox-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 999900000000000;
        animation: fade-in 0.5s;
      }
      .lightbox-container > button {
        background: none;
        border: none;
      }
      .lightbox-container .lightbox-close {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 3em;
        cursor: pointer;
      }
      .lightbox-container .lightbox-close, .lightbox-container lightbox-arrow {
        color: #fff;
        font-size: 3em;
      }
      .lightbox-container .lightbox-arrow {
        position: absolute;
        top: 50%;
        margin-top: -25px;
        cursor: pointer;
        font-size: 3em;
        color: white;
        display: flex;
        justify-content: center;
      }
      .lightbox-container .lightbox-prev {
        left: 10px;
      }
      .lightbox-container .lightbox-next {
        right: 10px;
      }
      .lightbox-container .lightbox-slides {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: auto;
        max-width: 80vw;
        max-height: 80vh;
      }
      .lightbox-container .lightbox-slides .lightbox-slide-wrapper {
        justify-content: center;
        display: flex;
        max-height: 80vh;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transition: all 0.5s;
        opacity: 0;
        z-index: -1;
      }
      .lightbox-container .lightbox-slides .lightbox-slide-wrapper img {
        width: 100%;
        height: auto;
        object-fit: contain;
        max-height: 100%;
      }
      .lightbox-container .lightbox-slides .lightbox-slide-wrapper.active {
        opacity: 1;
        z-index: 1;
      }
    `;
}

function hide_all(elements: Array<HTMLElement>) {
  elements.forEach((element) => {
    element.classList.add("hidden");
  });
}
function show_element(element: HTMLElement) {
  element.classList.remove("hidden");
}

function slide(dir: 1 | -1) {
  const slides = getSlides();

  const currentSlide = getLightBoxElement<HTMLDivElement>("currentSlide");
  const currentSlideIndex = slides.indexOf(currentSlide);
  let nextSlideIndex = currentSlideIndex + dir;
  if (nextSlideIndex < 0) {
    nextSlideIndex = slides.length - 1;
  }
  if (nextSlideIndex > slides.length - 1) {
    nextSlideIndex = 0;
  }
  const nextSlide = slides[nextSlideIndex];
  const active_class = getClassFromSelector(LightBoxSelectors.currentSlide);
  hide_all(slides);
  if (nextSlide) {
    currentSlide.classList.remove(active_class);
    show_element(nextSlide);
    nextSlide.classList.add(active_class);
  }
}

function setUp_container_event_listeners(container: HTMLDivElement) {
  const next_button = getLightBoxElement<HTMLButtonElement>("next");
  const previous_button = getLightBoxElement<HTMLButtonElement>("prev");
  const close_button = getLightBoxElement<HTMLButtonElement>("close");

  close_button.addEventListener("click", () => {
    toggleLightBox();
  });
  next_button.addEventListener("click", () => {
    slide(1);
  });
  previous_button.addEventListener("click", () => {
    slide(-1);
  });

  container.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      slide(1);
    }
    if (e.key === "ArrowLeft") {
      slide(-1);
    }
    if (e.key === "Escape") {
      toggleLightBox();
    }
  });

  container.addEventListener("click", (e) => {
    let target = e.target as HTMLElement;
    if (target === container) {
      toggleLightBox();
    }
  });
}

function openLightBox() {
  //focus on lightbox
  const close_button: HTMLElement = getLightBoxContainer().querySelector(
    LightBoxSelectors.close
  );
  setTimeout(() => {
    close_button.focus();
  }, 10);

  check_arrows();
  prevent_scroll();
  prevent_losing_focus();
  slide(1);
  document.dispatchEvent(new Event("lightbox_opened"));
}

function check_arrows() {
  //hide arrows if there is only one slide
  const slides = getSlides();
  const next_button = getLightBoxElement<HTMLButtonElement>("next");
  const previous_button = getLightBoxElement<HTMLButtonElement>("prev");
  if (slides.length === 1) {
    next_button.style.display = "none";
    previous_button.style.display = "none";
  } else {
    next_button.style.display = "";
    previous_button.style.display = "";
  }
}

function getLightBoxElement<T extends Element>(
  el: keyof typeof LightBoxSelectors
) {
  const container = getLightBoxContainer();
  const dom_el = container.querySelector(LightBoxSelectors[el]) as T | null;
  if (!dom_el) {
    throw new Error(`${el} not found in lightbox`);
  }
  return dom_el as T;
}

function getSlides(): HTMLDivElement[] {
  const container = getLightBoxContainer();
  const slides = container.querySelectorAll(LightBoxSelectors.slide_wrapper);
  return Array.from(slides) as HTMLDivElement[];
}

function closeLightBox() {
  allow_scroll();
  restore_focus();
  document.dispatchEvent(new Event("lightbox_closed"));
}

function prevent_scroll() {
  const body = document.querySelector("body");
  body.style.overflow = "hidden";
}

function allow_scroll() {
  const body = document.querySelector("body");
  body.style.overflow = "";
}

function prevent_losing_focus() {
  const all_focusable_elements_outside_lightbox =
    getAllFocusAbleElementsOutSideLightBox();
  all_focusable_elements_outside_lightbox.forEach((el) => {
    let prevIndex = el.getAttribute("tabindex");
    if (prevIndex) {
      el.setAttribute("data-prev-tabindex", prevIndex);
    }
    el.setAttribute("tabindex", "-1");
  });
}

function getAllFocusAbleElementsOutSideLightBox() {
  const all_focusable_elements = document.querySelectorAll(
    "a, button, input, select, textarea, [tabindex]"
  );
  const all_focusable_elements_outside_lightbox = Array.from(
    all_focusable_elements
  ).filter((el) => {
    return !getLightBoxContainer().contains(el);
  });
  return all_focusable_elements_outside_lightbox;
}

function restore_focus() {
  const all_focusable_elements_outside_lightbox =
    getAllFocusAbleElementsOutSideLightBox();
  all_focusable_elements_outside_lightbox.forEach((el) => {
    let prevIndex = el.getAttribute("data-prev-tabindex");
    if (prevIndex) {
      el.setAttribute("tabindex", prevIndex);
      el.removeAttribute("data-prev-tabindex");
    } else {
      el.removeAttribute("tabindex");
    }
  });
}

window.addEventListener("load", () => {
  lightBox_init();
});
