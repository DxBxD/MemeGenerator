'use strict'

// Constants

// The storage key for the local storage DBs
const STORAGE_KEY_IMGS = 'meme-imgs-DB'
const STORAGE_KEY_MEMES = 'meme-DB'

// The random meme sentences array
const MEME_SENTENCES = [
    "Why so serious?",
    "I can has cheezburger?",
    "One does not simply walk into Mordor.",
    "That's a paddlin'.",
    "Ain't nobody got time for that.",
    "Keep calm and carry on.",
    "So much room for activities!",
    "You shall not pass!",
    "I immediately regret this decision.",
    "This is fine.",
    "To the moon!",
    "Here's Johnny!",
    "Deal with it.",
    "It's a trap!",
    "All your base are belong to us."
]

// The meme images directory local URLs
const SQUARE_IMGS_DIR = './meme-imgs (square)/'
const RECT_IMGS_DIR = './meme-imgs (various aspect ratios)/'


// Global variables

// The global memes and images arrays
let gImgs = []
let gMemes = [{"selectedImgId":6,"selectedLineIdx":1,"lines":[{"text":"The buttons don't align center?","text-align":"center","font-size":27,"font-family":"impact","text-underline":false,"color":"#ffffff","canvas-x-pos":27.25732421875,"canvas-y-pos":22.5,"width":353.4853515625,"height":37,"moved":true,"cursorPos":0},{"text":"ALIENS","text-align":"center","font-size":57,"font-family":"impact","text-underline":false,"color":"#ffffff","canvas-x-pos":118.4638671875,"canvas-y-pos":305.5,"width":161.072265625,"height":67,"moved":true,"cursorPos":0}],"isCursorOn":false,"saved":true},{"selectedImgId":10,"selectedLineIdx":0,"lines":[{"text":"פשוטי","text-align":"center","font-size":63,"font-family":"arial","text-underline":false,"color":"#ffffff","canvas-x-pos":123.802490234375,"canvas-y-pos":326.5,"width":156.39501953125,"height":73,"moved":true,"cursorPos":0}],"isCursorOn":false,"saved":true},{"selectedImgId":7,"selectedLineIdx":0,"lines":[{"text":"נחמדדדדדדד","text-align":"center","font-size":57,"font-family":"arial","text-underline":false,"color":"#ffffff","canvas-x-pos":55.35498046875,"canvas-y-pos":307.5,"width":301.2900390625,"height":67,"moved":true,"cursorPos":0}],"isCursorOn":true,"saved":true},{"selectedImgId":12,"selectedLineIdx":2,"lines":[{"text":"console.log או Debugger","text-align":"center","font-size":33,"font-family":"arial","text-underline":false,"color":"#ffffff","canvas-x-pos":20.529296875,"canvas-y-pos":25.5,"width":366.94140625,"height":43,"moved":true,"cursorPos":0},{"text":"מה אתם","text-align":"center","font-size":45,"font-family":"arial","text-underline":false,"color":"#ffffff","canvas-x-pos":123.083984375,"canvas-y-pos":279.5,"width":157.83203125,"height":55,"moved":true,"cursorPos":0},{"text":"הייתם עושים","text-align":"center","font-size":45,"font-family":"arial","text-underline":false,"color":"#ffffff","canvas-x-pos":86.08203125,"canvas-y-pos":336.5,"width":231.8359375,"height":55,"moved":true,"cursorPos":0}],"isCursorOn":false,"saved":true}]
let gId = 1

// The global meme object
let gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [],
    isCursorOn: false,
    random: false,
    saved: false
}

// The global keywords search count map object
let gKeywordSearchCountMap = { 'Trump': 6, 'LMAO': 14, 'kid': 8, 'dog': 10, 'cat': 3, 'success': 2 }


//////////////////////////////////////////////////////////////////////


_createImgs()


// a CRUDL function for creating a meme image
function _createImg(url, keywords) {
    return {
        id: gId++,
        url,
        keywords: structuredClone(keywords)
    }
}


