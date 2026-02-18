import './App.css';
import Header from './component/layout/Header/Header.js'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WebFont from 'webfontloader';
import React, { useState } from 'react';
import Footer from './component/layout/Footer/Footer.js'
import Home from './component/Home/Home.js'
import ProductDetails from './component/Product/ProductDetails.js'
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'
import LoginSignUp from './component/User/LoginSignUp';
import Profile from './component/User/Profile.js'
import store from './store.js'
import { loadUser } from './actions/userAction';
import UserOptions from './component/layout/Header/UserOptions.js'
import { useSelector } from 'react-redux';
import ProtectedRoute from './component/Route/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ResetPassword from './component/User/ResetPassword';
import ForgotPassword from './component/User/ForgotPassword';
import Cart from './component/Cart/Cart.js'
import Shipping from './component/Cart/Shipping.js';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import axios from 'axios';
import Payment from './component/Cart/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'
import OrderSuccess from './component/Cart/OrderSuccess.js'
import MyOrders from './component/Order/MyOrders';
import OrderDetails from './component/Order/OrderDetails';
import Dashboard from './component/admin/Dashboard.js'
import ProductList from './component/admin/ProductList.js'
import UpdateProduct from './component/admin/UpdateProduct.js'
import NewProduct from './component/admin/NewProduct.js'
import OrderList from './component/admin/OrderList';
import ProcessOrder from './component/admin/ProcessOrder';
import UnknowParams from './component/layout/UnknowParams.js'
import UsersList from './component/admin/UsersList';
import UpdateUser from './component/admin/UpdateUser';
import ProductReviews from './component/admin/ProductReviews';
import NotFound from './component/layout/Not Found/NotFound.js';
import About from './component/layout/About/About.js'
import Contact from './component/layout/Contact/Contact.js'
import { CgWindows } from 'react-icons/cg';

function App() {


    // document.addEventListener('contextmenu', (e)=> e.preventDefault());

    const { isAuthenticated, user } = useSelector((state) => state.user);

    const [stripeApiKey, setStripeApiKey] = useState('');
    // console.log("stripeapikey: ",stripeApiKey);

    async function getStripeApiKey() {
        // console.log('running getstripeapikey method');
        const { data } = await axios.get('/api/v1/stripeapikey');
        setStripeApiKey(data.stripeApiKey)
    }

    React.useEffect(() => {

        WebFont.load({
            google: {
                families: ["Roboto", "Droid Sans", "Chilanka"]
            }
        })
        
        store.dispatch(loadUser());
        console.log(isAuthenticated)
        
    }, [])
    
    if(isAuthenticated){
       
        getStripeApiKey();
    }
    // document.addEventListener('contextmenu', (e)=> e.preventDefault());

    return (
        <Router>
            <Header />

            {isAuthenticated && <UserOptions user={user} />}

            {stripeApiKey && (
                <Elements stripe={loadStripe(stripeApiKey)} >
                    <Routes>
                        {isAuthenticated && <Route exact path="/process/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />}
                    </Routes>
                </Elements>
            )}

            <Routes>

            <Route exact path='/' element={<Home />} />
            <Route exact path="/about" element={<About/>} />
            <Route exact path='/contact' element={<Contact/>} />                
            <Route exact path='/products/' element={<Products />} />
            <Route exact path='/search/' element={<Search />} />
            <Route exact path='/login/' element={<LoginSignUp />} />
            <Route exact path='/product/:id' element={<ProductDetails />} />
            <Route path='/products/:keyword' element={<Products />} />
            
            
            
            
            
            <Route exact path='/account' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route exact path="/me/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
            <Route exact path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
            <Route exact path="/password/forgot/" element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
            <Route exact path="/password/reset/:token" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
            <Route exact path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route exact path="/login/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
            <Route exact path="/order/confirm" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
            <Route exact path="/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route exact path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route exact path="/order/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />


            {isAuthenticated && user.role === "admin" ? <Route exact path="/admin/dashboard" element={<Dashboard />} /> : <Route exact path="/login" element={<LoginSignUp/>} />}
            <Route exact path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
            <Route exact path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
            <Route exact path="/admin/product" element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>}/>
            <Route exact path="/admin/product/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
            <Route exact path="/admin/orders" element={<ProtectedRoute isAdmin={true}><OrderList /></ProtectedRoute>} />
            <Route exact path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><ProcessOrder /></ProtectedRoute>} />
            <Route exact path="/admin/users" element={<ProtectedRoute isAdmin={true}><UsersList /></ProtectedRoute>} />
            <Route exact path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
            <Route exact path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><ProductReviews /></ProtectedRoute>} />

            {/* <Route exact path='*'
                element={
                    window.location.pathname === "/process/payment" ? null : <NotFound />
                }
            /> */}

            
            </Routes>


            <Footer />
        </Router>
    )
}

export default App;

// <Route exact path='/login/account/' element={<Profile/>} />
