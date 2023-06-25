'use strict'

// Constants

// The global touch events constant array
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']


// Global variables

// The global DOM elements
let gElCanvas
let gCtx
let gElHiddenCanvas
let gHiddenCtx
let gElEditorForm
let gTextInputBox
let gFontFamily
let gFontSize
let gTextColor
let gTextAlignDirection
let gIsTextUnderline
let gIsDragging
let gIsCustomImage
let gCustomImg
let gIsCanvasBeingSaved
let gIsCanvasFocused
let blinkInterval


//////////////////////////////////////////////////////////////////////


// The onInit functions

function onEditorInit() {
    gElMemeGallery.innerHTML = ''
    document.querySelector('.main-gallery').style.display = 'none'
    document.querySelector('.meme-gallery').style.display = 'none'
    document.querySelector('.main-editor').style.display = 'grid'
    gElCanvas = document.querySelector('#meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gElHiddenCanvas = document.querySelector('#hidden-canvas')
    gHiddenCtx = gElHiddenCanvas.getContext('2d')
    gElEditorForm = document.querySelector('#meme-editor')
    gTextInputBox = document.querySelector('.text-input')
    gFontSize = 35
    gTextAlignDirection = 'center'
    gFontFamily = 'impact'
    gIsTextUnderline = false
    gTextColor = '#ffffff'
    gIsDragging = false
    gIsCustomImage = false
    gIsCanvasBeingSaved = false
    gIsCanvasFocused = false
    addListeners()
    resizeCanvas()
    if (!getMeme().saved && !getMeme().random) onAddLine()
    blinkInterval = setInterval(function() {
        getMeme().isCursorOn = !getMeme().isCursorOn
        renderMeme()
    }, 500)
}


//////////////////////////////////////////////////////////////////////


// a function for rendering a meme image and text on both hidden and shown canvas
// hidden canvas is used for saving the memes without the markings and editing
// information showing above
function renderMeme() {
    const meme = getMeme()
    let img = new Image()
    img.onload = function () {
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        gHiddenCtx.clearRect(0, 0, gElHiddenCanvas.width, gElHiddenCanvas.height)
        gHiddenCtx.drawImage(img, 0, 0, gElHiddenCanvas.width, gElHiddenCanvas.height)
        drawText(gCtx, true)
        drawText(gHiddenCtx, false)
    }
    if (gIsCustomImage && gCustomImg) {
        img.src = gCustomImg.src
    } else {
        const memeImg = getImageById(meme.selectedImgId)
        img.src = memeImg
    }
}

// a function for drawing the text lines on the canvas above the image
function drawText(ctx, drawRectangle) {
    for(let i = 0; i < getMeme().lines.length; i++) {
        let line = getMeme().lines[i]
        ctx.lineWidth = 4
        ctx.font = `${line['font-size']}px ${line['font-family']}`
        ctx.textAlign = line['text-align']
        ctx.textBaseline = 'middle'

        let x, y
        if (line.moved) {
            switch (line['text-align']) {
                case 'center':
                    x = line['canvas-x-pos'] + line.width / 2
                    break
                case 'left':
                    x = line['canvas-x-pos']
                    break
                case 'right':
                    x = line['canvas-x-pos'] + line.width
                    break
            }
            y = line['canvas-y-pos'] + line['font-size'] / 2 + 5
        } else {
            x = gElCanvas.width / 2
            y = (gElCanvas.height / (getMeme().lines.length+1)) * (i + 1)
        }

        let textMeasure
        if (drawRectangle && i === getMeme().selectedLineIdx && Number(line['font-size']) < 27) {
            textMeasure = ctx.measureText(line.text + '/..')
        } else if (drawRectangle && i === getMeme().selectedLineIdx && Number(line['font-size']) < 37) {
            textMeasure = ctx.measureText(line.text + '/.')
        } else if (drawRectangle && i === getMeme().selectedLineIdx) {
            textMeasure = ctx.measureText(line.text + '/')
        } else {
            textMeasure = ctx.measureText(line.text)
        }

        let rectX, rectWidth
        switch (line['text-align']) {
            case 'center':
                rectX = x - textMeasure.width / 2 - 5
                rectWidth = textMeasure.width + 10
                break
            case 'left':
                rectX = x
                rectWidth = textMeasure.width + 5
                break
            case 'right':
                rectX = x - textMeasure.width
                rectWidth = textMeasure.width + 5
                break
        }
        
        line['canvas-x-pos'] = rectX
        line['canvas-y-pos'] = y - line['font-size'] / 2 - 5
        line.width = rectWidth
        line.height = line['font-size'] + 10

        ctx.strokeStyle = 'black'
        ctx.strokeText(line.text, x, y)
        ctx.fillStyle = line.color
        ctx.fillText(line.text, x, y)

        if (line['text-underline']) {
            let underlineThickness = 0.5
            let underlineYPos = y + (line['font-size'] / 2) + underlineThickness
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 2
            ctx.fillRect(rectX, underlineYPos, rectWidth, underlineThickness + 4)
            ctx.strokeRect(rectX, underlineYPos, rectWidth, underlineThickness + 4)
        }

        if (drawRectangle && i === getMeme().selectedLineIdx && getMeme().isCursorOn && gIsCanvasFocused) {
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 5
            ctx.strokeText('│', x + textMeasure.width / 2 - 3, y - 3)
            ctx.fillStyle = 'white'
            ctx.fillText('│', x + textMeasure.width / 2 - 3, y - 3)
        } 

        if (drawRectangle && i === getMeme().selectedLineIdx) {

            ctx.beginPath()
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 1.5
            ctx.rect(rectX, y - line['font-size'] / 2 - 5, rectWidth, line['font-size'] + 10)
            ctx.stroke()
        }
    }
}


// a function for switching between text lines
function onSwitchLine() {
    getMeme().selectedLineIdx++
    if (getMeme().selectedLineIdx >= getMeme().lines.length) {
        getMeme().selectedLineIdx = 0
    }
    gTextInputBox.value = getMeme().lines[getMeme().selectedLineIdx].text
    renderMeme()
}


// a function for adding a new text line
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
        height: 0,
        moved: false,
        cursorPos: 0
    }
    getMeme().lines.push(newLine)
    getMeme().selectedLineIdx = getMeme().lines.length - 1
    gTextInputBox.value = getMeme().lines[getMeme().selectedLineIdx].text
    renderMeme()
}


