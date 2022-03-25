import React, { useEffect, useState, useRef } from 'react'
import { createTSClient } from '@run-wasm/ts'
import Script, { initScriptLoader } from 'next/script'
import CodeRunnerUI from '../components/CodeRunnerUI'

declare global {
  interface Window {
    ts: any
  }
}

const tsScript = 'https://unpkg.com/typescript@latest/lib/typescriptServices.js'
const initialCode = `// TypeScript code goes here
let a: number;
let b: number;
a = 12;
b = 3;
console.log(a + b);`

const snakeCode = `
const mycanvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = mycanvas.getContext("2d");

//创建一个数组
const circleArr = [];

//圆形类
class Circle {
  x: number
  y: number
  r: number
  dx: number
  dy: number
  color: string

  constructor(x: number, y: number, r: number, ) {
    this.x = x;
    this.y = y;
    this.r = r;
    // 颜色的取值范围
    this.color = "rgb("+ (Math.random() * 240 ) + 9 + ","+ (Math.random() * 220 +18) +",203)";

    //随机方向
    this.dx = Math.random() * 12 - 7;
    this.dy = Math.random() * 12 - 7;
    //往数组中push自己
    circleArr.push(this);
  }

  render() {
    //新建一条路径
    ctx.beginPath();
    //创建一个圆
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
    //设置样式颜色
    ctx.fillStyle = this.color;
    //通过填充路径的内容区域生成实心的图形
    ctx.fill();
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
    this.r--;
    if(this.r < 0){
      for (var i = 0; i < circleArr.length; i++) {
        if (circleArr[i] === this) {
            circleArr.splice(i,1);
        };
      }
      return false;
    }
    return true;
  }
}

//鼠标移动事件
mycanvas.onmousemove = (event) => {
  new Circle(event.offsetX, event.offsetY, 30);
}

//设置定时器每20毫秒更新和渲染
setInterval(() => {
  ctx.clearRect(0, 0, 800, 500)
  for (let i = 0; i < circleArr.length; i++) {
      circleArr[i].update() && circleArr[i].render();
  };
},20);
`

const initialCodeMap = new Map<string, string>([
  ['Initial Code', initialCode],
  ['Circles', snakeCode],
  ['Costume Code', ''],
])

function App() {
  const [errors, setErrors] = useState<Array<string>>([])
  const [tsClient, setTsClient] = useState<any>(null)

  function initialiseTsClient() {
    const tsClient = createTSClient(window.ts)
    tsClient.fetchLibs(['es5', 'dom']).then(() => {
      setTsClient(tsClient)
    })
  }

  useEffect(() => {
    // handle client side navigation whenever that comes
    if (typeof window.ts === 'undefined') {
      initScriptLoader([
        {
          src: tsScript,
          onLoad: initialiseTsClient,
        },
      ])
    } else {
      initialiseTsClient()
    }
  }, [])

  async function runCode(code: string) {
    const { errors, output } = await tsClient.run({ code })
    setErrors(errors)
    return output
  }

  return (
    <>
      <Script strategy="beforeInteractive" src={tsScript} />
      <Script src="https://kit.fontawesome.com/137d63e13e.js" />
      <CodeRunnerUI
        initialCodeMap={initialCodeMap}
        languageLabel="TypeScript"
        defaultLanguage="typescript"
        onRunCode={runCode}
        isLoading={!tsClient}
      >
        {errors.length > 0 && (
          <div>
            <label className="block pt-8 text-sm font-medium text-gray-700 dark:text-gray-450">
              Errors
            </label>
            {errors.map((error, index) => (
              <div key={index} className="mt-1">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ))}
          </div>
        )}
      </CodeRunnerUI>
    </>
  )
}

export default App