// a CRUDL function for creating and saving the meme images
function _createImgs() {
    let imgs = loadFromLocalStorage(STORAGE_KEY_IMGS)
    if (!imgs || !imgs.length) {
        imgs = []
            imgs.push(_createImg(SQUARE_IMGS_DIR + 1 + '.jpg', ['funny', 'meme', 'trump', 'angry' , 'right']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 2 + '.jpg', ['funny', 'meme', 'dogs']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 3 + '.jpg', ['funny', 'meme', 'dogs', 'kid']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 4 + '.jpg', ['funny', 'meme', 'cat', 'sleep']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 5 + '.jpg', ['funny', 'meme', 'kid', 'success']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 6 + '.jpg', ['funny', 'meme', 'aliens']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 7 + '.jpg', ['funny', 'meme', 'kid']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 8 + '.jpg', ['funny', 'meme']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 9 + '.jpg', ['funny', 'meme', 'kid', 'lmao']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 10 + '.jpg', ['funny', 'meme', 'funny']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 11 + '.jpg', ['funny', 'meme']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 12 + '.jpg', ['funny', 'meme']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 13 + '.jpg', ['funny', 'meme']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 14 + '.jpg', ['funny', 'meme']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 15 + '.jpg', ['funny', 'meme']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 16 + '.jpg', ['funny', 'meme', 'lmao']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 17 + '.jpg', ['funny', 'meme']))
            imgs.push(_createImg(SQUARE_IMGS_DIR + 18 + '.jpg', ['funny', 'meme']))
    }
    gImgs = imgs
    _saveImgsToStorage()
}


// a function for handling the loading of the current memes from local storage
function loadMemes() {
    let memes = loadFromLocalStorage(STORAGE_KEY_MEMES)
    if (memes) {
        gMemes = memes
        return
    }
    _saveMemesToStorage()
}


// a service function for saving memes
function saveMeme() {
    gMeme.saved = true
    gMemes.push(structuredClone(gMeme))
    _saveMemesToStorage()
}


// a function for setting a meme for editing
function setMeme(memeIdx) {
    gMeme = gMemes[memeIdx]
}


// a function for getting a meme object with an image url
// to be drawn on the canvas by the controller
function getMeme() {
    return gMeme
}


// a function for getting the memes from the service
function getMemes() {
    return gMemes
}


// a function for resetting the gMeme
function resetgMeme() {
    gMeme = {
        selectedImgId: null,
        selectedLineIdx: 0,
        lines: []
    }
}


// a function for setting a saved meme as the current gMeme
function setgMeme(meme) {
    gMeme = meme
}


// a function for getting the images to be displayed in the gallery
function getImgs() {
    return gImgs
}


// a function for calling the resetgMeme func to reset the gMeme object
// and setting the selected image id in the gMeme object
// before editing a new meme in the meme editor
function setImg(selectedImgId) {
    gMeme.selectedImgId = selectedImgId
}


// a function for getting an image by id, for it
// to be drawn on the canvas by the controller
function getImageById(selectedImgId) {
    const selectedImg = gImgs.find(img => img.id === Number(selectedImgId))
    const selectedImgUrl = selectedImg.url
    return selectedImgUrl
}


// a function for setting the line text of the current generated meme inside
// the gMeme global object
function setLineText(userLineText) {
    const currLine = gMeme.lines[gMeme.selectedLineIdx]
    currLine.text = userLineText
}


// a function for setting the font size of the text line
function setFontSize(direction) {
    switch (direction) {
        case '+':
            if (gMeme.lines[gMeme.selectedLineIdx]['font-size'] >= 102) return
            gMeme.lines[gMeme.selectedLineIdx]['font-size'] += 6
            break
        case '-':
            if (gMeme.lines[gMeme.selectedLineIdx]['font-size'] <= 21) return
            gMeme.lines[gMeme.selectedLineIdx]['font-size'] -= 6
            break
    }
    console.log(gMeme.lines[gMeme.selectedLineIdx]['font-size'])
}


// a function for setting the alignment of the text line on the canvas
function setTextAlignDirection(textAlignDirection) {
    gMeme.lines[gMeme.selectedLineIdx]['text-align'] = textAlignDirection
}


// a function for setting the font family of the text line
function setFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx]['font-family'] = fontFamily
}


// a function for toggle the underline for the text line
function setUnderline() {
    gMeme.lines[gMeme.selectedLineIdx]['text-underline'] = 
    !(gMeme.lines[gMeme.selectedLineIdx]['text-underline'])
}


// a function for setting the color of the text line
function setTextColor(selectedColor) {
    gMeme.lines[gMeme.selectedLineIdx].color = selectedColor
}


// a function for getting the prepared meme sentences for the random meme button
function getMemeSentences() {
    return MEME_SENTENCES
}


// a function for saving the global meme image array into the local storage
function _saveImgsToStorage() {
    saveToLocalStorage(STORAGE_KEY_IMGS, gImgs)
}


// a function for saving the memes in the local storage
function _saveMemesToStorage() {
    saveToLocalStorage(STORAGE_KEY_MEMES, gMemes)
}