// a function for deleting the current the selected text line
function onDeleteLine() {
    if (getMeme().lines.length > 1) {
        getMeme().lines.splice(getMeme().selectedLineIdx, 1)
        getMeme().selectedLineIdx--
        if (getMeme().selectedLineIdx < 0) getMeme().selectedLineIdx = 0
        gTextInputBox.value = getMeme().lines[getMeme().selectedLineIdx].text
    } else if (getMeme().lines.length === 1) {
        getMeme().lines.pop()
    } else {
        return
    }
    renderMeme()
}


// a function for getting the line text and sending it to the service
// to be changed, then rendering the meme
function onSetLineText(text) {
    setLineText(text)
    renderMeme()
}


// a function for calling the service function for changing the font size of the text line
function onFontSizeChange(direction) {
    setFontSize(direction)
    renderMeme()
}


// a function for calling the service function for changing the text line alignment
function onTextAlignChange(textAlignDirection) {
    setTextAlignDirection(textAlignDirection)
    renderMeme()
}


// a function for calling the service function for changing the text line font family
function onFontFamilyChange(fontFamily) {
    setFontFamily(fontFamily)
    renderMeme()
}


// a function for calling the service function for toggling the underline for the text line
function onAddUnderline() {
    setUnderline()
    renderMeme()
}


// a function for calling the service function for changing the text color of the text line
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
    gElCanvas.addEventListener('click', function() {
        gIsCanvasFocused = true
    })
    document.querySelector('.text-input').addEventListener('focus', function() {
        gIsCanvasFocused = false
    })
    document.querySelector('.text-input').addEventListener('blur', function() {
        gIsCanvasFocused = false
    })
    window.addEventListener('keydown', onKeyDown)
    document.querySelector('.nav-item').addEventListener('click', clearInterval(blinkInterval))
}


// a function for adding mouse event listeners
function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

// a function for adding touch event listeners
function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}


// a function for handling mouse down events
function onDown(ev) {
    const pos = getEvPos(ev)
    for(let i = 0; i < getMeme().lines.length; i++) {
        let line = getMeme().lines[i]
        if(pos.x > line['canvas-x-pos'] && pos.x < line['canvas-x-pos'] + line.width && 
            pos.y > line['canvas-y-pos'] && pos.y < line['canvas-y-pos'] + line.height) {
            getMeme().selectedLineIdx = i
            gTextInputBox.value = line.text
            renderMeme()
            gIsDragging = true
            break
        }
    }
}


// a function for handling mouse move events
function onMove(ev) {
    if (gIsDragging) {
        const pos = getEvPos(ev)
        let line = getMeme().lines[getMeme().selectedLineIdx]

        switch (line['text-align']) {
            case 'center':
                line['canvas-x-pos'] = pos.x - line.width / 2
                break
            case 'left':
                line['canvas-x-pos'] = pos.x
                break
            case 'right':
                line['canvas-x-pos'] = pos.x - line.width
                break
        }

        line['canvas-y-pos'] = pos.y - line.height / 2
        getMeme().lines[getMeme().selectedLineIdx].moved = true
        renderMeme()
    }
}


// a function for handling mouse up events
function onUp() {
    gIsDragging = false
}


// a function for handling key down events
function onKeyDown(ev) {
    if (getMeme().selectedLineIdx === null || !gIsCanvasFocused) return
    if (ev.key === ' ') ev.preventDefault()
    if (ev.key === 'Backspace') {
        getMeme().lines[getMeme().selectedLineIdx].text = getMeme().lines[getMeme().selectedLineIdx].text.slice(0, -1)
    } else if (ev.key === 'Enter') {
        onAddLine()
    } else if (ev.key.length === 1 || ev.key === ' ') {
        getMeme().lines[getMeme().selectedLineIdx].text += ev.key
    }
    gTextInputBox.value = getMeme().lines[getMeme().selectedLineIdx].text
    renderMeme()
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
    let data = gElHiddenCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-meme'
}


// a function for saving a meme
function onSaveMeme() {
    saveMeme()
}


// a function that is triggered when a file is selected in the input element,
// It loads the image file into the canvas
function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
    gIsCustomImage = true
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
    gCustomImg = img
    resetgMeme()
    onAddLine()
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    gHiddenCtx.drawImage(img, 0, 0, gElHiddenCanvas.width, gElHiddenCanvas.height)
}


// a function for uploading the image currently drawn on the canvas
function onUploadImg() {
    const imgDataUrl = gElHiddenCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }

    doUploadImg(imgDataUrl, onSuccess)
}


// a function that sends the image data to a server
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

    // Setting the dimensions of the hidden canvas to match the visible canvas
    gElHiddenCanvas.width = gElCanvas.width
    gElHiddenCanvas.height = gElCanvas.height

    renderMeme()
}


// a function for clearing the canvas by painting it white
function onClearCanvas() {
    gCtx.fillStyle = 'white'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}