import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import Icon from './Icon';

export default function FloatingCart() {
    const { cart, totals, openDrawer } = useCart();

    const [isInProductSection, setIsInProductSection] = useState(false);
    const [isCartVisible, setIsCartVisible] = useState(false);

    // Product section detection
    useEffect(() => {
        const handleScroll = () => {
            const shopSection = document.getElementById('shop');

            if (!shopSection) return;

            const rect = shopSection.getBoundingClientRect();

            const productSectionVisible =
                rect.top < window.innerHeight &&
                rect.bottom > 0;

            setIsInProductSection(productSectionVisible);
        };

        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Cart section ke andar enter/leave animation
    useEffect(() => {
        if (!cart.length) {
            setIsCartVisible(false);
            return;
        }

        if (isInProductSection) {
            // Pehle hidden state render hone do,
            // phir next frame me visible karo
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsCartVisible(true);
                });
            });
        } else {
            setIsCartVisible(false);
        }
    }, [isInProductSection, cart.length]);

    if (cart.length === 0) {
        return null;
    }

    const firstItem = cart[0];

    return (
        <div
            className={`floating-cart ${isCartVisible
                    ? 'floating-cart-visible'
                    : 'floating-cart-hidden'
                }`}
            onClick={openDrawer}
        >
            <div className="floating-cart-icon">
                <Icon name="cart" />

                <span className="floating-cart-count">
                    {totals.itemCount}
                </span>
            </div>

            <div className="floating-cart-info">
                <span className="floating-cart-title">
                    {cart.length === 1
                        ? firstItem.name
                        : `${cart.length} products`}
                </span>

                <span className="floating-cart-items">
                    {totals.itemCount} items
                </span>
            </div>

            <div className="floating-cart-total">
                ₹{totals.total}
            </div>

            <div className="floating-cart-arrow">
                →
            </div>
        </div>
    );
}