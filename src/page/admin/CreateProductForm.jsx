import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './css/CreateProductForm.css';
import {
    createProduct,
    getProducts,
    updateProduct,
} from '../../store/slices/productSlice';
import toast from 'react-hot-toast';

const CreateProductForm = ({ product = null }) => {
    const dispatch = useDispatch();
    const { loading, error, success } = useSelector(
        (state) => state.product.createProduct
    );
    const {
        loading: updateLoading,
        error: updateError,
        success: updateSuccess,
    } = useSelector((state) => state.product.updateProduct);

    const initialFormData = {
        name: '',
        price: '',
        description: '',
        category: '',
        stock: '',
        discount: '',
        available: 'in stock',
        marketPrice: '',
        image: null,
        colors: '',
        flavors: '',
        brand: '',
        size: '', // Added size
        material: '', // Added material
        occasion: '', // Added occasion
    };

    const [formData, setFormData] = useState(initialFormData);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                name: product?.name || '',
                price: product?.price || '',
                description: product?.description || '',
                category: product?.category || '',
                stock: product?.stock || '',
                available: product?.available || 'in stock',
                discount: product?.discount || '',
                marketPrice: product?.marketPrice || '',
                image: null,
                colors: product?.colors || '',
                flavors: product?.flavors || '',
                brand: product?.brand || '',
                size: product?.size || '', // Set size
                material: product?.material || '', // Set material
                occasion: product?.occasion || '', // Set occasion
            });
        } else {
            setFormData(initialFormData);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'available' && value === 'in stock') {
            setFormData((prevData) => ({
                ...prevData,
                stock: 1,
            }));
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        const fileArray = Array.from(files);
        setFormData((prevData) => ({
            ...prevData,
            image: fileArray.length ? fileArray : null,
        }));
    };

    const handleRemoveImages = () => {
        setFormData((prevData) => ({
            ...prevData,
            image: null,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData?.category.length > 0) {
            toast.error("category not add ")
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                if (Array.isArray(value)) {
                    value.forEach((val) => formDataToSend.append(key, val));
                } else {
                    formDataToSend.append(key, value);
                }
            }
        });

        if (!formData.image) {
            formDataToSend.append('images', JSON.stringify([]));
        }

        if (product) {
            if (!product?._id) {
                console.error('Invalid product ID for update:', product);
                return;
            }
            dispatch(
                updateProduct({ id: product._id, productData: formDataToSend })
            )
                .unwrap()
                .then(() => {
                    dispatch(getProducts());
                    handleRemoveImages();
                });
        } else {
            dispatch(createProduct(formDataToSend))
                .unwrap()
                .then(() => {
                    dispatch(getProducts());
                    handleRemoveImages();
                });
        }
    };

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

    const filteredCategories = categories.filter((category) =>
        category.toLowerCase().includes(searchTerm)
    );

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    return (
        <div className="CreateProductForm">
            <h3>{product ? 'Update Product' : 'Create New Product'}</h3>
            <form onSubmit={handleSubmit}>
                <span>Name *</span>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                />
                <span>Price *</span>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                />
                <span>Description *</span>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />
                <span
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                    }}
                >
                    <span>Category *</span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search Category"
                    />
                    <select
                        name="category"
                        value={formData?.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select a category
                        </option>
                        {filteredCategories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </span>
                <span>Stock *</span>
                <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                    required
                />
                <select
                    name="available"
                    value={formData.available}
                    onChange={handleChange}
                    required
                >
                    <option value="in stock">In Stock</option>
                    <option value="out of stock">Out of Stock</option>
                    <option value="pre-order">Pre-Order</option>
                </select>
                <span>Discount *</span>
                <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="Discount"
                    required
                />
                <span>Market Price *</span>
                <input
                    type="number"
                    name="marketPrice"
                    value={formData.marketPrice}
                    onChange={handleChange}
                    placeholder="Market Price"
                    required
                />
                <span>Brand *</span>
                <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Brand"
                    required
                />
                <span>Size</span>
                <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    placeholder="Size (use,1,2,3)"
                />
                <span>Material</span>
                <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder="Material (use,1,2,3)"
                />
                <span>Occasion</span>
                <input
                    type="text"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    placeholder="Occasion (use,1,2,3)"
                />
                <span>Colors</span>
                <input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    placeholder="Colors (use,1,2,3)"
                    required
                />
                <span>Flavors</span>
                <input
                    type="text"
                    name="flavors"
                    value={formData.flavors}
                    onChange={handleChange}
                    placeholder="Flavors (use,1,2,3)"
                />
                <span>Images *</span>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <button type="submit" disabled={loading || updateLoading}>
                    {loading || updateLoading ? 'Processing...' : 'Submit'}
                </button>
                {formData.image && (
                    <div className="image-preview">
                        <div className="image-item">
                            {Array.isArray(formData.image) &&
                                formData.image.map((file, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                    />
                                ))}
                        </div>
                        <button
                            onClick={handleRemoveImages}
                            className="remove-images"
                        >
                            Remove Images
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateProductForm;
