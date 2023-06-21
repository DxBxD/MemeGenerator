'use strict'

// Constants

// The global touch events constant array


// Global variables

// The global DOM elements
let gElGallery


//////////////////////////////////////////////////////////////////////


// The onInit function

function onGalleryInit() {
    document.querySelector('.main-editor').classList.add('hidden-element')
    document.querySelector('.main-gallery').classList.remove('hidden-element')
    gElGallery = document.querySelector('.gallery')
    renderGallery()
}


//////////////////////////////////////////////////////////////////////


// a function for rendering the images to the gallery

function renderGallery() {
    const imgs = getImgs()
    const strHTMLs = imgs.map(img => 
        `
         <img src="${img.url}" alt="image" onclick="onImageSelect('${img.id}')">
        `)
    const strHTML = strHTMLs.join('')
    gElGallery.innerHTML = strHTML
}


function onImageSelect(selectedImgId) {
    setImg(selectedImgId)
    onEditorInit()
}