import React, { useEffect, useRef, useState } from 'react'
import './css/MainSlider.css'

const MainSlider = () => {
    const sliderRef = useRef(null)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [scrollDirection, setScrollDirection] = useState('right') // Track the scroll direction

    const handleScroll = (direction) => {
        const slider = sliderRef.current
        const scrollAmount = slider.offsetWidth

        if (direction === 'left') {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        } else {
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        const slider = sliderRef.current
        const scrollAmount = slider.offsetWidth

        const autoScroll = setInterval(() => {
            const maxScrollLeft = slider.scrollWidth - slider.offsetWidth
            const currentScroll = slider.scrollLeft

            if (scrollDirection === 'right') {
                if (currentScroll >= maxScrollLeft) {
                    setScrollDirection('left')
                } else {
                    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' })
                }
            } else if (scrollDirection === 'left') {
                if (currentScroll <= 0) {
                    setScrollDirection('right')
                } else {
                    slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
                }
            }
        }, 3000)

        return () => {
            clearInterval(autoScroll)
        }
    }, [scrollDirection])

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className="slider">
            <button
                className="scroll-button left"
                onClick={() => handleScroll('left')}
            >
                &lt;
            </button>
            <div
                className={`sliderBox ${windowWidth <= 490 ? 'Mobile' : null}`}
                ref={sliderRef}
            >
                <div className="slide">
                    <a href="#">
                        <img
                            src={`${windowWidth <= 490 ? 'https://rukminim2.flixcart.com/fk-p-flap/1000/440/image/c2e96ee6b8ce8ac8.jpg?q=20' : 'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/84b011a65983e75a.jpg?q=20'}`}
                            alt=""
                        />
                    </a>
                </div>
                <div className="slide">
                    <a href="#">
                        <img
                            src={`${windowWidth <= 490 ? 'https://rukminim2.flixcart.com/fk-p-flap/1000/440/image/c2e96ee6b8ce8ac8.jpg?q=20' : 'https://rukminim2.flixcart.com/fk-p-flap/1600/270/image/5448938c117980ac.jpeg?q=20'}`}
                            alt=""
                        />
                    </a>
                </div>
            </div>
            <button
                className="scroll-button right"
                onClick={() => handleScroll('right')}
            >
                &gt;
            </button>
        </div>
    )
}

export default MainSlider
