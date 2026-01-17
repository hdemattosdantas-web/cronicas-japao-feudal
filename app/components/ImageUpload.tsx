'use client'

import React, { useState, useRef } from 'react'

interface ImageUploadProps {
  onImageChange: (file: File | null, imageUrl?: string) => void
  currentImage?: string
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
  shape?: 'square' | 'circle'
}

export default function ImageUpload({
  onImageChange,
  currentImage,
  placeholder = "Clique para adicionar imagem",
  size = 'medium',
  shape = 'square'
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-40 h-40'
  }

  const shapeClasses = {
    square: 'rounded-lg',
    circle: 'rounded-full'
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.')
        return
      }

      try {
        // Upload the image to server
        const formData = new FormData()
        formData.append('image', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (result.success) {
          setPreview(result.imageUrl)
          onImageChange(file, result.imageUrl)
        } else {
          alert(`Erro no upload: ${result.error}`)
        }
      } catch (error) {
        console.error('Erro no upload:', error)
        alert('Erro ao fazer upload da imagem. Tente novamente.')
      }
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`
          ${sizeClasses[size]}
          ${shapeClasses[shape]}
          border-2 border-dashed border-gray-400
          flex items-center justify-center
          cursor-pointer transition-all duration-300
          hover:border-amber-600 hover:bg-amber-50
          relative overflow-hidden
          ${preview ? 'border-solid border-amber-600' : ''}
        `}
        onClick={handleClick}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
              title="Remover imagem"
            >
              ×
            </button>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-1">📷</div>
            <div className="text-xs">{placeholder}</div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview && (
        <p className="text-xs text-gray-600 text-center">
          Clique na imagem para alterar
        </p>
      )}
    </div>
  )
}