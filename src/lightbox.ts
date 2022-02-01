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

window.addEventListener("load", () => {
  lightBox_init();
});

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

  loadCss("/wp-content/themes/canassure/css/lightBox.css");

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

function createSlider(slides: NodeListOf<Element>) {
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
    const slides_selctor = lightBox.getAttribute("data-slides");
    const slides = lightBox.querySelectorAll(
      slides_selctor || _toClass(LightBoxSelectors.slide)
    );

    const slider = createSlider(slides);

    const container_slider = getLightBoxContainerSlider();

    const container = getLightBoxContainer();
    //replace the lightbox with the slider
    container.replaceChild(slider, container_slider);
    toggleLightBox();
  }
  // add event listerner to element to open lightbox
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
  const next_button = container.querySelector(LightBoxSelectors.next);
  const previous_button = container.querySelector(LightBoxSelectors.prev);
  const close_button = container.querySelector(LightBoxSelectors.close);
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
