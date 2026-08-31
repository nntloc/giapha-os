export interface FooterProps {
  className?: string
  showDisclaimer?: boolean
}

export default function Footer({
  className = '',
  showDisclaimer = false
}: FooterProps) {
  return (
    <footer
      className={`py-8 text-center text-sm text-stone-500 ${className} backdrop-blur-sm`}>
      <div className='mx-auto max-w-7xl px-4'>
        {showDisclaimer && (
          <p className='mb-4 inline-block rounded-full border border-amber-200/50 bg-amber-50 px-3 py-1 text-xs tracking-wide text-amber-800/80'>
            Nội dung có thể thiếu sót. Vui lòng đóng góp để gia phả chính xác
            hơn.
          </p>
        )}
        <p className='font-semibold text-stone-600 opacity-80'>
          Gia Phả Gia Đình ông Bảy Thông
        </p>
      </div>
    </footer>
  )
}
