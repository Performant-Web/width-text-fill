import { ReactNode, useEffect, useState, useRef } from 'react'

export default function WidthTextFill({ children, maxLines }: { children: ReactNode, maxLines: number }) {

  const [fontSize, setFontSize] = useState(0)
  const [isIncreasing, setIsIncreasing] = useState(false)
  const [width, setWidth] = useState(0)

  const spanRef = useRef()
  const parentRef = useRef()

  useEffect(() => {
    function handleResize() {
      const width: number = window.innerWidth
      setWidth(width)
    }
    window.addEventListener("resize", handleResize);
    handleResize()
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const span = spanRef.current
    resizeParent(span)
    fillText(span)
  }, [fontSize, width]);

  function resizeParent(span: HTMLElement) {
    const parent: HTMLElement = parentRef.current
    const lineHeight = getLineHeight(span)
    parent.style.height = `${maxLines * lineHeight}px`
  }

  function fillText(span: HTMLElement) {
    const fontSize = getFontSize(span)
    const lineCount = countLines(span)
    if (lineCount <= maxLines) {
      setIsIncreasing(false)
      updateFontSize(span, fontSize + 1)
      setFontSize(fontSize + 1)
    }
    if (lineCount > maxLines) {
      setIsIncreasing(true)
      updateFontSize(span, fontSize - 1)
      setFontSize(fontSize - 1)
    }
    if ((lineCount == maxLines) && isIncreasing) {
      updateFontSize(span, fontSize)
      setFontSize(fontSize)
    }
  }

  function getFontSize(span: HTMLElement) {
    const fontSize: number = parseInt(window.getComputedStyle(span).getPropertyValue('font-size').replace('px', ''))
    return fontSize
  }

  function countLines(span: HTMLElement) {
    const height: number = span.offsetHeight
    const lineHeight = getLineHeight(span)
    const lineCount: number = Math.round(height / lineHeight)
    return lineCount
  }

  function getLineHeight(span: HTMLElement) {
    const lineHeight: number = parseInt(window.getComputedStyle(span).getPropertyValue('line-height').replace('px', ''))
    return lineHeight
  }

  function updateFontSize(span: HTMLElement, fontSize: number) {
    span.style.fontSize = `${fontSize}px`
  }

  return (
    <div ref={parentRef} style={{
      overflowY: 'hidden',
    }}>
      <span
        ref={spanRef}>
        {children}
      </span >
    </div>
  )
}