import Image from "next/image"
import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function MyCarousel() {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={30}
      slidesPerView={1}
    >
      <SwiperSlide>
        <Image src="/one.avif" alt="Slide 1" width={800} height={400} className="w-full h-[400px]" />
      </SwiperSlide>
      <SwiperSlide>
        <Image src="/two.avif" alt="Slide 2" width={800} height={400} className="w-full h-100" />
      </SwiperSlide>
       <SwiperSlide>
        <Image src="/three.jpg" alt="Slide 3" width={800} height={400} className="w-full h-100" />
      </SwiperSlide>
    </Swiper>
  )
}