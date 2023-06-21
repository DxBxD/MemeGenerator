'use strict'

function saveToLocalStorage(key, value) {
    const json = JSON.stringify(value)
    localStorage.setItem(key, json)
}

function loadFromLocalStorage(key) {
    const json = localStorage.getItem(key)
    return JSON.parse(json)
}

function cleanLocalStorage(key) {
    localStorage.removeItem(key)
}

function makeId(length = 6) {
    let txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}