import React, { useEffect, useState, useRef } from 'react'
import { createPythonClient } from '@run-wasm/python'
import Script from 'next/script'
import CodeRunnerUI from '../components/CodeRunnerUI'

declare global {
  // <- [reference](https://stackoverflow.com/a/56458070/11542903)
  interface Window {
    pyodide: any
    languagePluginLoader: any
    loadPyodide: Function
  }
}

const findPrimesCode = `# Implementation of the Sieve of Eratosthenes
# https://stackoverflow.com/questions/3939660/sieve-of-eratosthenes-finding-primes-python

# Finds all prime numbers up to n
def eratosthenes(n):
    multiples = []
    for i in range(2, n+1):
        if i not in multiples:
            print (i)
            for j in range(i*i, n+1, i):
                multiples.append(j)

eratosthenes(100)`

const writingCode = `
from js import document
canvas = document.getElementById('canvas')
canvas.setAttribute('width', 800)
canvas.setAttribute('height', 500)
context = canvas.getContext("2d")
context.strokeStyle = "#df4b26"
context.lineJoin = "round"
context.lineWidth = 8
pen = False
lastPoint = (0, 0)

def onmousemove(e):
  global lastPoint
  if pen:
    newPoint = (e.offsetX, e.offsetY)
    context.beginPath()
    context.moveTo(lastPoint[0], lastPoint[1])
    context.lineTo(newPoint[0], newPoint[1])
    context.closePath()
    context.stroke()
    lastPoint = newPoint
    
def onmousedown(e):
  global pen, lastPoint
  pen = True
  lastPoint = (e.offsetX, e.offsetY)
  
def onmouseup(e):
  global pen
  pen = False

canvas.addEventListener('mousemove', onmousemove)
canvas.addEventListener('mousedown', onmousedown)
canvas.addEventListener('mouseup', onmouseup)
`

const initialCodeMap = new Map<string, string>([
  ['Find Primes', findPrimesCode],
  ['Writing', writingCode],
  ['Costume Code', ''],
])

function App() {
  const [pyodide, setPyodide] = useState(null)

  async function runCode(code: string) {
    let pythonClient = createPythonClient(pyodide)
    return await pythonClient.run({ code })
  }

  // Note that window.loadPyodide comes from the beforeInteractive pyodide.js Script
  useEffect(() => {
    window
      .loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/',
      })
      .then((pyodide) => {
        setPyodide(pyodide)
      })
  }, [])

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <CodeRunnerUI
        initialCodeMap={initialCodeMap}
        onRunCode={runCode}
        languageLabel="Python"
        isLoading={!pyodide}
        defaultLanguage="python"
      />
    </>
  )
}

export default App
