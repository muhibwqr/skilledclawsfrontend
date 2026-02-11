import { Outlet, useNavigate } from 'react-router-dom'
import { Layout } from './Layout'
import Dock from './Dock'

const GITHUB_URL = 'https://github.com/muhibwqr/skilledclaws'
const CONTACT_URL = 'mailto:hello@skilledclaws.com'

export function AppLayout() {
  const navigate = useNavigate()

  const dockItems = [
    { label: 'home', onClick: () => navigate('/') },
    { label: 'past-skills', onClick: () => navigate('/past-skills') },
    { label: 'star', onClick: () => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer') },
    { label: 'contact', onClick: () => window.open(CONTACT_URL, '_blank', 'noopener,noreferrer') },
  ]

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Dock
        items={dockItems}
        panelHeight={64}
        baseItemSize={48}
        magnification={72}
      />
    </>
  )
}
