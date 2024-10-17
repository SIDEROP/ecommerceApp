import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchProductsByCategory } from '../store/slices/productSlice';
import ProductSlider from './ProductSlider';

const CategoryProduct = ({ categoryTitel = null }) => {
    const dispatch = useDispatch();
    const { categoryProduct, loading, error } = useSelector(
        (state) => state.product
    );

    const categories = [
        'Uncategorized',
        'Electronics',
        'Fashion',
        'Sports & Outdoors',
        'Home & Kitchen',
        'Beauty & Personal Care',
        'Books',
        'Automotive',
        'Toys & Games',
        'Jewelry & Watches',
        'Health & Wellness',
        'Office Supplies',
        'Pet Supplies',
        'Music Instruments',
        'Groceries',
        'Furniture',
        'Outdoor & Garden',
        'Baby Products',
        'Fitness Equipment',
        'Gaming',
        'Stationery',
        'Software',
        'Tools & Hardware',
        'Craft Supplies',
        'Travel Accessories',
        'Smart Home Devices',
        'Clothing',
        'Shoes',
        'Watches',
        'Luggage',
        'Appliances',
        'Home Improvement',
        'Photography Equipment',
        'Art Supplies',
        'Collectibles',
        'Seasonal Products',
        'Gift Cards',
        'Camping & Hiking Gear',
        'Fishing Gear',
        'Cycling Accessories',
        'Yoga & Pilates',
        'Skincare Products',
        'Hair Care Products',
        'Nail Care Products',
        'Sunglasses',
        'Phone Accessories',
        'Computer Accessories',
        'Networking Equipment',
        'Virtual Reality Gear',
        'DIY Tools',
        'Electronics Accessories',
        'Fire Safety Equipment',
        'Kitchen Appliances',
        'Outdoor Furniture',
        'Bedding & Linens',
        'Cleaning Supplies',
        'Gardening Tools',
        'Smartwatch Accessories',
        'Home Security Systems',
        'Musical Instruments Accessories',
        'Exercise & Fitness Apps',
        'Dance & Performance Gear',
        'Sports Apparel',
        'Camping Cooking Gear',
        'Bicycle Accessories',
        'Personal Fitness Trainers',
        'Electric Scooters',
        'Lawn Care Equipment',
        'Hobby & Model Kits',
        'Travel Bags & Backpacks',
        'Party Supplies',
        'Wedding Supplies',
        'Home Decor',
        'Smartphone Cases',
        'Virtual Classes & Workshops',
        'Meditation & Mindfulness Tools',
        'Luxury Goods',
        'Electronics Repair Tools',
        'Motorcycle Gear',
        'DIY Craft Kits',
        'Paint & Painting Supplies',
        'Graphic Design Tools',
        'Childrens Educational Toys',
        'Board Games',
        'Puzzles & Brain Teasers',
        'Subscription Boxes',
        'Gourmet Food & Snacks',
        'Fitness Wearables',
    ];

    // Function to select a random category
    const getRandomCategory = () => {
        const randomIndex = Math.floor(Math.random() * categories.length);
        return categories[randomIndex];
    };

    // State to store the selected random category
    const [randomCategory, setRandomCategory] = useState(getRandomCategory());

    // Function to generate a valid key for categoryProduct
    const getCategoryKey = (category) => {
        return category.replace(/ /g, '_').toLowerCase(); // Converts spaces to underscores and lowercase
    };

    useEffect(() => {
        const category = categoryTitel || randomCategory;
        dispatch(searchProductsByCategory(category));
    }, [dispatch, categoryTitel, randomCategory]);

    const categoryKey = getCategoryKey(categoryTitel || randomCategory); // Get dynamic key for category

    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : categoryProduct[categoryKey]?.length > 0 ? (
                <ProductSlider
                    products={categoryProduct[categoryKey]}
                    nameTitle={categoryTitel || randomCategory}
                />
            ) : (
                null
            )}
        </>
    );
};

export default CategoryProduct;
