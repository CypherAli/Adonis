'use client'

export default function CartSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-sidebar-overlay" onClick={onClose} />
      <div className="cart-sidebar-content">
        <div className="cart-sidebar-header">
          <h3>Shopping Cart</h3>
          <button onClick={onClose}>×</button>
        </div>
        <div className="cart-sidebar-body">
          <p>Your cart is empty</p>
        </div>
      </div>
    </div>
  )
}
