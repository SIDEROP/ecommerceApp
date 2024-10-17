import React, { useEffect, useRef, useState } from 'react';
import './css/ProductSlider.css';
import Card from './Card';

const ProductSlider = ({ products, nameTitle }) => {
    const sliderRef = useRef(null);

    const handleScroll = (direction) => {
        const slider = sliderRef.current;
        const scrollAmount = slider.offsetWidth;

        if (direction === 'left') {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="ProductSlider">
            <h3>{nameTitle || null}</h3>
            <div className="Slider">
                <button
                    className="scroll-button left"
                    onClick={() => handleScroll('left')}
                >
                    &lt;
                </button>
                <div className="sliderBox" ref={sliderRef}>
                    {products &&
                        products.map((data, i) => (
                            <span key={i}>
                                <Card data={data} />
                            </span>
                        ))}
                </div>
                <button
                    className="scroll-button right"
                    onClick={() => handleScroll('right')}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default ProductSlider;
