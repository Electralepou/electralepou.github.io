

document.addEventListener("DOMContentLoaded", () => {

  const IMAGE_ROOT = "images/";   // every gallery image lives under here

  document.querySelectorAll(".gallery-category").forEach((section) => {
    const category = section.dataset.category;        // e.g. "portraits"
    const files = galleryImages[category] || [];      // list from the manifest
    const grid = section.querySelector(".gallery-grid");

    // Friendly note if a category has no images yet.
    if (files.length === 0) {
      grid.innerHTML = '<p class="gallery-empty">No images here yet.</p>';
      return;
    }

    files.forEach((file, index) => {
      const button = document.createElement("button");
      button.type = "button";

      const img = document.createElement("img");
      img.src = IMAGE_ROOT + category + "/" + file;
      img.alt = prettify(file);
      img.loading = "lazy";                           // don't load until near view

      button.appendChild(img);
      // Remember this thumbnail's category + position for the lightbox.
      button.addEventListener("click", () => openLightbox(category, index));
      grid.appendChild(button);
    });
  });

  /* ------------------------------------------------------------------
     2. THE LIGHTBOX
     ------------------------------------------------------------------ */
  const lightbox  = document.getElementById("lightbox");
  const lbImage   = document.getElementById("lb-image");
  const lbCounter = document.getElementById("lb-counter");

  // What's currently being viewed:
  let activeList  = [];   // the filenames in the open category
  let activeCat   = "";   // that category name (used to build the folder path)
  let activeIndex = 0;    // which image in the list is on screen

  function openLightbox(category, index) {
    activeCat   = category;
    activeList  = galleryImages[category];
    activeIndex = index;
    showImage();
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";   // freeze the page behind it
  }

  function showImage() {
    const file = activeList[activeIndex];
    lbImage.src = IMAGE_ROOT + activeCat + "/" + file;
    lbImage.alt = prettify(file);
    lbCounter.textContent = (activeIndex + 1) + " / " + activeList.length;
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";         // let the page scroll again
  }

  // Move forward (+1) or back (-1); wraps around at the ends.
  function step(direction) {
    const count = activeList.length;
    activeIndex = (activeIndex + direction + count) % count;
    showImage();
  }

  // Buttons inside the lightbox.
  lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lb-prev").addEventListener("click", () => step(-1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => step(1));

  // Click the dark backdrop (but not the image itself) to close.
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard shortcuts — only while the lightbox is open.
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ------------------------------------------------------------------
     Helper: turn "my-new-drawing.jpg" into "my new drawing" so the
     alt text (used by screen readers) reads nicely.
     ------------------------------------------------------------------ */
  function prettify(filename) {
    return filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  }
});
