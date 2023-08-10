import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'

function BtnRender({ product, deleteProduct }) {
    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin
    const [isLogged] = state.userAPI.isLogged
    const addCart = state.userAPI.addCart


    return (
        <div className="row_btn">
            {
                isAdmin ?
                    <>
                        <Link id="btn_buy" to="#!">
                            <button onClick={() => deleteProduct(product._id, product.images.public_id)}>
                                Delete
                            </button>
                        </Link>
                        <Link id="btn_view" to={`/edit_product/${product._id}`}>
                            <button>
                                Edit
                            </button>
                        </Link>
                    </>
                    : <>
                        {
                            !isLogged ?
                                <>
                                    <Link id="btn_buy" to="/login">
                                        <button>Buy</button></Link>
                                </>
                                : <>
                                    <Link id="btn_buy" to="#!" onClick={() => addCart(product)}>
                                        <button>
                                            Add to Card
                                        </button>
                                    </Link>
                                </>
                        }
                        <Link id="btn_view" to={`/detail/${product._id}`}>
                            <button>
                                View Details
                            </button>
                        </Link>
                    </>
            }

        </div>
    )
}

export default BtnRender
