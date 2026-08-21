// ============================================
// PRODUCTS MANAGER
// Full CRUD for products
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
  X,
} from 'lucide-react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  technologies: string[];
  status: string;
  featured: boolean;
}

const API_URL = 'http://localhost:5000/api';

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    features: '',
    technologies: '',
    status: 'development',
    featured: false,
  });

  // ============================================
  // FETCH PRODUCTS
  // ============================================

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  // ============================================
  // HANDLE FORM INPUT
  // ============================================

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  // ============================================
  // ADD NEW PRODUCT
  // ============================================

  const handleAddNew = () => {
    setEditingProduct(null);

    setFormData({
      name: '',
      tagline: '',
      description: '',
      features: '',
      technologies: '',
      status: 'development',
      featured: false,
    });

    setShowModal(true);
  };

  // ============================================
  // EDIT PRODUCT
  // ============================================

  const handleEdit = (product: Product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      features: product.features.join(', '),
      technologies: product.technologies.join(', '),
      status: product.status,
      featured: product.featured,
    });

    setShowModal(true);
  };

  // ============================================
  // SAVE PRODUCT
  // Create or update
  // ============================================

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      const features = formData.features
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean);

      const technologies = formData.technologies
        .split(',')
        .map((technology) => technology.trim())
        .filter(Boolean);

      const productData = {
        ...formData,
        features,
        technologies,
      };

      if (editingProduct) {
        await axios.put(
          `${API_URL}/products/${editingProduct._id}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/products`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setShowModal(false);
      setEditingProduct(null);

      await fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  // ============================================
  // DELETE PRODUCT
  // ============================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`${API_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  // ============================================
  // TOGGLE FEATURED
  // ============================================

  const handleToggleFeatured = async (product: Product) => {
    try {
      const token = localStorage.getItem('token');

      await axios.patch(
        `${API_URL}/products/${product._id}/featured`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProducts();
    } catch (error) {
      console.error(
        'Failed to toggle featured:',
        error
      );
    }
  };

  // ============================================
  // FILTER PRODUCTS
  // ============================================

  const filteredProducts = products.filter((product) =>
    product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Products Manager
          </h2>

          <p className="text-gray-400">
            Manage your software products
          </p>
        </div>

        <motion.button
          type="button"
          onClick={handleAddNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </motion.button>

      </div>

      {/* ========================================
          SEARCH
      ======================================== */}

      <div className="relative">

        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 bg-gray-900 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

      </div>

      {/* ========================================
          PRODUCTS
      ======================================== */}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">

          <Search className="w-10 h-10 text-gray-600 mx-auto mb-4" />

          <h3 className="text-lg font-semibold text-white mb-2">
            {searchTerm
              ? 'No products found'
              : 'No products yet'}
          </h3>

          <p className="text-gray-500">
            {searchTerm
              ? 'Try a different search term.'
              : 'Create your first product to get started.'}
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredProducts.map((product) => (
            <motion.div
              key={product._id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >

              {/* Product header */}

              <div className="flex items-center justify-between mb-4">

                <h3 className="text-lg font-bold text-white truncate pr-3">
                  {product.name}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    handleToggleFeatured(product)
                  }
                  className={`p-1 rounded transition-colors ${
                    product.featured
                      ? 'text-yellow-500'
                      : 'text-gray-500 hover:text-yellow-500'
                  }`}
                  aria-label={
                    product.featured
                      ? 'Remove from featured'
                      : 'Mark as featured'
                  }
                >
                  <Star
                    className="w-5 h-5"
                    fill={
                      product.featured
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                </button>

              </div>

              {/* Tagline */}

              <p className="text-gray-400 text-sm mb-2">
                {product.tagline}
              </p>

              {/* Description */}

              <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                {product.description}
              </p>

              {/* Features */}

              {product.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">

                  {product.features.map(
                    (feature, index) => (
                      <span
                        key={`${feature}-${index}`}
                        className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500"
                      >
                        {feature}
                      </span>
                    )
                  )}

                </div>
              )}

              {/* Technologies */}

              {product.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">

                  {product.technologies.map(
                    (technology, index) => (
                      <span
                        key={`${technology}-${index}`}
                        className="px-2 py-1 rounded-full text-xs bg-purple-500/10 text-purple-400"
                      >
                        {technology}
                      </span>
                    )
                  )}

                </div>
              )}

              {/* Status + actions */}

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">

                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'launched'
                      ? 'bg-green-500/20 text-green-500'
                      : product.status === 'beta'
                        ? 'bg-blue-500/20 text-blue-500'
                        : product.status === 'maintenance'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-yellow-500/20 text-yellow-500'
                  }`}
                >
                  {product.status}
                </span>

                <div className="flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(product)
                    }
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Edit product"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(product._id)
                    }
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Delete product"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>

                </div>

              </div>

            </motion.div>
          ))}

        </div>
      )}

      {/* ========================================
          ADD / EDIT MODAL
      ======================================== */}

      <AnimatePresence>

        {showModal && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          >

            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
              }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800 max-h-[90vh] overflow-y-auto"
            >

              {/* Modal header */}

              <div className="flex justify-between items-center mb-6">

                <h3 className="text-xl font-bold text-white">
                  {editingProduct
                    ? 'Edit Product'
                    : 'Add Product'}
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              <div className="space-y-4">

                {/* Name */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Product name"
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Tagline */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Tagline
                  </label>

                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    placeholder="Short product tagline"
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Description */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your product..."
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    required
                  />
                </div>

                {/* Features */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Features (comma separated)
                  </label>

                  <input
                    type="text"
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    placeholder="Authentication, Analytics, Dashboard"
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Technologies */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Technologies (comma separated)
                  </label>

                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Status */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="development">
                      Development
                    </option>

                    <option value="beta">
                      Beta
                    </option>

                    <option value="launched">
                      Launched
                    </option>

                    <option value="maintenance">
                      Maintenance
                    </option>
                  </select>
                </div>

                {/* Featured */}

                <div className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-green-500"
                  />

                  <label className="text-sm text-gray-400">
                    Featured Product
                  </label>

                </div>

                {/* Buttons */}

                <div className="flex gap-4 justify-end pt-4">

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    {editingProduct
                      ? 'Update'
                      : 'Create'}
                  </button>

                </div>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default ProductsManager;