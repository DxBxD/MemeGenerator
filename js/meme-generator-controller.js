'use strict'

// Constants

// The global touch events constant array
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']


// Global variables

// The global DOM elements
let gElCanvas
let gCtx
let gElEditorForm


//////////////////////////////////////////////////////////////////////


// The onInit function

function onInit() {
    gElCanvas = document.querySelector('#meme-canvas')
    gCtx = gElCanvas.getContext('2d')
    gElEditorForm = document.querySelector('#meme-editor')
    addListeners()
    resizeCanvas()
    
    renderMeme()
}


//////////////////////////////////////////////////////////////////////


// a function for rendering a meme image and text
function renderMeme() {
    const meme = getMeme()
    const memeText = meme.lines[0].text
    const memeImg = getImageById(meme.selectedImgId)
    let img = new Image()
    img.onload = function () {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText(memeText)
    }
    img.src = memeImg
}


// a function for rendering text
function drawText(text) {
    const x = gElCanvas.width / 2
    const y = gElCanvas.height / 10

    gCtx.lineWidth = 3
    gCtx.font = '20px Impact'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.strokeStyle = 'black'
    gCtx.strokeText(text, x, y)

    gCtx.fillStyle = 'white'
    gCtx.fillText(text, x, y)
}


// a function for getting the line text and sending it to the controller
// to be changed, then rendering the meme
function onSetLineText(ev) {
    ev.preventDefault()
    const text = gElEditorForm.elements['line-text'].value
    setLineText(text)
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
    // gElCanvas.addEventListener('mousedown', onDown)
    // gElCanvas.addEventListener('mousemove', onMove)
    // gElCanvas.addEventListener('mouseup', onUp)
}

// a function for adding touch event listeners
function addTouchListeners() {
    // gElCanvas.addEventListener('touchstart', onDown)
    // gElCanvas.addEventListener('touchmove', onMove)
    // gElCanvas.addEventListener('touchend', onUp)
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


// a function that is triggered when a file is selected in the input element
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
    onClearCanvas()
}


// a function for clearing the canvas by painting it white
function onClearCanvas() {
    gCtx.fillStyle = 'white'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}