import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {RiLogoutCircleRLine} from 'react-icons/ri'
import './index.css'

const Sidebar = props => {
  const logoutClicked = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/')
  }

  return (
    <div className="sidebar" data-testid="sidebar">
      <Link to="/" className="link-item">
        <img
          src="https://res.cloudinary.com/dgga8cymk/image/upload/v1712240724/1Spotify/Login/remix-logo-sm.png"
          alt="website logo"
          className="website-logo"
        />
      </Link>
      <buton type="button" className="side-logout-btn" onClick={logoutClicked}>
        Logout
        <RiLogoutCircleRLine className="icon" />
      </buton>
    </div>
  )
}

export default withRouter(Sidebar)
