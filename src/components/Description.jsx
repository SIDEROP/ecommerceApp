import React, { useState } from 'react';

const Description = () => {
    const [showDescription, setShowDescription] = useState(true);

    const toggleSection = (section) => {
        if (section === 'description') {
            setShowDescription(true);
        } else if (section === 'shipping') {
            setShowDescription(false);
        }
    };
    return (
        <div className="productInfoSection">
            <div className="BtnBoxToggleInfo">
                <button onClick={() => toggleSection('description')}>
                    Description
                </button>
                <button onClick={() => toggleSection('shipping')}>
                    Shipping Information
                </button>
            </div>

            {showDescription ? (
                <div className="description-section">
                    <h3>Description</h3>
                    <p>
                        This product is made with premium-quality materials,
                        ensuring durability and comfort for daily use.
                    </p>
                    <p>
                        It's designed for those who value both style and
                        functionality, offering a perfect balance between
                        aesthetics and practical use.
                    </p>
                    <p>
                        Enjoy our unique design, crafted with attention to
                        detail and an emphasis on sustainability.
                    </p>
                    <h4>Key Features</h4>
                    <ul>
                        <li>High-quality materials for durability.</li>
                        <li>Designed with a focus on sustainability.</li>
                        <li>Available in multiple sizes and colors.</li>
                        <li>Perfect for both casual and formal use.</li>
                    </ul>
                </div>
            ) : (
                <div className="shipping-info-section">
                    <h3>Shipping Information</h3>
                    <p>
                        We ship worldwide with reliable and trusted carriers.
                        Standard delivery takes 3-5 business days within India,
                        and international shipping times may vary.
                    </p>
                    <p>
                        Free shipping is available on all domestic orders over
                        ₹999. For orders below ₹999, standard shipping charges
                        apply.
                    </p>
                    <p>
                        In case of returns, you may return any unused, unopened
                        item within 30 days for a full refund.
                    </p>
                    <p>
                        For international orders, customs charges may apply
                        based on your location.
                    </p>
                    <h3>Returns Policy</h3>
                    <p>
                        You may return most new, unopened items within 30 days
                        of delivery for a full refund. We'll also pay the return
                        shipping costs if the return is a result of our error
                        (you received a defective or incorrect item).
                    </p>
                </div>
            )}
        </div>
    );
};

export default Description;
