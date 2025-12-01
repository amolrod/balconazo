"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";
import { MapPin } from "lucide-react";

interface SlideData {
  id: string;
  title: string;
  src: string;
  city: string;
  pricePerHour: number;
  capacity: number;
  rating?: number;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", x + "px");
      slideRef.current.style.setProperty("--y", y + "px");

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, title, city, pricePerHour } = slide;
  const isActive = current === index;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 cursor-pointer"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: !isActive ? "scale(0.98) rotateX(8deg)" : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-2xl overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform: isActive ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)" : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{ opacity: isActive ? 1 : 0.5 }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {isActive && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        {/* Content - centered title and button */}
        <article className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold relative mb-6">
            {title}
          </h2>
          <div className="flex justify-center">
            <button className="w-32 h-10 flex items-center justify-center gap-2 text-xs font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full hover:bg-white/30 transition duration-300">
              Explorar
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </article>

        {/* Small details at the bottom */}
        <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/70 transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{city}</span>
          </div>
          <div>
            <span className="font-medium text-white">{pricePerHour}€</span>
            <span>/hora</span>
          </div>
        </div>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button 
      className={`w-12 h-12 flex items-center justify-center bg-neutral-200 dark:bg-neutral-800 border-2 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 hover:bg-neutral-300 dark:hover:bg-neutral-700 active:translate-y-0.5 transition duration-200 ${type === "previous" ? "rotate-180" : ""}`}
      title={title} 
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200 w-6 h-6" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function Carousel({ slides, onLoadMore, hasMore = false }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const id = useId();

  // Load more when reaching slide 5 (or near the end)
  useEffect(() => {
    if (current >= slides.length - 2 && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [current, slides.length, hasMore, onLoadMore]);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  // Calculate translateX to center the current slide
  const slideWidth = 78; // 70vmin + 8vmin margins
  const translateX = -current * slideWidth;

  return (
    <div
      className="relative w-full h-[70vmin]"
      aria-labelledby={"carousel-heading-" + id}
    >
      {/* Slides container with overflow hidden */}
      <div className="absolute inset-0 overflow-hidden">
        <ul
          className="absolute left-1/2 h-full flex items-center transition-transform duration-700 ease-out"
          style={{ 
            transform: `translateX(calc(-35vmin + ${translateX}vmin))` 
          }}
        >
          {slides.map((slide, index) => (
            <Slide
              key={slide.id}
              slide={slide}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
            />
          ))}
        </ul>
      </div>

      {/* Navigation arrows - outside overflow container */}
      <div className="absolute left-1/2 -translate-x-1/2 flex gap-4" style={{ top: "calc(100% + 2rem)" }}>
        <CarouselControl
          type="previous"
          title="Anterior"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Siguiente"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
