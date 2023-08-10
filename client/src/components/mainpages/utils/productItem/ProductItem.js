import React from 'react'
import BtnRender from './BtnRender'
import { Link } from 'react-router-dom'
// import motion from 'framer-motion';

function ProductItem({ product, isAdmin, deleteProduct, handleCheck }) {

    return (
        <div className="product_card">
            {
                isAdmin && <input type="checkbox" checked={product.checked}
                    onChange={() => handleCheck(product._id)} />
            }
            <div className='product_box_img'>
                <img src={product.images.url} alt="" />
            </div>

            <div className="product_box_info">
                <h2 title={product.title}>{product.title}</h2>
                <span>${product.price}</span>
                <p>{product.description.length > 100 ? product.description.slice(0, 100) + "..." : product.description}</p>
            </div>


            <BtnRender product={product} deleteProduct={deleteProduct} />
        </div>
    )
}

export default ProductItem
