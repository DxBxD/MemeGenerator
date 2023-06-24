'use strict'

// Constants
const gElMemeGallery = document.querySelector('.meme-gallery')

// The onInit function

function onMemeGalleryInit() {
    loadMemes()
    document.querySelector('.main-editor').style.display = 'none'
    document.querySelector('.main-gallery').style.display = 'none'
    document.querySelector('.meme-gallery').style.display = 'flex'
    renderSavedMemes()
    window.addEventListener('resize', () => {
        resizeCanvases()
        renderSavedMemes()
    })
}


// a function for rendering the memes to the gallery

function renderSavedMemes() {
    let savedMemes = getMemes()
    const canvasHTMLs = savedMemes.map((meme, index) =>
        `
        <div class="canvas-container"><canvas class="saved-canvas" id="meme-${index}" width="500" height="500" onclick="onMemeSelect(${index})"></canvas></div>
        `
    )

    gElMemeGallery.innerHTML = canvasHTMLs.join('')
    resizeCanvases()
    
    savedMemes.forEach((meme, index) => {
        let memeCanvas = document.getElementById(`meme-${index}`)
        let memeCtx = memeCanvas.getContext('2d')

        let img = new Image()
        img.onload = function () {
            memeCtx.clearRect(0, 0, memeCanvas.width, memeCanvas.height)
            memeCtx.drawImage(img, 0, 0, memeCanvas.width, memeCanvas.height)

            gMeme = meme

            drawSavedText(memeCtx, false)
        }

        img.src = getImageById(meme.selectedImgId)
    })
}


// a function for selecting a saved meme for editing
function onMemeSelect(selectedMemeIdx) {
    resetgMeme()
    gMeme = getMemes()[Number(selectedMemeIdx)]
    onEditorInit()
}


// a function for resizing the saved meme presentation canvases
function resizeCanvases() {
    const elContainer = document.querySelector('.canvas-container')
    const gElCanvases = document.querySelectorAll('.saved-canvas')
    
    gElCanvases.forEach(canvas => {
        canvas.width = elContainer.offsetWidth
        canvas.height = elContainer.offsetHeight
    })
}


// a function for drawing the text lines on the canvas above the image
function drawSavedText(ctx, drawRectangle) {
    const gElCanvases = document.querySelectorAll('.saved-canvas')
    for(let i = 0; i < gMeme.lines.length; i++) {
        let line = gMeme.lines[i]
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
            x = gElCanvases[0].width / 2
            y = (gElCanvases[0].height / (gMeme.lines.length+1)) * (i + 1)
        }

        let textMeasure
        if (drawRectangle && i === gMeme.selectedLineIdx && Number(line['font-size']) < 27) {
            textMeasure = ctx.measureText(line.text + '/..')
        } else if (drawRectangle && i === gMeme.selectedLineIdx && Number(line['font-size']) < 37) {
            textMeasure = ctx.measureText(line.text + '/.')
        } else if (drawRectangle && i === gMeme.selectedLineIdx) {
            textMeasure = ctx.measureText(line.text + '/')
        } else {
            textMeasure = ctx.measureText(line.text)
        }

        ctx.strokeStyle = 'black'
        ctx.strokeText(line.text, x, y)
        ctx.fillStyle = line.color
        ctx.fillText(line.text, x, y)

        if (line['text-underline']) {
            let underlineThickness = 0.5
            let underlineYPos = y + (line['font-size'] / 2) + underlineThickness
            ctx.strokeStyle = 'black'
            ctx.fillRect(rectX, underlineYPos, rectWidth, underlineThickness + 4)
            ctx.strokeRect(rectX, underlineYPos, rectWidth, underlineThickness + 4)
        }
    }
}