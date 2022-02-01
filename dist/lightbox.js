var LightBoxSelectors = {
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
function lightBox_init(props) {
    var selector = LightBoxSelectors.root;
    var lightBoxes = document.querySelectorAll(selector);
    setUpContainer();
    lightBoxes.forEach(function (lightBox) {
        setUpLightBox(lightBox);
    });
}
function getClassFromSelector(selector) {
    return selector.replace(/\./g, " ").trim();
}
function setUpContainer() {
    var _toClass = getClassFromSelector;
    var container = document.createElement("div");
    container.classList.add(_toClass(LightBoxSelectors.container));
    container.classList.add("hidden");
    container.innerHTML = "\n        <button class=\" " + _toClass(LightBoxSelectors.close) + "\">\n            <span class=\"lightbox-close-icon\">&times;</span>\n        </button>\n        <button class=\"" + _toClass(LightBoxSelectors.arrow) + " " + _toClass(LightBoxSelectors.prev) + "\">\n            <span class=\"lightbox-previous-icon\">&#10094;</span>\n        </button>\n        <button class=\"" + _toClass(LightBoxSelectors.arrow) + " " + _toClass(LightBoxSelectors.next) + "\">\n            <span class=\"lightbox-next-icon\">&#10095;</span>\n        </button>\n        <div class=\"" + _toClass(LightBoxSelectors.slides) + "\">\n            </div>\n    ";
    document.body.appendChild(container);
    addInlineCss();
    setUp_container_event_listeners(container);
}
function getLightBoxContainer() {
    var container = document.querySelector(".lightbox-container");
    if (!container) {
        setUpContainer();
    }
    return document.querySelector(".lightbox-container");
}
function toggleLightBox() {
    var container = getLightBoxContainer();
    if (container.classList.contains("hidden")) {
        openLightBox();
    }
    else {
        closeLightBox();
    }
    container.classList.toggle("hidden");
}
function createSlider(slides) {
    var _toClass = getClassFromSelector;
    var slider = document.createElement("div");
    slider.classList.add(_toClass(LightBoxSelectors.slides));
    slides.forEach(function (slide, index) {
        var slide_wrapper = document.createElement("div");
        slide_wrapper.classList.add(_toClass(LightBoxSelectors.slide_wrapper));
        if (index === 0) {
            slide_wrapper.classList.add(_toClass(LightBoxSelectors.currentSlide));
        }
        var clonedSlide = slide.cloneNode(true);
        slide_wrapper.appendChild(clonedSlide);
        slider.appendChild(slide_wrapper);
    });
    return slider;
}
function setUpLightBox(lightBox) {
    var _toClass = getClassFromSelector;
    lightBox.setAttribute("tabindex", "0");
    function loadLightBox() {
        //clone all direct children of lightbox
        var slides_selector = lightBox.getAttribute("data-slides");
        var slides = slides_selector
            ? lightBox.querySelectorAll(slides_selector || _toClass(LightBoxSelectors.slide))
            : Array.from(lightBox.children);
        var slider = createSlider(slides);
        var container_slider = getLightBoxContainerSlider();
        var container = getLightBoxContainer();
        container.replaceChild(slider, container_slider);
        toggleLightBox();
    }
    // add event listener to element to open lightbox
    lightBox.addEventListener("click", loadLightBox);
    lightBox.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            loadLightBox();
        }
    });
}
function getLightBoxContainerSlider() {
    var container = getLightBoxContainer();
    var slider = container.querySelector(LightBoxSelectors.slides);
    if (!slider) {
        var slider_1 = document.createElement("div");
        slider_1.classList.add(getClassFromSelector(LightBoxSelectors.slides));
        container.appendChild(slider_1);
    }
    return slider;
}
function loadCss(path) {
    //create a link tag
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", path);
    //append to head
    document.head.appendChild(link);
}
function addInlineCss() {
    var style = document.createElement("style");
    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(style);
    style.innerHTML = "\n    .lightbox-container {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        background: rgba(0, 0, 0, 0.8);\n        z-index: 999900000000000;\n        animation: fade-in 0.5s;\n      }\n      .lightbox-container > button {\n        background: none;\n        border: none;\n      }\n      .lightbox-container .lightbox-close {\n        position: absolute;\n        top: 10px;\n        right: 10px;\n        font-size: 3em;\n        cursor: pointer;\n      }\n      .lightbox-container .lightbox-close, .lightbox-container lightbox-arrow {\n        color: #fff;\n        font-size: 3em;\n      }\n      .lightbox-container .lightbox-arrow {\n        position: absolute;\n        top: 50%;\n        margin-top: -25px;\n        cursor: pointer;\n        font-size: 3em;\n        color: white;\n        display: flex;\n        justify-content: center;\n      }\n      .lightbox-container .lightbox-prev {\n        left: 10px;\n      }\n      .lightbox-container .lightbox-next {\n        right: 10px;\n      }\n      .lightbox-container .lightbox-slides {\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n        overflow: auto;\n        max-width: 80vw;\n        max-height: 80vh;\n      }\n      .lightbox-container .lightbox-slides .lightbox-slide-wrapper {\n        justify-content: center;\n        display: flex;\n        max-height: 80vh;\n        background-size: cover;\n        background-position: center;\n        background-repeat: no-repeat;\n        transition: all 0.5s;\n        opacity: 0;\n        z-index: -1;\n      }\n      .lightbox-container .lightbox-slides .lightbox-slide-wrapper img {\n        width: 100%;\n        height: auto;\n        object-fit: contain;\n        max-height: 100%;\n      }\n      .lightbox-container .lightbox-slides .lightbox-slide-wrapper.active {\n        opacity: 1;\n        z-index: 1;\n      }\n    ";
}
function hide_all(elements) {
    elements.forEach(function (element) {
        element.classList.add("hidden");
    });
}
function show_element(element) {
    element.classList.remove("hidden");
}
function slide(dir) {
    var slides = getSlides();
    var currentSlide = getLightBoxElement("currentSlide");
    var currentSlideIndex = slides.indexOf(currentSlide);
    var nextSlideIndex = currentSlideIndex + dir;
    if (nextSlideIndex < 0) {
        nextSlideIndex = slides.length - 1;
    }
    if (nextSlideIndex > slides.length - 1) {
        nextSlideIndex = 0;
    }
    var nextSlide = slides[nextSlideIndex];
    var active_class = getClassFromSelector(LightBoxSelectors.currentSlide);
    hide_all(slides);
    if (nextSlide) {
        currentSlide.classList.remove(active_class);
        show_element(nextSlide);
        nextSlide.classList.add(active_class);
    }
}
function setUp_container_event_listeners(container) {
    var next_button = getLightBoxElement("next");
    var previous_button = getLightBoxElement("prev");
    var close_button = getLightBoxElement("close");
    close_button.addEventListener("click", function () {
        toggleLightBox();
    });
    next_button.addEventListener("click", function () {
        slide(1);
    });
    previous_button.addEventListener("click", function () {
        slide(-1);
    });
    container.addEventListener("keydown", function (e) {
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
    container.addEventListener("click", function (e) {
        var target = e.target;
        if (target === container) {
            toggleLightBox();
        }
    });
}
function openLightBox() {
    //focus on lightbox
    var close_button = getLightBoxContainer().querySelector(LightBoxSelectors.close);
    setTimeout(function () {
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
    var slides = getSlides();
    var next_button = getLightBoxElement("next");
    var previous_button = getLightBoxElement("prev");
    if (slides.length === 1) {
        next_button.style.display = "none";
        previous_button.style.display = "none";
    }
    else {
        next_button.style.display = "";
        previous_button.style.display = "";
    }
}
function getLightBoxElement(el) {
    var container = getLightBoxContainer();
    var dom_el = container.querySelector(LightBoxSelectors[el]);
    if (!dom_el) {
        throw new Error(el + " not found in lightbox");
    }
    return dom_el;
}
function getSlides() {
    var container = getLightBoxContainer();
    var slides = container.querySelectorAll(LightBoxSelectors.slide_wrapper);
    return Array.from(slides);
}
function closeLightBox() {
    allow_scroll();
    restore_focus();
    document.dispatchEvent(new Event("lightbox_closed"));
}
function prevent_scroll() {
    var body = document.querySelector("body");
    body.style.overflow = "hidden";
}
function allow_scroll() {
    var body = document.querySelector("body");
    body.style.overflow = "";
}
function prevent_losing_focus() {
    var all_focusable_elements_outside_lightbox = getAllFocusAbleElementsOutSideLightBox();
    all_focusable_elements_outside_lightbox.forEach(function (el) {
        var prevIndex = el.getAttribute("tabindex");
        if (prevIndex) {
            el.setAttribute("data-prev-tabindex", prevIndex);
        }
        el.setAttribute("tabindex", "-1");
    });
}
function getAllFocusAbleElementsOutSideLightBox() {
    var all_focusable_elements = document.querySelectorAll("a, button, input, select, textarea, [tabindex]");
    var all_focusable_elements_outside_lightbox = Array.from(all_focusable_elements).filter(function (el) {
        return !getLightBoxContainer().contains(el);
    });
    return all_focusable_elements_outside_lightbox;
}
function restore_focus() {
    var all_focusable_elements_outside_lightbox = getAllFocusAbleElementsOutSideLightBox();
    all_focusable_elements_outside_lightbox.forEach(function (el) {
        var prevIndex = el.getAttribute("data-prev-tabindex");
        if (prevIndex) {
            el.setAttribute("tabindex", prevIndex);
            el.removeAttribute("data-prev-tabindex");
        }
        else {
            el.removeAttribute("tabindex");
        }
    });
}
window.addEventListener("load", function () {
    lightBox_init();
});
//# sourceMappingURL=lightbox.js.map