import React, { useEffect, useState } from "react";
import { commerce } from "./lib/commerce";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import Products from './components/products/Products'
// import Navbar from './components/navbar/Navbar'

import { Products, Navbar, Cart, Checkout } from "./components";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  const fetchCart = async () => {
    const data = await commerce.cart.retrieve();
    setCart(data);
    // console.log(`esta es mi data: ${data.line_items.length}`);
  };

  const handleAddToCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);

    setCart(item.cart);
  };

  const handleUpdateCart = async (productId, quantity) =>{
    const { cart } = await commerce.cart.update(productId, {quantity});

    setCart(cart);
  }

  const handleRemoveCart = async (productId) =>{
    const { cart } = await commerce.cart.remove(productId);

    setCart(cart);
  }

  const handleEmptyCart = async (productId) =>{
    const { cart } = await commerce.cart.empty(productId);

    setCart(cart);
  }

  const refreshCart = async () =>{
    const newCart = await commerce.cart.refresh()

    setCart(newCart)
  }

  const handleCaptureCheckout = async (CheckoutTokenId, newOrder)=>{
    try {
      const incomingOrder = await commerce.checkout.capture(CheckoutTokenId, newOrder)

      setOrder(incomingOrder)
      refreshCart()
    } catch (error) {
      setErrorMessage(error.data.error.message)
    }
  }


  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // console.log(cart);

  return (
    <Router>
      <div>
        <Navbar totalItems={cart.total_items} />
        <Switch>
          <Route exact path='/' >
            <Products products={products} onAddToCart={handleAddToCart} />
          </Route>
          <Route exact path='/cart'>
            <Cart 
            cart={cart} 
            handleUpdateCart={handleUpdateCart}
            handleRemoveCart={handleRemoveCart}
            handleEmptyCart={handleEmptyCart}
            />
          </Route>
          <Route exact path='/checkout'>
            <Checkout 
            cart={cart}
            order={order}
            onCaptureCheckout={handleCaptureCheckout}
            error={errorMessage}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
