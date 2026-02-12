import { Outlet, NavLink } from 'react-router-dom'
import { Layout } from './Layout'

const GITHUB_URL = 'https://github.com/muhibwqr/skilledclaws'
const CONTACT_URL = 'mailto:hello@skilledclaws.com'

const navLinkClass = ({ isActive }) =>
  `block py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${
    isActive ? 'bg-[#48484a] text-[#f2f2f7]' : 'text-[#8e8e93] hover:bg-[#3a3a3c] hover:text-[#f2f2f7]'
  }`

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#2d2d2d]">
      <nav className="w-52 shrink-0 border-r border-[#48484a] flex flex-col py-6 px-4 bg-[#2d2d2d]">
        <div className="flex flex-col gap-0.5">
          <NavLink to="/" end className={navLinkClass}>
            home
          </NavLink>
          <NavLink to="/past-skills" className={navLinkClass}>
            past-skills
          </NavLink>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-4 text-sm font-medium text-[#8e8e93] hover:bg-[#3a3a3c] hover:text-[#f2f2f7] rounded-lg transition-colors"
          >
            star
          </a>
          <a
            href={CONTACT_URL}
            className="py-2.5 px-4 text-sm font-medium text-[#8e8e93] hover:bg-[#3a3a3c] hover:text-[#f2f2f7] rounded-lg transition-colors"
          >
            contact
          </a>
        </div>
      </nav>
      <div className="flex-1 flex flex-col min-w-0">
        <Layout>
          <Outlet />
        </Layout>
      </div>
      <div className="fixed bottom-0 left-52 right-0 z-50 flex flex-col items-center justify-end pointer-events-none pb-12">
        <div className="pointer-events-auto flex flex-row items-center justify-center gap-3">
          <p className="text-[#8e8e93] text-xs font-medium pointer-events-none">built by</p>
          <div className="flex items-center -space-x-3">
            <a
              href="https://www.linkedin.com/in/ibrahim-ansari-code/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full border-2 border-[#48484a] relative z-10 hover:opacity-90 transition-opacity"
              aria-label="Ibrahim Ansari on LinkedIn"
            >
              <img
                src="/built-by-1.jpeg"
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/muhibwaqar"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full border-2 border-[#48484a] relative z-0 hover:opacity-90 transition-opacity"
              aria-label="Muhib Waqar on LinkedIn"
            >
              <img
                src="/built-by-2.jpeg"
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
