// Base JavaScript
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

imageWidth = Math.round(windowWidth * 0.66);
letimageHeight = Math.round(windowHeight * 0.4);

function init() {
    console.log("Page has loaded and init() is called.");
    updateWindowSize();
}

function updateWindowSize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    imageWidth = Math.round(windowWidth * 0.66);
    imageHeight = Math.round(windowHeight * 0.4);
    imageWidthSmall = Math.round(imageWidth / 2);
    imageHeightSmall = Math.round(imageHeight / 2);

    updateImageSize('image_main_viewer', imageWidth, imageHeight);
    updateImageSize('image1_viewer', imageWidthSmall, imageHeightSmall);
    updateImageSize('image2_viewer', imageWidthSmall, imageHeightSmall);
    updateImageSize('image3_viewer', imageWidthSmall, imageHeightSmall);
    updateImageSize('image4_viewer', imageWidthSmall, imageHeightSmall);

}

function updateImageSize(id, width, height) {
    let instance = document.getElementById(id);
    instance.width = width;
    instance.height = height;
}

window.addEventListener('resize', updateWindowSize);
