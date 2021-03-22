import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map(product => {
    console.log("productaa", product)
    return ({ 
      ...product,
      subtotal: product.price * (product.amount || 1)
    });
  })

  const total =
    formatPrice(
      cartFormatted.reduce((sumTotal, product) => {
        return sumTotal + product.subtotal
      }, 0)
    )

  function handleProductIncrement(product: Product) {
    console.log(product)
    updateProductAmount({
      productId: product.id,
      amount: (product.amount || 1) + 1
    })
  }

  function handleProductDecrement(product: Product) {
    // console.log(product)
    updateProductAmount({
      productId: product.id,
      amount: product.amount - 1
    })
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {
            cartFormatted.map(product => {
              return (
                <tr data-testid="product" key={product.id}>
                  <td>
                    <img src={product.image} alt={product.title} />
                  </td>
                  <td>
                    <strong>{product.title}</strong>
                    <span>{formatPrice(product.price)}</span>
                  </td>
                  <td>
                    <div>
                      <button
                        type="button"
                        data-testid="decrement-product"
                      disabled={product.amount <= 1}
                      onClick={() => handleProductDecrement(product)}
                      >
                        <MdRemoveCircleOutline size={20} />
                      </button>
                      <input
                        type="text"
                        data-testid="product-amount"
                        readOnly
                        value={product.amount || 1}
                      />
                      <button
                        type="button"
                        data-testid="increment-product"
                        onClick={() => handleProductIncrement(product)}
                      >
                        <MdAddCircleOutline size={20} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <strong>{formatPrice(product.subtotal)}</strong>
                  </td>
                  <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                  onClick={() => handleRemoveProduct(product.id)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
                </tr>
              );
            })
          }
          {/* <tr data-testid="product">
            <td>
              <img src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg" alt="Tênis de Caminhada Leve Confortável" />
            </td>
            <td>
              <strong>Tênis de Caminhada Leve Confortável</strong>
              <span>R$ 179,90</span>
            </td>
            <td>
              <div>
                <button
                  type="button"
                  data-testid="decrement-product"
                // disabled={product.amount <= 1}
                // onClick={() => handleProductDecrement()}
                >
                  <MdRemoveCircleOutline size={20} />
                </button>
                <input
                  type="text"
                  data-testid="product-amount"
                  readOnly
                  value={2}
                />
                <button
                  type="button"
                  data-testid="increment-product"
                // onClick={() => handleProductIncrement()}
                >
                  <MdAddCircleOutline size={20} />
                </button>
              </div>
            </td>
            <td>
              <strong>R$ 359,80</strong>
            </td>
            <td>
              <button
                type="button"
                data-testid="remove-product"
              // onClick={() => handleRemoveProduct(product.id)}
              >
                <MdDelete size={20} />
              </button>
            </td>
          </tr> */}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
