'use client'

import { Check, Minus, Plus, RotateCcw, X } from 'lucide-react'
import { PointerEvent, useEffect, useRef, useState } from 'react'

const CROP_SIZE = 256
const MIN_ZOOM = 1
const MAX_ZOOM = 3

interface AvatarCropEditorProps {
  file: File
  onApply: (file: File, previewUrl: string) => void
  onCancel: () => void
}

export default function AvatarCropEditor({
  file,
  onApply,
  onCancel
}: AvatarCropEditorProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{
    x: number
    y: number
    startX: number
    startY: number
  } | null>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onload = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(file)

    return () => reader.abort()
  }, [file])

  const getRenderedSize = (currentZoom: number) => {
    if (!imageSize.width || !imageSize.height) return { width: 0, height: 0 }
    const coverScale = Math.max(
      CROP_SIZE / imageSize.width,
      CROP_SIZE / imageSize.height
    )

    return {
      width: imageSize.width * coverScale * currentZoom,
      height: imageSize.height * coverScale * currentZoom
    }
  }

  const clampPosition = (
    nextPosition: { x: number; y: number },
    currentZoom: number
  ) => {
    const renderedSize = getRenderedSize(currentZoom)
    const maxX = Math.max(0, (renderedSize.width - CROP_SIZE) / 2)
    const maxY = Math.max(0, (renderedSize.height - CROP_SIZE) / 2)

    return {
      x: Math.min(maxX, Math.max(-maxX, nextPosition.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPosition.y))
    }
  }

  const updateZoom = (nextZoom: number) => {
    const clampedZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom))
    setZoom(clampedZoom)
    setPosition((currentPosition) =>
      clampPosition(currentPosition, clampedZoom)
    )
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      x: position.x,
      y: position.y,
      startX: event.clientX,
      startY: event.clientY
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return

    setPosition(
      clampPosition(
        {
          x: drag.x + event.clientX - drag.startX,
          y: drag.y + event.clientY - drag.startY
        },
        zoom
      )
    )
  }

  const finishDragging = () => {
    dragRef.current = null
  }

  const handleApply = () => {
    if (!imageSrc || !imageSize.width || !imageSize.height) return

    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512

      const context = canvas.getContext('2d')
      if (!context) return

      const renderedSize = getRenderedSize(zoom)
      const x = (CROP_SIZE - renderedSize.width) / 2 + position.x
      const y = (CROP_SIZE - renderedSize.height) / 2 + position.y
      const outputScale = canvas.width / CROP_SIZE

      context.drawImage(
        image,
        x * outputScale,
        y * outputScale,
        renderedSize.width * outputScale,
        renderedSize.height * outputScale
      )

      canvas.toBlob(
        (blob) => {
          if (!blob) return
          const fileName = `${file.name.replace(/\.[^/.]+$/, '') || 'avatar'}.jpg`
          const croppedFile = new File([blob], fileName, { type: 'image/jpeg' })
          onApply(croppedFile, URL.createObjectURL(croppedFile))
        },
        'image/jpeg',
        0.9
      )
    }
    image.src = imageSrc
  }

  const renderedSize = getRenderedSize(zoom)

  return (
    <div className='mt-5 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4 shadow-sm sm:p-5'>
      <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
        <div
          className='relative size-64 shrink-0 touch-none overflow-hidden rounded-full border-4 border-white bg-stone-200 shadow-md'
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishDragging}
          onPointerCancel={finishDragging}
          onPointerLeave={finishDragging}>
          {imageSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt='Vùng cắt ảnh đại diện'
              onLoad={(event) =>
                setImageSize({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight
                })
              }
              className='pointer-events-none absolute max-w-none select-none'
              style={{
                width: renderedSize.width,
                height: renderedSize.height,
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
        </div>

        <div className='min-w-0 flex-1'>
          <p className='font-semibold text-stone-800'>
            Điều chỉnh ảnh đại diện
          </p>
          <p className='mt-1 text-sm text-stone-500'>
            Kéo ảnh để chọn vị trí, dùng thanh bên dưới để phóng to hoặc thu
            nhỏ.
          </p>

          <div className='mt-5 flex items-center gap-3'>
            <button
              type='button'
              onClick={() => updateZoom(zoom - 0.1)}
              disabled={zoom <= MIN_ZOOM}
              className='flex size-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-xs transition-colors hover:border-amber-300 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-40'
              aria-label='Thu nhỏ ảnh'>
              <Minus className='size-4' />
            </button>
            <input
              type='range'
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step='0.05'
              value={zoom}
              onChange={(event) => updateZoom(Number(event.target.value))}
              className='h-1.5 w-full cursor-pointer appearance-none rounded-full bg-amber-200 accent-amber-600'
              aria-label='Mức phóng to ảnh'
            />
            <button
              type='button'
              onClick={() => updateZoom(zoom + 0.1)}
              disabled={zoom >= MAX_ZOOM}
              className='flex size-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-xs transition-colors hover:border-amber-300 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-40'
              aria-label='Phóng to ảnh'>
              <Plus className='size-4' />
            </button>
          </div>

          <div className='mt-2 flex items-center justify-between text-xs font-medium text-stone-500'>
            <span>Thu nhỏ</span>
            <span>{Math.round(zoom * 100)}%</span>
            <span>Phóng to</span>
          </div>

          <div className='mt-5 flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => {
                setPosition({ x: 0, y: 0 })
                setZoom(MIN_ZOOM)
              }}
              className='flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50'>
              <RotateCcw className='size-4' /> Đặt lại
            </button>
            <button
              type='button'
              onClick={onCancel}
              className='flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50'>
              <X className='size-4' /> Hủy
            </button>
            <button
              type='button'
              onClick={handleApply}
              disabled={!imageSize.width}
              className='flex items-center gap-2 rounded-xl bg-stone-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50'>
              <Check className='size-4' /> Áp dụng ảnh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
