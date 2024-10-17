import React, { useEffect, useRef, useState } from 'react';
import '../css/Home.css';
import MainSlider from '../../components/MainSlider';
import ProductSlider from '../../components/ProductSlider';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../store/slices/productSlice';
import RandomProduct from '../../components/RandomProduct';
import CategoryProduct from '../../components/CategoryProduct';
import Loader from "../../components/ui/Loder"

const Home = () => {
    const {
        productsAll: { products, loading, error },
    } = useSelector((state) => state.product);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    if (loading) {
        return <Loader/>
    }


    return (
        <>
            <div className="Home">
                {true && <MainSlider />}
                <CategoryProduct categoryTitel="Electronics" />
                <CategoryProduct categoryTitel="Sports & Outdoors" />
                <CategoryProduct />
                {products && products.length > 0 && <RandomProduct />}
                <CategoryProduct />
            </div>
        </>
    );
};

export default Home;
