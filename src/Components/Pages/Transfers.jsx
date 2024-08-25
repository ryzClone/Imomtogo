import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../style/Accepted.css";

const Transfers = () => {
  return (
    <div className="App">
      <h1>Card Slider</h1>
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
      >
        <SwiperSlide>
          <div className="card">
            <img src="https://via.placeholder.com/150" alt="Placeholder" />
            <h2>Card 1</h2>
            <p>This is the description for card 1.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card">
            <img src="https://via.placeholder.com/150" alt="Placeholder" />
            <h2>Card 2</h2>
            <p>This is the description for card 2.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card">
            <img src="https://via.placeholder.com/150" alt="Placeholder" />
            <h2>Card 3</h2>
            <p>This is the description for card 3.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card">
            <img src="https://via.placeholder.com/150" alt="Placeholder" />
            <h2>Card 4</h2>
            <p>This is the description for card 4.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card">
            <img src="https://via.placeholder.com/150" alt="Placeholder" />
            <h2>Card 4</h2>
            <p>This is the description for card 4.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card">
            <img src="https://via.placeholder.com/150" alt="Placeholder" />
            <h2>Card 4</h2>
            <p>This is the description for card 4.</p>
          </div>
        </SwiperSlide>
        {/* Add more slides as needed */}
      </Swiper>
    </div>
  );
};

export default Transfers;
