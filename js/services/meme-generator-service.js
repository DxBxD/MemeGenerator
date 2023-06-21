'use strict'

// Constants

// The storage key for the local storage DB
const STORAGE_KEY = 'meme-imgs-DB'

// The meme images directory local URLs
const SQUARE_IMGS_DIR = './meme-imgs (square)/'
const RECT_IMGS_DIR = './meme-imgs (various aspect ratios)/'


// Global variables

// The global meme images array
let gImgs = []

// The global meme object
let gMeme = {
    selectedImgId: 'm6sr7E',
    selectedLineIdx: 0,
    lines: [
        {
            text: 'Your Text',
            size: 45,
            color: 'white'
        }
    ]
}

// The global keywords map object
let gKeywordSearchCountMap = { 'funny': 18, 'meme': 18 }


//////////////////////////////////////////////////////////////////////


_createImgs()


// a CRUDL function for creating a meme image
function _createImg(url, keywords) {
    return {
        id: makeId(),
        url,
        keywords: structuredClone(keywords)
    }
}


// a CRUDL function for creating and saving the meme images
function _createImgs() {
    let imgs = loadFromLocalStorage(STORAGE_KEY)
    if (!imgs || !imgs.length) {
        imgs = []
        for (let i = 1; i < 19; i++) {
            imgs.push(_createImg(SQUARE_IMGS_DIR + i + '.jpg', ['funny', 'meme']))
        }
    }
    gImgs = imgs
    _saveImgsToStorage()
}


// a function for getting a meme object with an image url
// to be drawn on the canvas by the controller
function getMeme() {
    return gMeme
}


// a function for getting the images to be displayed in the gallery
function getImgs() {
    return gImgs
}


// a function for setting the selected image id in the gMeme object,
// hiding the gallery and showing the meme editor
function setImg(selectedImgId) {
    gMeme.selectedImgId = selectedImgId
}


// a function for getting an image by id, for it
// to be drawn on the canvas by the controller
function getImageById(selectedImgId) {
    const selectedImg = gImgs.find(img => img.id === selectedImgId)
    const selectedImgUrl = selectedImg.url
    return selectedImgUrl
}


// a function for setting the line text of the current generated meme inside
// the gMeme global object
function setLineText(userLineText) {
    const currLine = gMeme.lines[gMeme.selectedLineIdx]
    currLine.text = userLineText
}


// a function for saving the global meme image array into the local storage
function _saveImgsToStorage() {
    saveToLocalStorage(STORAGE_KEY, gImgs)
}