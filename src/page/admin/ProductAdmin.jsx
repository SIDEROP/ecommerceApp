import React, { useEffect, useState } from 'react';
import './css/ProductAdmin.css';
import CreateProductForm from './CreateProductForm';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct, getProducts } from '../../store/slices/productSlice';
import { FixedSizeList as List } from 'react-window';
import { MdDelete } from 'react-icons/md';
import ImageModal from '../../components/ui/ImageModel';
import Loder from '../../components/ui/Loder';

const ProductAdmin = () => {
    const [productData, setProductData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [availability, setAvailability] = useState('');
    const [toggle, setToggle] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const {
        productsAll: { products, loading },
    } = useSelector((state) => state.product);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        if (loading) {
            return <Loder />;
        }
    }, [products]);

    // Filter products based on search term and availability
    const filteredProducts = products.filter((product) => {
        const { name, description, category, available } = product || {};
        const matchesSearch =
            (name && name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (description &&
                description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (category &&
                category.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesAvailability = availability
            ? available === availability
            : true;

        return matchesSearch && matchesAvailability;
    });

    const inStockCount = filteredProducts.filter(
        (product) => product.available === 'in stock'
    ).length;
    const outOfStockCount = filteredProducts.filter(
        (product) => product.available === 'out of stock'
    ).length;
    const preOrderCount = filteredProducts.filter(
        (product) => product.available === 'pre-order'
    ).length;

    // Row component for rendering each product
    const Row = ({ index, style }) => {
        const product = filteredProducts[index];
        return (
            <div
                className="CardAdmin"
                onClick={() => {
                    setToggle(true);
                    setProductData(product);
                }}
            >
                <span
                    className="img"
                    onClick={(e) => {
                        e.stopPropagation();
                        setProductData(product);
                        setModalOpen(true);
                    }}
                >
                    {product?.images && product?.images?.length > 0 ? (
                        <img
                            key={0}
                            src={product?.images[0]}
                            alt={`Product ${product?.name}`}
                        />
                    ) : null}
                </span>

                <span>
                    <div className="title">Name</div>
                    <div>{product?.name}</div>
                </span>
                <span>
                    <div className="title">Price</div>
                    <div>₹ {product?.price?.toFixed(2)}</div>
                </span>
                {product?.stock && product?.stock?.length > 0 && (
                    <span>
                        <div className="title">Stock</div>
                        <div>{product?.stock}</div>
                    </span>
                )}
                <span>
                    <div className="title">Available</div>
                    <div>{product?.available}</div>
                </span>
                {product?.brand && product?.brand?.length > 0 && (
                    <span>
                        <div className="title">Brand</div>
                        <div>{product?.brand}</div>
                    </span>
                )}
                {product?.colors && product?.colors?.length > 0 && (
                    <span className="hides">
                        <div className="title">Colors</div>
                        <div>{product?.colors?.join(', ')}</div>
                    </span>
                )}
                {product?.flavors && product?.flavors?.length > 0 && (
                    <span className="hides">
                        <div className="title">Flavors</div>
                        <div>{product?.flavors?.join(', ')}</div>
                    </span>
                )}

                <div className="adminDeletProduct">
                    <MdDelete
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent row click event
                            dispatch(deleteProduct(product?._id));
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="productDataAdmin">
            <div className="productDAta">
                <div className="searchAdminProduct">
                    <span>
                        <div className="ProductListTitle">
                            <h4>Product List</h4>
                        </div>
                        <div className="productSearch">
                            <input
                                type="text"
                                placeholder="Search by name, description, or category"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                value={availability}
                                onChange={(e) =>
                                    setAvailability(e.target.value)
                                }
                            >
                                <option value="">All Availability</option>
                                <option value="in stock">In Stock</option>
                                <option value="out of stock">
                                    Out of Stock
                                </option>
                                <option value="pre-order">Pre-Order</option>
                            </select>
                        </div>
                        <div className="productCountIfo">
                            <div>In Stock: {inStockCount}</div>
                            <div>Out of Stock: {outOfStockCount}</div>
                            <div>Pre-Order: {preOrderCount}</div>
                        </div>
                    </span>
                </div>
                {filteredProducts && filteredProducts?.length > 0 ? (
                    <List
                        className="dataDb"
                        height={500}
                        itemCount={filteredProducts?.length}
                        itemSize={50}
                        width="100%"
                    >
                        {Row}
                    </List>
                ) : (
                    <p>No products available</p>
                )}
                <div className="createProductBtnAdmin">
                    <span
                        onClick={() => {
                            setToggle((prev) => !prev);
                        }}
                    >
                        {toggle ? 'Hide' : 'Show'}
                    </span>
                </div>
                <div className="addNewProducts">
                    <button
                        onClick={() => {
                            setProductData(null);
                        }}
                    >
                        Add New Product
                    </button>
                </div>
            </div>
            <div className={`ProductUpload ${toggle ? '' : 'active'}`}>
                <CreateProductForm product={productData} />
            </div>

            {/* Image Modal */}
            <ImageModal
                isOpen={modalOpen}
                images={productData?.images || []} // Pass the list of images
                onClose={() => setModalOpen(false)} // Close modal
            />
        </div>
    );
};

export default ProductAdmin;
