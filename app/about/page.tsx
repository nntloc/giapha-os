'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Info, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className='relative flex min-h-screen flex-col bg-neutral selection:bg-amber-200 selection:text-amber-900'>
      <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px]'></div>

      <Link href='/dashboard' className='btn absolute top-6 left-6 z-20'>
        <ArrowLeft className='size-4 transition-transform group-hover:-translate-x-1' />
        Quay lại
      </Link>

      <div className='relative z-10 mb-10 flex w-full flex-1 flex-col items-center justify-center px-4 py-20'>
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className='w-full max-w-3xl'>
          <div className='mt-6 mb-8 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-12'>
            <div className='mb-6 flex items-center gap-3'>
              <div className='rounded-2xl bg-amber-100/50 p-3 text-amber-700'>
                <Info className='size-6' />
              </div>
              <h1 className='title'>Gia Phả Gia Tộc Ông Bảy Thông</h1>
            </div>

            <div className='max-w-none'>
              <p className='mb-8 text-[15px] leading-relaxed text-stone-600'>
                Gia phả Gia tộc Ông Bảy Thông được xây dựng nhằm{' '}
                <strong className='text-stone-800'>
                  lưu giữ, kết nối và truyền lại những thông tin quý báu về
                  nguồn cội gia đình
                </strong>{' '}
                cho các thế hệ con cháu hôm nay và mai sau.
              </p>

              <div className='mt-8 mb-4 flex items-center gap-3 border-t border-stone-100 pt-8'>
                <div className='rounded-xl bg-amber-50 p-2.5 text-amber-700'>
                  <Info className='size-5' />
                </div>
                <h2 className='text-xl font-bold text-stone-900'>
                  Về gia phả
                </h2>
              </div>

              <div className='rounded-2xl border border-stone-200/60 bg-stone-50 p-6 text-[14.5px] leading-relaxed'>
                <p className='text-stone-600'>
                  Gia phả ghi lại các thế hệ hậu duệ của{' '}
                  <strong className='text-stone-800'>
                    ông Nguyễn Văn Thông và bà Nguyễn Thị Hương
                  </strong>
                  , giúp con cháu hiểu rõ mối quan hệ gia đình, các nhánh trong
                  dòng tộc, đồng thời cùng nhau bổ sung và gìn giữ những ký ức,
                  hình ảnh và câu chuyện của gia đình.
                </p>
                <p className='mt-4 text-stone-600'>
                  Hệ thống cho phép quản lý thành viên, xem cây gia phả trực
                  quan và cập nhật thông tin thuận tiện trên nhiều thiết bị.
                </p>
              </div>

              <div className='mt-8 mb-4 flex items-center gap-3 border-t border-stone-100 pt-8'>
                <div className='rounded-xl bg-blue-50 p-2.5 text-blue-600'>
                  <MessageCircle className='size-5' />
                </div>
                <h2 className='text-xl font-bold text-stone-900'>
                  Liên hệ
                </h2>
              </div>

              <div className='mb-8 space-y-2 text-[15px] leading-relaxed text-stone-600'>
                <p>
                  <strong className='text-stone-800'>Phụ trách kỹ thuật:</strong>{' '}
                  Nguyễn Ngọc Thiên Lộc
                </p>
                <p>
                  <strong className='text-stone-800'>Zalo:</strong> 0904 487 780
                </p>
              </div>

              <p className='border-t border-stone-100 pt-8 text-[15px] leading-relaxed text-stone-600 italic'>
                Mong rằng mỗi thành viên trong gia tộc sẽ cùng chung tay bổ sung
                thông tin để gia phả ngày càng đầy đủ, chính xác và trở thành một
                di sản ý nghĩa cho các thế hệ mai sau.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
