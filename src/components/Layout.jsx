import { NavLink } from 'react-router-dom'

export default function Layout({ children, cartCount }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Bright picks • bold style</p>
          <h1>WebComm</h1>
        </div>
        <nav className="nav-links">
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/cart">Cart ({cartCount})</NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
