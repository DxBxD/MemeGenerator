'use strict'

// Constants

// The global touch events constant array
const MAX_KEYWORDS = 5

// Global variables

// The global DOM elements
let gElGallery


//////////////////////////////////////////////////////////////////////


// The onInit function

function onGalleryInit() {
    document.querySelector('.main-editor').style.display = 'none'
    document.querySelector('.meme-gallery').style.display = 'none'
    document.querySelector('.main-gallery').style.display = 'flex'
    gElGallery = document.querySelector('.gallery')
    renderGallery(getImgs())
    renderKeywords()
    let elMainContent = document.querySelector('.main-content')
    let elMemeGallery = document.querySelector('.meme-gallery')
    if (window.getComputedStyle(elMemeGallery).display !== 'none') {
        elMainContent.style.overflow = 'visible'
    } else {
        elMainContent.style.overflow = 'hidden'
    }
}


//////////////////////////////////////////////////////////////////////


// a function for rendering the images to the gallery

function renderGallery(imgs) {
    const strHTMLs = imgs.map(img => 
        `
        <img src="${img.url}" alt="image" onclick="onImageSelect('${img.id}')" title="image">
        `)
    const strHTML = strHTMLs.join('')
    gElGallery.innerHTML = strHTML
}


function onImageSelect(selectedImgId) {
    resetgMeme()
    setImg(selectedImgId)
    onEditorInit()
}


function onSearchKeyword() {
    let keyword = document.querySelector('.gallery-search-input input').value
    keyword = keyword.toLowerCase().trim()
    if (keyword === '' || keyword === ' ') {
        renderGallery(getImgs())
        return
    }

    if (gKeywordSearchCountMap[keyword]) {
        gKeywordSearchCountMap[keyword]++
    } else {
        gKeywordSearchCountMap[keyword] = 1
    }

    const filteredImgs = gImgs.filter(img => img.keywords.some(kw => kw.includes(keyword)))
    renderGallery(filteredImgs)
    renderKeywords()
}


function renderKeywords() {
    var elKeywordsContainer = document.querySelector('.image-keyword-popularity')
    var strHTML = ''
    var keywordEntries = Object.entries(gKeywordSearchCountMap)
  
    function compare(a, b) {
        return b[1] - a[1]
    }
    var sortedKeywords = keywordEntries.sort(compare)
    var topKeywords = sortedKeywords.slice(0, MAX_KEYWORDS)

    var maxCount = sortedKeywords[0][1]
    var minCount = sortedKeywords[sortedKeywords.length-1][1]
    
    var fontSizes = [13, 20, 30, 40]

    for (var i = 0; i < topKeywords.length; i++) {
        var keyword = topKeywords[i][0]
        var count = topKeywords[i][1]
        var percentile = (count - minCount) / (maxCount - minCount)
        var fontSize
        if (percentile >= 0.75) {
            fontSize = fontSizes[3]
        } else if (percentile >= 0.5) {
            fontSize = fontSizes[2]
        } else if (percentile >= 0.25) {
            fontSize = fontSizes[1]
        } else {
            fontSize = fontSizes[0]
        }

        strHTML += `<span style="font-size: ${fontSize}px; margin-right: 5px;" onclick="onKeywordClick('${keyword}')">${keyword}</span>`
    }
    elKeywordsContainer.innerHTML = strHTML
}


function onKeywordClick(keyword) {
    keyword = keyword.toLowerCase().trim()

    if (gKeywordSearchCountMap[keyword]) {
        gKeywordSearchCountMap[keyword]++
    } else {
        gKeywordSearchCountMap[keyword] = 1
    }

    const filteredImgs = gImgs.filter(img => img.keywords.some(kw => kw.includes(keyword)))
    renderGallery(filteredImgs)
    renderKeywords()
}


// a function for generating a random meme
function onCreateRandomMeme() {
    let images = getImgs()

    let randomImg = images[Math.floor(Math.random() * images.length)]

    let numOfLines = Math.random() > 0.5 ? 2 : 1

    let strings = getMemeSentences()
    let lineTexts = []
    for (let i = 0; i < numOfLines; i++) {
        let randomStr = strings[Math.floor(Math.random() * strings.length)]
        lineTexts.push(randomStr)
    }

    let lineSizes = []
    for(let i = 0; i < numOfLines; i++) {
        lineSizes.push(getRandomIntInclusive(21, 38))
    }

    let colors = ["red", "blue", "green", "yellow", "pink", "orange"]
    let lineColors = []
    for (let i = 0; i < numOfLines; i++) {
        let randomColor = colors[Math.floor(Math.random() * colors.length)]
        lineColors.push(randomColor)
    }

    resetgMeme()
    setImg(randomImg.id)

    for (let i = 0; i < numOfLines; i++) {
        let newLine = {
            text: lineTexts[i],
            'text-align': 'center',
            'font-size': lineSizes[i],
            'font-family': 'impact',
            'text-underline': false,
            color: lineColors[i],
            'canvas-x-pos': 0,
            'canvas-y-pos': 0,
            width: 0,
            height: 0,
            moved: false,
            cursorPos: 0
        }
        gMeme.lines.push(newLine)
        gMeme.random = true
    }
    onEditorInit()
}