import axios from 'axios';
import { throws } from 'node:assert';
import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {

    const storagedCart = localStorage.getItem("@RocketShoes:cart");

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];

  });

  const addProduct = async (productId: number) => {
    try {
      const productAlreadyInCart = cart.find(cartProduct => cartProduct.id === productId);
      
      if(productAlreadyInCart){
        updateProductAmount({productId, amount: productAlreadyInCart.amount + 1});
        return
      } else {

      const { data: product }  = await api.get(`/products/${productId}`);
        
      setCart(prevCart => [...prevCart, {...product, amount: 1}]);
      
      localStorage.setItem("@RocketShoes:cart", JSON.stringify([...cart,  {...product, amount: 1}]));
      return
      }

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productExists = cart.some(cartProduct => cartProduct.id === productId);
      
      if(!productExists) {
        toast.error('Erro na remoção do produto');
        return
      }

      const updatedCart = cart.filter(cartItem => cartItem.id !== productId)
      setCart(updatedCart)

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(updatedCart));
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount > 1) {

      const { data : productOnStock }  = await api.get(`/stock/${productId}`);

      if(amount > productOnStock.amount) return toast.error('Quantidade solicitada fora de estoque');

      const products = cart.map((product : Product) => {
        if(product.id === productId){
          return ({ ...product, amount })
        } else return product
      });
      setCart(products);
      return localStorage.setItem("@RocketShoes:cart", JSON.stringify(products));
    }

    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
