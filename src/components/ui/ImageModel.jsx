import React, { useEffect, useState } from 'react';
import './css/ImageModal.css'; // Ensure to style the modal as per your design
const ImageModal = ({ isOpen, images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset the currentIndex when images prop changes
    useEffect(() => {
        if (images?.length > 0) {
            setCurrentIndex(0); // Reset to the first image
        }
    }, [images]);

    if (!isOpen || images.length === 0) return null; // Don't render if not open or no images

    const nextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images?.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images?.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={images[currentIndex]} alt="Product" />
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
                <button className="prev-button" onClick={prevImage}>
                    &#10094;
                </button>
                <button className="next-button" onClick={nextImage}>
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default ImageModal;


