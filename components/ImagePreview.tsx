'use client'

interface ImagePreviewProps {
  url: string
}

export default function ImagePreview({ url }: ImagePreviewProps) {
  return (
    <div className="mb-3">
      <img
        src={url}
        alt="Uploaded"
        className="max-w-sm max-h-64 rounded-lg border border-claude-border"
        onError={(e) => {
          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3E이미지 로드 실패%3C/text%3E%3C/svg%3E'
        }}
      />
    </div>
  )
}
