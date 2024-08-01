// Base JavaScript
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

imageWidthValue = 0.66
imageHeightValue = 0.39

imageWidth = Math.round(windowWidth * imageWidthValue);
letimageHeight = Math.round(windowHeight * imageHeightValue);

function init() {
    console.log("Page has loaded and init() is called.");
    updateWindowSize();
}

function updateWindowSize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    imageWidth = Math.round(windowWidth * imageWidthValue);
    imageHeight = Math.round(windowHeight * imageHeightValue);
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
