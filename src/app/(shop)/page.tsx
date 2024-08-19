"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Homepage.module.scss';
import { FiShoppingCart } from 'react-icons/fi';
import Breadcrumb from "./Breadcrumb";

interface Product{  //Estrucutra de almacenamiento para la API
    id: string;
    name: string;
    price: number;
    discount: number;
    rating: number;
    reviews_number: number;
    summary: string;
    image: string;
}

const Homepage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {   // Conexión a API con prueba de error
        fetch('/api/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando productos...</p>;   //Mensaje si la conexión fue exitosa
    if (error) return <p>Error: {error}</p>;    //Mensaje de error por fallo de conexión

    const calculateDiscountedPrice = (price: number, discount: number) => { //Aplicación de descuento al precio neto
        return price - (price * (discount / 100));
    };

    return (
        <div className={styles.container}>
            <Breadcrumb />
            <h1 className={styles.heading}>Más vistos</h1>
            <div className={styles.productGrid}>
                {products.length > 0 ? (
                    <>
                        {/* Estructura para visualizar el producto con mejor calificación */}
                        <div className={styles.featuredProduct}> 
                            <Link href={`/product/${products[0].id}`} className={styles.productLink}>
                                <div className={styles.imageContainer}>
                                    <img src={products[0].image} alt={products[0].name} className={styles.featuredImage} />
                                    {products[0].discount > 0 && (
                                        <div className={styles.discountBadge}>
                                            {products[0].discount}% OFF
                                        </div>
                                    )}
                                </div>
                                <h2 className={styles.featuredTitle}>{products[0].name}</h2>
                                <div className={styles.featuredPrice}>
                                    {products[0].discount > 0 && (
                                        <span className={styles.originalPrice}>
                                            ${products[0].price.toFixed(2)}
                                        </span>
                                    )}
                                    <span className={styles.discountedPrice}>
                                        ${calculateDiscountedPrice(products[0].price, products[0].discount).toFixed(2)}
                                    </span>
                                </div>
                                <p className={styles.stars}>Rating: {products[0].rating} stars</p>
                                <p className={styles.featuredSummary}>{products[0].summary}</p>
                            </Link>
                            <button className={styles.addToCartButton}>
                                <FiShoppingCart size={28}/>
                                Add to Cart
                            </button>
                        </div>
                        {/* Estrucutra para visualizar los demas productos, solo imagen y precio */}
                        <div className={styles.otherProducts}>
                            {products.slice(1).map(product => (
                                <Link key={product.id} href={`/product/${product.id}`} className={styles.productLink}>
                                    <div className={styles.productCard}>
                                        <div className={styles.imageContainer}>
                                            <img src={product.image} alt={product.name} className={styles.productImage} />
                                            {product.discount > 0 && (
                                                <div className={styles.discountBadge}>
                                                    {product.discount}% OFF
                                                </div>
                                            )}
                                        </div>
                                        <h3 className={styles.productTitle}>{product.name}</h3>
                                        <p className={styles.productPrice}>
                                            ${calculateDiscountedPrice(product.price, product.discount).toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <p>Productos no disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default Homepage;
