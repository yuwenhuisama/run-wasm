import * as React from 'react'
import Script from 'next/script'
// import GithubButton from './GithubButton'
import Navbar from './Navbar'
import { Editor } from '@run-wasm/run-wasm'
import Select from 'react-select'
import { useTheme } from 'next-themes'

interface Props {
  defaultLanguage?: string
  initialCodeMap: Map<string, string>
  onRunCode(inputCode: string): Promise<string | void>
  languageLabel: string
  isLoading?: boolean
  children?: React.ReactNode
  hideOutputEditor?: boolean
}

export default function CodeRunnerUI(props: Props) {
  const {
    initialCodeMap,
    languageLabel,
    hideOutputEditor,
    isLoading = false,
    defaultLanguage,
    children,
    onRunCode,
  } = props

  const selections = []

  initialCodeMap.forEach((v, k, m) => selections.push({ label: k, value: k }))

  const [output, setOutput] = React.useState('')
  const [selection, setSelection] = React.useState(selections[0])
  const [code, setCode] = React.useState(initialCodeMap.get(selection.value))
  const { theme, setTheme } = useTheme()
  const [canvasHidden, setCanvasHidden] = React.useState(true)

  const handleSelectionChanged = (selection) => {
    setSelection(selection)
    setCode(initialCodeMap.get(selection.value))
    if (selection.value == 'Writing' || selection.value == 'Circles') {
      setCanvasHidden(false)
    } else {
      setCanvasHidden(true)
    }
  }

  async function runCode(code: string) {
    const output = await onRunCode(code)
    if (output) {
      setOutput(output)
    }
  }

  const customStylesLight = {
    control: (base, state) => ({
      ...base,
      background: '#FFFFFF',
      // match with the menu
      borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
      // Overwrittes the different states of border
      // borderColor: state.isFocused ? "yellow" : "green",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  }

  const customStylesDark = {
    control: (base, state) => ({
      ...base,
      background: '#222222',
      // match with the menu
      borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
      // Overwrittes the different states of border
      // borderColor: state.isFocused ? "yellow" : "green",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
    }),
    menu: (base) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
      background: '#222',
    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
      background: '#222',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#aaa',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? '#444'
        : isFocused
        ? '#333'
        : undefined,
      color: isDisabled ? '#ccc' : '#bbb',
      cursor: isDisabled ? 'not-allowed' : 'default',
    }),
  }

  return (
    <>
      <Navbar current={languageLabel} />
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Script
            src="https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js"
            strategy="beforeInteractive"
          />
          <main className="mx-auto mb-12 max-w-7xl sm:mt-12">
            <div className="text-left">
              <h1 className="text-3xl tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-5xl">
                <span className="block font-mono xl:inline">
                  Execute code in Edge Code Playground.
                </span>
              </h1>
              <p className="max-w-md mt-4 text-base text-gray-500 dark:text-gray-450 md:mx-auto sm:text-lg md:mt-16 md:text-xl md:max-w-3xl">
                <b>Edge Code Playground</b> is a place where you can execute
                code based on WASM runtime in <b>Edge</b> browser. <br />
                <br /> It allows you to run interactive code in the browser.
              </p>
              {/* <GithubButton /> */}
            </div>
          </main>
        </div>

        {!canvasHidden ? (
          <canvas
            id="canvas"
            width={canvasHidden ? 0 : 800}
            height={canvasHidden ? 0 : 500}
          >
            Your browser does not support the Canvas API. Please upgrade your
            browser.
          </canvas>
        ) : null}

        <div>
          <div style={{ padding: '5px 0px 15px 0px' }}>
            <label
              style={{
                color: 'rgba(107, 114, 128)',
                fontSize: '.875rem',
                fontWeight: 600,
              }}
            >
              Select a script to execute:
            </label>
          </div>
          <div style={{ padding: '0px 0px 15px 0px' }}>
            <Select
              value={selection}
              onChange={handleSelectionChanged}
              options={selections}
              styles={theme == 'dark' ? customStylesDark : customStylesLight}
            />
          </div>
        </div>

        <Editor
          initialCode={code}
          output={output}
          languageLabel={languageLabel}
          hideOutputEditor={hideOutputEditor}
          isLoading={isLoading}
          defaultLanguage={defaultLanguage}
          onRunCode={runCode}
          onCodeChanged={setCode}
        >
          {children}
        </Editor>
      </div>
    </>
  )
}
