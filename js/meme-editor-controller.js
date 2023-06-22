'use strict'

// Constants

// The global touch events constant array
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']


// Global variables

// The global DOM elements
let gElCanvas
let gCtx
let gElEditorForm
let gTextInputBox
let gFontFamily
let gFontSize
let gTextColor
let gTextAlignDirection
let gIsTextUnderline


//////////////////////////////////////////////////////////////////////


// The onInit function

function onEditorInit() {
    document.querySelector('.main-gallery').style.display = 'none'
    document.querySelector('.main-editor').style.display = 'grid'
    gElCanvas = document.querySelector('#meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gElEditorForm = document.querySelector('#meme-editor')
    gTextInputBox = document.querySelector('.text-input')
    gFontSize = 35
    gTextAlignDirection = 'center'
    gFontFamily = 'impact'
    gIsTextUnderline = false
    gTextColor = '#ffffff'
    addListeners()
    resizeCanvas()
    onAddLine()
}


//////////////////////////////////////////////////////////////////////


// a function for rendering a meme image and text
function renderMeme() {
    const meme = getMeme()
    const memeImg = getImageById(meme.selectedImgId)
    let img = new Image()
    img.onload = function () {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText()
    }
    img.src = memeImg
}


// a function for rendering the text lines on the canvas
function drawText() {
    for(let i = 0; i < gMeme.lines.length; i++) {
        let line = gMeme.lines[i]
        const x = gElCanvas.width / 2
        const y = (gElCanvas.height / (gMeme.lines.length+1)) * (i+1)

        gCtx.lineWidth = 3
        gCtx.font = `${line['font-size']}px ${line['font-family']}`
        gCtx.textAlign = line['text-align']
        gCtx.textBaseline = 'middle'

        gCtx.strokeStyle = 'black'
        gCtx.strokeText(line.text, x, y)

        gCtx.fillStyle = line.color
        gCtx.fillText(line.text, x, y)

        let textMeasure = gCtx.measureText(line.text)
            let rectX, rectWidth
            switch (line['text-align']) {
                case 'center':
                    rectX = x - textMeasure.width / 2 - 5
                    rectWidth = textMeasure.width + 10
                    break
                case 'left':
                    rectX = x - 5
                    rectWidth = textMeasure.width + 5
                    break
                case 'right':
                    rectX = x - textMeasure.width - 5
                    rectWidth = textMeasure.width + 5
                    break
            }            

        line['canvas-x-pos'] = rectX
        line['canvas-y-pos'] = y - line['font-size'] / 2 - 5
        line.width = rectWidth
        line.height = line['font-size'] + 10

        // Drawing a rectangle around the selected line
        if (i === gMeme.selectedLineIdx) {
            gCtx.beginPath()
            gCtx.lineWidth = 2
            gCtx.rect(rectX, y - line['font-size'] / 2 - 5, rectWidth, line['font-size'] + 10)
            gCtx.stroke()
        }
    }
}


function onSwitchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) {
        gMeme.selectedLineIdx = 0
    }
    gTextInputBox.value = gMeme.lines[gMeme.selectedLineIdx].text
    renderMeme()
}


function onAddLine() {
    let newLine = {
        text: 'Your text',
        'text-align': 'center',
        'font-size': 45,
        'font-family': 'impact',
        'text-underline': false,
        color: '#ffffff',
        'canvas-x-pos': 0,
        'canvas-y-pos': 0,
        width: 0,
        height: 0
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    gTextInputBox.value = gMeme.lines[gMeme.selectedLineIdx].text
    renderMeme()
}


function onDeleteLine() {
    if (gMeme.lines.length > 1) {
        gMeme.lines.splice(gMeme.selectedLineIdx, 1)
        gMeme.selectedLineIdx--
        if (gMeme.selectedLineIdx < 0) gMeme.selectedLineIdx = 0
        gTextInputBox.value = gMeme.lines[gMeme.selectedLineIdx].text
        renderMeme()
    }
}


// a function for getting the line text and sending it to the service
// to be changed, then rendering the meme
function onSetLineText(text) {
    setLineText(text)
    renderMeme()
}


function onFontSizeChange(direction) {
    setFontSize(direction)
    renderMeme()
}


function onTextAlignChange(textAlignDirection) {
    setTextAlignDirection(textAlignDirection)
    renderMeme()
}


function onFontFamilyChange(fontFamily) {
    setFontFamily(fontFamily)
    renderMeme()
}


function onAddUnderline() {
    setUnderline()
    // renderMeme()
}


function onTextColorChange(selectedColor) {
    setTextColor(selectedColor)
    renderMeme()
}


// a function for adding window resize, mouse and touch event listeners
function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
    })
}


// a function for adding mouse event listeners
function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    // gElCanvas.addEventListener('mousemove', onMove)
    // gElCanvas.addEventListener('mouseup', onUp)
}

// a function for adding touch event listeners
function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    // gElCanvas.addEventListener('touchmove', onMove)
    // gElCanvas.addEventListener('touchend', onUp)
}


function onDown(ev) {
    const pos = getEvPos(ev)
    for(let i = 0; i < gMeme.lines.length; i++) {
        let line = gMeme.lines[i]
        if(pos.x > line['canvas-x-pos'] && pos.x < line['canvas-x-pos'] + line.width && 
            pos.y > line['canvas-y-pos'] && pos.y < line['canvas-y-pos'] + line.height) {
            console.log(line['canvas-x-pos'])
            gMeme.selectedLineIdx = i
            gTextInputBox.value = line.text
            renderMeme()
            break
        }
    }
}


// a function for getting a mouse\touch event position
function getEvPos(ev) {

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()

        ev = ev.changedTouches[0]

        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}


// a function for downloading the meme as an image
function onDownloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-meme'
}


// a function that is triggered when a file is selected in the input element,
// It loads the image file into the canvas
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}


// a function for reading the image file from the input event and calling the 
// provided callback function when the image has loaded
function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = function (event) {
        let img = new Image()
        img.src = event.target.result
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0])
}


// a function for drawing the provided image on the canvas
function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}


// a function for uploading the image currently drawn on the canvas
function onUploadImg() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }

    doUploadImg(imgDataUrl, onSuccess)
}


// a function that sends a request to a server with the image data to upload
// and calls the provided callback function when successful
function doUploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR

        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}


// a function that adjusts the size of the canvas to fit its container every time the window is resized
function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
    renderMeme()
}


// a function for clearing the canvas by painting it white
function onClearCanvas() {
    gCtx.fillStyle = 'white'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}