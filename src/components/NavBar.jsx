import { NavLink } from 'react-router-dom'
import { useSunday } from '../hooks/useSunday'
import KeyMark from './KeyMark'

export default function NavBar() {
  const { pending } = useSunday()

  const linkClass = ({ isActive }) =>
    `nav__link${isActive ? ' nav__link--active' : ''}`

  return (
    <nav className="nav">
      <NavLink to="/" className="nav__brand" aria-label="Неотправленное — на приём">
        <span className="nav__mark">
          <KeyMark size={26} />
        </span>
      </NavLink>
      <div className="nav__links">
        <NavLink to="/" end className={linkClass}>
          Приём
        </NavLink>
        <NavLink to="/drawer" className={linkClass}>
          Ящик
        </NavLink>
        <NavLink
          to="/sunday"
          className={({ isActive }) =>
            `nav__link${isActive ? ' nav__link--active' : ''}${pending ? ' nav__link--pending' : ''}`
          }
        >
          Возвращение
        </NavLink>
        <NavLink to="/stats" className={linkClass}>
          Учёт
        </NavLink>
      </div>
    </nav>
  )
}
