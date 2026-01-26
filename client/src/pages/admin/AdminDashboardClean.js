import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axiosConfig'
import AuthContext from '../../context/AuthContext'
import { useToast } from '../../components/common/Toast'
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiBarChart2,
  FiGrid,
  FiTag,
  FiSettings,
  FiMessageSquare,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi'
import './AdminDashboard.clean.css'

// Separate components for better organization
const StatCard = ({ icon: Icon, title, value, change, changeLabel, colorClass }) => (
  <div className="stat-card-clean">
    <div className="stat-card-header">
      <div className={`stat-icon ${colorClass}`}>
        <Icon />
      </div>
    </div>
    <div className="stat-title">{title}</div>
    <div className="stat-value">{value?.toLocaleString() || '0'}</div>
    {change && (
      <div className="stat-footer">
        <span className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        <span className="stat-change-label">{changeLabel}</span>
      </div>
    )}
  </div>
)

const StatusBadge = ({ status }) => {
  const statusMap = {
    confirmed: { label: 'Confirmed', class: 'info' },
    processing: { label: 'Processing', class: 'warning' },
    delivered: { label: 'Delivered', class: 'success' },
    cancelled: { label: 'Cancelled', class: 'danger' },
    pending: { label: 'Pending', class: 'warning' },
    approved: { label: 'Approved', class: 'success' },
    rejected: { label: 'Rejected', class: 'danger' },
  }
  
  const badge = statusMap[status] || { label: status, class: 'gray' }
  
  return (
    <span className={`status-badge ${badge.class}`}>
      {badge.label}
    </span>
  )
}

