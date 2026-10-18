
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout'

import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import ProductDetails from './pages/ProductDetails'
import EditProduct from './pages/EditProduct'
import Settings from './pages/Settings'
import Expiring from './pages/Expiring'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard and application pages */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/products"
          element={
            <DashboardLayout>
              <Products />
            </DashboardLayout>
          }
        />

        <Route
          path="/add-product"
          element={
            <DashboardLayout>
              <AddProduct />
            </DashboardLayout>
          }
        />

        <Route
          path="/products/:id/edit"
          element={
            <DashboardLayout>
              <EditProduct />
            </DashboardLayout>
          }
        />

        <Route
          path="/products/:id"
          element={
            <DashboardLayout>
              <ProductDetails />
            </DashboardLayout>
          }
        />

        <Route
          path="/expiring"
          element={
            <DashboardLayout>
              <Expiring />
            </DashboardLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          }
        />

        {/* Unknown URLs go back to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
