import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

import Home from './pages/Home'
import Brands from './pages/Brands'
import BrandModels from './pages/BrandModels'
import ModelParts from './pages/ModelParts'
import Search from './pages/Search'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmed from './pages/OrderConfirmed'
import Support from './pages/Support'
import Login from './pages/Login'
import Signup from './pages/Signup'

import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminHome from './pages/admin/AdminHome'
import ManageBrands from './pages/admin/ManageBrands'
import ManageModels from './pages/admin/ManageModels'
import ManageParts from './pages/admin/ManageParts'
import Orders from './pages/admin/Orders'
import SupportInbox from './pages/admin/SupportInbox'

export default function App() {
  return (
    <Routes>
      {/* Admin routes have no shared Navbar/Footer — separate experience */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="brands" element={<ManageBrands />} />
        <Route path="models" element={<ManageModels />} />
        <Route path="parts" element={<ManageParts />} />
        <Route path="orders" element={<Orders />} />
        <Route path="support" element={<SupportInbox />} />
      </Route>

      {/* Customer-facing site */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/brands/:brandId" element={<BrandModels />} />
                <Route path="/models/:modelId" element={<ModelParts />} />
                <Route path="/search" element={<Search />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmed" element={<OrderConfirmed />} />
                <Route path="/support" element={<Support />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  )
}
