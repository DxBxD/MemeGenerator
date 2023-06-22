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
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: []
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


function resetgMeme() {
    gMeme = {
        selectedImgId: null,
        selectedLineIdx: 0,
        lines: []
    }
}


// a function for getting the images to be displayed in the gallery
function getImgs() {
    return gImgs
}


// a function for calling the resetgMeme func to reset the gMeme object
// and setting the selected image id in the gMeme object
// before editing a new meme in the meme editor
function setImg(selectedImgId) {
    resetgMeme()
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


function setFontSize(direction) {
    switch (direction) {
        case '+':
            if (gMeme.lines[gMeme.selectedLineIdx]['font-size'] >= 102) return
            gMeme.lines[gMeme.selectedLineIdx]['font-size'] += 6
            break
        case '-':
            if (gMeme.lines[gMeme.selectedLineIdx]['font-size'] <= 27) return
            gMeme.lines[gMeme.selectedLineIdx]['font-size'] -= 6
            break
    }
    console.log(gMeme.lines[gMeme.selectedLineIdx]['font-size'])
}


function setTextAlignDirection(textAlignDirection) {
    gMeme.lines[gMeme.selectedLineIdx]['text-align'] = textAlignDirection
}


function setFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx]['font-family'] = fontFamily
}


function setUnderline() {
    gMeme.lines[gMeme.selectedLineIdx]['text-underline'] = 
    !(gMeme.lines[gMeme.selectedLineIdx]['text-underline'])
}


function setTextColor(selectedColor) {
    gMeme.lines[gMeme.selectedLineIdx].color = selectedColor
}


// a function for saving the global meme image array into the local storage
function _saveImgsToStorage() {
    saveToLocalStorage(STORAGE_KEY, gImgs)
}