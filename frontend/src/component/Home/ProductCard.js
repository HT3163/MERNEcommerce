import React from 'react'
import { Link } from 'react-router-dom'
import { Rating } from '@material-ui/lab';



const ProductCard = ({Product})=> {

  const options = {
    value: Product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <Link className='productCard' to={`/product/${Product._id}`}>
        <img src={Product.images[0] ? Product.images[0].url : "not found" } alt={Product.name} />

        <p>{Product.name}</p>
        <div>
            <Rating {...options} /> {" "}
            <span>({Product.numOfReviews} Reviews)</span>
        </div>
        <span>{`$${Product.price}`}</span>
    </Link>
  )
}

export default ProductCard;
