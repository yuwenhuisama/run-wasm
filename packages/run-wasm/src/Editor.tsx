/* eslint-disable */

import * as React from 'react'
import MonacoEditor, { Monaco } from '@monaco-editor/react'
import { addKeyBinding, CustomKeyBinding } from '../utils'

interface Props {
  initialCode: string
  output: string
  languageLabel: string
  hideOutputEditor?: boolean
  isLoading?: boolean
  defaultLanguage?: string
  onRunCode(inputCode: string): Promise<string | void>
  children?: React.ReactNode
  onCodeChanged(code: string): void
}

export default function Editor(props: Props) {
  const {
    initialCode,
    output,
    languageLabel,
    hideOutputEditor,
    isLoading = false,
    defaultLanguage,
    onRunCode,
    children,
    onCodeChanged,
  } = props

  const editorRef = React.useRef(null)

  const [monaco, setMonaco] = React.useState<Monaco | null>(null)

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    editorRef.current = editor
    setMonaco(monaco)
  }

  React.useEffect(() => {
    if (!monaco || isLoading) {
      return
    }
    const runCodeBinding: CustomKeyBinding = {
      label: 'run',
      keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      callback: () => onRunCode(initialCode),
      editor: editorRef.current,
    }
    return addKeyBinding(runCodeBinding)
  }, [monaco, isLoading])

  return (
    <>
      <div>
        <div>
          <label
            style={{
              color: 'rgba(107, 114, 128)',
              fontSize: '.875rem',
              fontWeight: 600,
            }}
          >
            {languageLabel}
          </label>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ borderRadius: '0.5rem', overflow: 'hidden' }}>
              <MonacoEditor
                height="20rem"
                defaultLanguage={defaultLanguage}
                defaultValue={initialCode}
                onChange={(value) => {
                  onCodeChanged(value || '')
                }}
                value={initialCode}
                theme="vs-dark"
                options={{
                  fontSize: 12,
                  minimap: { enabled: false },
                  padding: { top: 16 },
                }}
                onMount={handleEditorDidMount}
              />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem 0' }}>
        <button
          onClick={() => onRunCode(initialCode)}
          disabled={isLoading}
          style={{
            borderRadius: '.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem 1.75rem',
            lineHeight: 1,
            backgroundColor: 'black',
          }}
        >
          <span style={{ color: 'rgba(243,244,246' }}>
            {!isLoading ? 'Run Code →' : `Loading ${languageLabel}...`}
          </span>
        </button>
      </div>

      {children}

      {!hideOutputEditor && (
        <div>
          <label
            style={{
              color: 'rgba(107, 114, 128)',
              fontSize: '.875rem',
              fontWeight: 600,
            }}
          >
            Output
          </label>

          <div
            style={{
              marginTop: '1rem',
              borderRadius: '0.5rem',
              overflow: 'hidden',
            }}
          >
            <MonacoEditor
              value={output?.toString()}
              height="20rem"
              defaultLanguage="python"
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 12,
                minimap: { enabled: false },
                padding: { top: 16 },
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
