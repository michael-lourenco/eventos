interface PlaceholderImageProps {
  width: number
  height: number
  text?: string
}

export function PlaceholderImage({
  width,
  height,
  text = "Placeholder Image",
}: PlaceholderImageProps) {
  return (
    <div
      className="flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white/70"
      style={{ width: width ?? "100%", height: height ?? "100%" }}
    >
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}
