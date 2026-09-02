import { useState } from 'react';

export default function AddProduct() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        image: '',
        imageFile: null,
        quantity: '',
        trending: false,
        price: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            ...(name === 'image' ? { imageFile: null } : {}),
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Only images allowed
        if (!file.type.startsWith('image/')) {
            setMessage('Please select a valid image.');
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setFormData((prev) => ({
            ...prev,
            image: imageUrl,
            imageFile: file,
        }));

        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage('');

        try {
            const form = new FormData();

            form.append('name', formData.name);
            form.append('category', formData.category);
            form.append('quantity', formData.quantity);
            form.append('trending', formData.trending);
            form.append('price', formData.price);

            // Device se image select ki hai
            if (formData.imageFile) {
                form.append('image', formData.imageFile);
            } else {
                throw new Error('Please select a product image');
            }

            const response = await fetch(
                'http://127.0.0.1:8000/api/products/AddProduct',
                {
                    method: 'POST',
                    body: form,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || 'Failed to add product'
                );
            }

            setMessage('Product added successfully!');

            setFormData({
                name: '',
                category: '',
                image: '',
                imageFile: null,
                quantity: '',
                trending: false,
                price: '',
            });

        } catch (error) {
            console.error(error);
            setMessage(
                error.message || 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="add-product-page">
            <div className="add-product-container">

                {/* Header */}
                <div className="add-product-header">
                    <span className="kicker">
                        Product Management
                    </span>

                    <h1>Add Product</h1>

                    <p>
                        Add a new bottle to your collection.
                    </p>
                </div>


                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="add-product-form"
                >

                    {/* Product Name */}
                    <div className="form-group">
                        <label>
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Ocean Blue"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    {/* Category + Price */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                placeholder="e.g. Sports Bottles"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label>
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                placeholder="999"
                                min="1"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>


                    {/* Quantity */}
                    <div className="form-group">
                        <label>
                            Quantity
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            placeholder="50"
                            min="0"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    {/* Product Image */}
                    <div className="form-group">

                        <label>
                            Product Image
                        </label>


                        <div className="image-options">

                            {/* Device Image */}
                            <label className="upload-image-btn">

                                📷 Choose / Take Photo

                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleImageChange}
                                />

                            </label>


                            <span className="or-text">
                                OR
                            </span>


                            {/* Image URL */}
                            <input
                                type="url"
                                name="image"
                                placeholder="https://example.com/bottle.jpg"
                                value={
                                    formData.imageFile
                                        ? ''
                                        : formData.image
                                }
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* Image Preview */}
                    {formData.image && (
                        <div className="image-preview">

                            <p>
                                Image Preview
                            </p>

                            <div className="preview-box">

                                <img
                                    src={formData.image}
                                    alt="Product preview"
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            'none';
                                    }}
                                />

                            </div>

                        </div>
                    )}


                    {/* Trending */}
                    <label className="trending-option">

                        <input
                            type="checkbox"
                            name="trending"
                            checked={formData.trending}
                            onChange={handleChange}
                        />

                        <span>
                            Mark as Trending
                        </span>

                    </label>


                    {/* Submit */}
                    <button
                        type="submit"
                        className="add-product-btn"
                        disabled={loading}
                    >
                        {loading
                            ? 'Adding Product...'
                            : 'Add Product'}
                    </button>


                    {/* Message */}
                    {message && (
                        <p className="form-message">
                            {message}
                        </p>
                    )}

                </form>

            </div>
        </section>
    );
}