const AdminDashboardClean = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardStats, setDashboardStats] = useState(null)

  // Data states
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Chỉ Admin mới có quyền truy cập!')
      navigate('/')
      return
    }
    fetchDashboardData()
  }, [user])

  useEffect(() => {
    setCurrentPage(1)
    if (activeTab === 'products') fetchProducts(1)
    else if (activeTab === 'orders') fetchOrders(1)
    else if (activeTab === 'users') fetchUsers(1)
    else if (activeTab === 'reviews') fetchReviews(1)
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'products') fetchProducts(currentPage)
    else if (activeTab === 'orders') fetchOrders(currentPage)
    else if (activeTab === 'users') fetchUsers(currentPage)
    else if (activeTab === 'reviews') fetchReviews(currentPage)
  }, [currentPage])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/admin/stats')
      setDashboardStats(res.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Không thể tải dữ liệu dashboard')
      setLoading(false)
    }
  }

  const fetchProducts = async (page = 1) => {
    try {
      const res = await axios.get(`/admin/products?page=${page}&limit=10`)
      setProducts(res.data.products || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (error) {
      toast.error('Không thể tải danh sách sản phẩm')
    }
  }

  const fetchOrders = async (page = 1) => {
    try {
      const res = await axios.get(`/admin/orders?page=${page}&limit=10`)
      setOrders(res.data.orders || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng')
    }
  }

  const fetchUsers = async (page = 1) => {
    try {
      const res = await axios.get(`/admin/users?page=${page}&limit=10`)
      setUsers(res.data.users || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng')
    }
  }

  const fetchReviews = async (page = 1) => {
    try {
      const res = await axios.get(`/admin/reviews?page=${page}&limit=10`)
      setReviews(res.data.reviews || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (error) {
      toast.error('Không thể tải danh sách đánh giá')
    }
  }

  // Action handlers
  const handleToggleFeatured = async (productId, currentStatus) => {
    try {
      await axios.put(`/admin/products/${productId}/toggle-featured`)
      toast.success(currentStatus ? 'Đã bỏ nổi bật' : 'Đã đánh dấu nổi bật')
      fetchProducts(currentPage)
    } catch (error) {
      toast.error('Không thể cập nhật sản phẩm')
    }
  }

  const handleApprovePartner = async (userId) => {
    try {
      await axios.put(`/admin/users/${userId}/approve`)
      toast.success('Đã duyệt Partner thành công!')
      fetchUsers(currentPage)
    } catch (error) {
      toast.error('Không thể duyệt Partner')
    }
  }

  const handleToggleUserStatus = async (userId) => {
    try {
      await axios.put(`/admin/users/${userId}/toggle-status`)
      toast.success('Đã cập nhật trạng thái người dùng')
      fetchUsers(currentPage)
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleModerateReview = async (reviewId, isApproved) => {
    try {
      await axios.put(`/admin/reviews/${reviewId}/moderate`, { isApproved })
      toast.success(isApproved ? 'Đã duyệt đánh giá' : 'Đã từ chối đánh giá')
      fetchReviews(currentPage)
    } catch (error) {
      toast.error('Không thể cập nhật đánh giá')
    }
  }

  if (loading) {
    return (
      <div className="admin-loading-clean">
        <div className="spinner-clean"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    )
  }

  const stats = dashboardStats?.stats || {}

  return (
    <div className="admin-dashboard-clean">
      {/* Header */}
      <header className="admin-header-clean">
        <div className="admin-header-left">
          <div className="admin-logo">ShoeStore</div>
          <div className="admin-title">Administration</div>
        </div>
        <div className="admin-header-right">
          <div className="admin-user-badge">
            <div className="admin-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="admin-user-details">
              <div className="admin-username">{user?.username || 'Admin'}</div>
              <div className="admin-role-tag">Administrator</div>
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="admin-layout-clean">
        {/* Sidebar */}
        <aside className="admin-sidebar-clean">
          <nav className="sidebar-nav-clean">
            <div className="nav-section-title">Overview</div>
            <button
              className={`nav-item-clean ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FiBarChart2 />
              <span>Dashboard</span>
            </button>

            <div className="nav-section-title">Management</div>
            <button
              className={`nav-item-clean ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FiUsers />
              <span>Users</span>
              <span className="nav-badge">{stats.totalUsers || 0}</span>
            </button>
            <button
              className={`nav-item-clean ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <FiPackage />
              <span>Products</span>
              <span className="nav-badge">{stats.totalProducts || 0}</span>
            </button>
            <button
              className={`nav-item-clean ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FiShoppingBag />
              <span>Orders</span>
              <span className="nav-badge">{stats.totalOrders || 0}</span>
            </button>
            <button
              className={`nav-item-clean ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <FiMessageSquare />
              <span>Reviews</span>
              <span className="nav-badge">{stats.totalReviews || 0}</span>
            </button>

            <div className="nav-section-title">Catalog</div>
            <button
              className={`nav-item-clean ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <FiGrid />
              <span>Categories</span>
            </button>
            <button
              className={`nav-item-clean ${activeTab === 'brands' ? 'active' : ''}`}
              onClick={() => setActiveTab('brands')}
            >
              <FiTag />
              <span>Brands</span>
            </button>

            <div className="nav-section-title">System</div>
            <button
              className={`nav-item-clean ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-content-clean">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="stats-grid-clean">
                <StatCard
                  icon={FiDollarSign}
                  title="Total Revenue"
                  value={stats.totalRevenue}
                  colorClass="green"
                />
                <StatCard
                  icon={FiShoppingBag}
                  title="Total Orders"
                  value={stats.totalOrders}
                  colorClass="blue"
                />
                <StatCard
                  icon={FiPackage}
                  title="Products"
                  value={stats.totalProducts}
                  colorClass="purple"
                />
                <StatCard
                  icon={FiUsers}
                  title="Users"
                  value={stats.totalUsers}
                  colorClass="cyan"
                />
              </div>

              {/* Quick Stats */}
              <div className="stats-grid-clean" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <StatCard
                  icon={FiAlertCircle}
                  title="Out of Stock"
                  value={stats.outOfStockProducts}
                  colorClass="red"
                />
                <StatCard
                  icon={FiClock}
                  title="Low Stock"
                  value={stats.lowStockProducts}
                  colorClass="orange"
                />
                <StatCard
                  icon={FiUsers}
                  title="Pending Partners"
                  value={stats.pendingPartners}
                  colorClass="orange"
                />
                <StatCard
                  icon={FiMessageSquare}
                  title="Pending Reviews"
                  value={stats.pendingReviews}
                  colorClass="blue"
                />
                <StatCard
                  icon={FiCheckCircle}
                  title="Delivered Orders"
                  value={stats.deliveredOrders}
                  colorClass="green"
                />
                <StatCard
                  icon={FiClock}
                  title="Pending Orders"
                  value={stats.pendingOrders}
                  colorClass="orange"
                />
              </div>

              {/* Alerts Section */}
              {(stats.pendingPartners > 0 || stats.lowStockProducts > 0) && (
                <div className="data-section-clean">
                  <div className="data-section-header">
                    <h3 className="data-section-title">
                      <FiAlertCircle />
                      Requires Attention
                    </h3>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    {stats.pendingPartners > 0 && (
                      <div style={{ padding: '0.75rem', background: 'var(--admin-gray-50)', borderRadius: '8px', marginBottom: '1rem' }}>
                        <strong>{stats.pendingPartners}</strong> partner approval{stats.pendingPartners > 1 ? 's' : ''} pending
                      </div>
                    )}
                    {stats.lowStockProducts > 0 && (
                      <div style={{ padding: '0.75rem', background: 'var(--admin-gray-50)', borderRadius: '8px' }}>
                        <strong>{stats.lowStockProducts}</strong> product{stats.lowStockProducts > 1 ? 's' : ''} low on stock
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'products' && (
            <div className="data-section-clean">
              <div className="data-section-header">
                <h3 className="data-section-title">
                  <FiPackage />
                  Products Management
                </h3>
              </div>
              <table className="data-table-clean">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6">
                        <div className="empty-state-clean">
                          <div className="empty-state-icon"><FiPackage /></div>
                          <div className="empty-state-text">No products found</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id}>
                        <td className="text-bold">{product.name}</td>
                        <td className="text-muted">{product.brand}</td>
                        <td>
                          {product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0}
                        </td>
                        <td>{product.basePrice?.toLocaleString()}đ</td>
                        <td>
                          {product.isFeatured ? (
                            <span className="status-badge success">Featured</span>
                          ) : (
                            <span className="status-badge gray">Normal</span>
                          )}
                        </td>
                        <td>
                          <div className="actions-group">
                            <button
                              className="btn-clean btn-sm btn-secondary"
                              onClick={() => handleToggleFeatured(product._id, product.isFeatured)}
                            >
                              {product.isFeatured ? 'Unfeature' : 'Feature'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="pagination-clean">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="data-section-clean">
              <div className="data-section-header">
                <h3 className="data-section-title">
                  <FiShoppingBag />
                  Orders Management
                </h3>
              </div>
              <table className="data-table-clean">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="empty-state-clean">
                          <div className="empty-state-icon"><FiShoppingBag /></div>
                          <div className="empty-state-text">No orders found</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td className="text-bold">#{order._id.slice(-8)}</td>
                        <td>{order.user?.username || order.user?.email || 'N/A'}</td>
                        <td>{order.totalAmount?.toLocaleString()}đ</td>
                        <td><StatusBadge status={order.status} /></td>
                        <td className="text-muted text-sm">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="pagination-clean">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="data-section-clean">
              <div className="data-section-header">
                <h3 className="data-section-title">
                  <FiUsers />
                  Users Management
                </h3>
              </div>
              <table className="data-table-clean">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="empty-state-clean">
                          <div className="empty-state-icon"><FiUsers /></div>
                          <div className="empty-state-text">No users found</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td className="text-bold">{u.username}</td>
                        <td className="text-muted text-sm">{u.email}</td>
                        <td>
                          <span className={`status-badge ${u.role === 'admin' ? 'danger' : u.role === 'partner' ? 'info' : 'gray'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          {u.role === 'partner' && !u.isApproved ? (
                            <span className="status-badge warning">Pending</span>
                          ) : u.isActive === false ? (
                            <span className="status-badge danger">Inactive</span>
                          ) : (
                            <span className="status-badge success">Active</span>
                          )}
                        </td>
                        <td>
                          <div className="actions-group">
                            {u.role === 'partner' && !u.isApproved && (
                              <button
                                className="btn-clean btn-sm btn-success"
                                onClick={() => handleApprovePartner(u._id)}
                              >
                                Approve
                              </button>
                            )}
                            <button
                              className="btn-clean btn-sm btn-secondary"
                              onClick={() => handleToggleUserStatus(u._id)}
                            >
                              {u.isActive === false ? 'Activate' : 'Deactivate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="pagination-clean">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="data-section-clean">
              <div className="data-section-header">
                <h3 className="data-section-title">
                  <FiMessageSquare />
                  Reviews Management
                </h3>
              </div>
              <table className="data-table-clean">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="empty-state-clean">
                          <div className="empty-state-icon"><FiMessageSquare /></div>
                          <div className="empty-state-text">No reviews found</div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review) => (
                      <tr key={review._id}>
                        <td>{review.user?.username || 'Anonymous'}</td>
                        <td className="text-muted text-sm">{review.product?.name || 'N/A'}</td>
                        <td>
                          <span style={{ color: '#f59e0b' }}>★</span> {review.rating}/5
                        </td>
                        <td>
                          <StatusBadge status={review.isApproved ? 'approved' : 'pending'} />
                        </td>
                        <td>
                          <div className="actions-group">
                            {!review.isApproved && (
                              <button
                                className="btn-clean btn-sm btn-success"
                                onClick={() => handleModerateReview(review._id, true)}
                              >
                                Approve
                              </button>
                            )}
                            <button
                              className="btn-clean btn-sm btn-danger"
                              onClick={() => handleModerateReview(review._id, false)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="pagination-clean">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {(activeTab === 'categories' || activeTab === 'brands' || activeTab === 'settings') && (
            <div className="data-section-clean">
              <div className="data-section-header">
                <h3 className="data-section-title">
                  {activeTab === 'categories' && <><FiGrid /> Categories Management</>}
                  {activeTab === 'brands' && <><FiTag /> Brands Management</>}
                  {activeTab === 'settings' && <><FiSettings /> System Settings</>}
                </h3>
              </div>
              <div className="empty-state-clean">
                <div className="empty-state-icon"><FiSettings /></div>
                <div className="empty-state-text">Feature coming soon</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardClean
