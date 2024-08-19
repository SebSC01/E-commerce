"use client"; // Asegúrate de marcar este componente como cliente
//Import de librerias y conexión con arhicov de estilos
import React, { useState, useEffect } from "react";
import styles from './ProductDetail.module.scss';
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import Breadcrumb from "../../Breadcrumb";

type ProductDetailProps = { //Almacenamiento del ID del producto
    params: {
        id: string;
    };
};

type Product = { //Estructura para almacenar información del producto
    id: string;
    name: string;
    price: number;
    discount: number;
    rating: number;
    reviews_number: number;
    summary: string;
    image: string;
};

const ProductDetail = ({ params }: ProductDetailProps) => { //Declaración de variables de visualización, carga y error
    const { id } = params;
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Conexión a la api
                const response = await fetch(`/api/products/${id}`); //Trayendo producto del ID selecionado
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                const data: Product = await response.json();
                setProduct(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p>Cargando detalles del producto...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>Producto no encontrado</p>;

    const calculateDiscountedPrice = (price: number, discount: number) => {
        return price - (price * (discount / 100));
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return (
            // Visualización de las estrellas del rating
            <div className={styles.stars}>
                {[...Array(fullStars)].map((_, i) => (
                    <span key={i} className={`${styles.star} ${styles.filled}`}>★</span>
                ))}
                {hasHalfStar && <span className={`${styles.star} ${styles.filled}`}>★</span>}
                {[...Array(5 - Math.ceil(rating))].map((_, i) => (
                    <span key={i} className={`${styles.star} ${styles.empty}`}>★</span>
                ))}
            </div>
        );
    };

    return (
        // Visualización de imagen y detalles del producto
        <div className={styles.container}>
            <Breadcrumb/>
            <div className={styles.contentWrapper}>
                <div className={styles.imageContainer}>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className={styles.productImage} 
                    />
                </div>
                <div className={styles.detailsContainer}>
                    <div className={styles.productRating}>
                        {renderStars(product.rating)}
                        <span className={styles.ratingText}>Star Rating: {product.rating.toFixed(1)}</span>
                    </div>
                    <h1 className={styles.productTitle}>
                        {product.name}
                    </h1>
                    <div className={styles.productPrice}>
                        {product.discount > 0 && (
                            <>
                                <span className={styles.productDiscount}>
                                    ${product.price.toFixed(2)}
                                </span>
                                <span className={styles.discountedPrice}>
                                    ${calculateDiscountedPrice(product.price, product.discount).toFixed(2)}
                                    <span className={styles.discountText}>
                                        ({product.discount}% off)
                                    </span>
                                </span>
                            </>
                        )}
                        {product.discount === 0 && (
                            <span className={styles.productPrice}>
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                    {/* Configuración del boton 'Añadir al carrito */}
                    <Link href="/cart" className={styles.addToCartButton}>
                        <button className={styles.addToCartButton}>
                            <FiShoppingCart size={28} className={styles.cartIcon}/>
                            Add to Cart
                        </button>
                    </Link>
                </div>
            </div>
            {/* Visualización de información del producto */}
            <div className={styles.descriptionContainer}>
                <h2 className={styles.descriptionTitle}>DESCRIPTION</h2>
                <p className={styles.descriptionSummary}>{product.summary}</p>
            </div>
        </div>
    );
};

export default ProductDetail;
