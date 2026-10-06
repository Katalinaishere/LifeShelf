
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout'

import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import AddProduct from './pages/AddProduct'
import ProductDetails from './pages/ProductDetails'
import EditProduct from './pages/EditProduct'
import Settings from './pages/Settings'

function Usage() {
  return <h1>Usage</h1>
}

function Analytics() {
  return <h1>Analytics</h1>
}

function Expiring() {
  return <h1>Expiring</h1>
}

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/usage" element={<Usage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/expiring" element={<Expiring />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  )
}

export default App