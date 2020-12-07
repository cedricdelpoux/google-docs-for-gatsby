import React from "react"
import {Link} from "gatsby"

import {useSiteMetadata} from "../utils/use-site-metadata"

export const Sidebar = () => {
  const {title} = useSiteMetadata()

  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <div className="sidebar-logo">
          <Link to="/" className="logo">
            {title}
          </Link>
        </div>

        <menu className="sidebar-menu">
          <li className="menu-items">
            <Link to="/" className="menu-links" activeClassName="active">
              Home
            </Link>
          </li>
          <li className="menu-items">
            <Link to="/terms" className="menu-links" activeClassName="active">
              Terms of Service
            </Link>
          </li>
          <li className="menu-items">
            <Link to="/privacy" className="menu-links" activeClassName="active">
              Privacy Policy
            </Link>
          </li>
        </menu>

        <div className="btn-group">
          <Link to="/" className="mob-menu-items" activeClassName="active">
            <button className="navbtn">Home</button>
          </Link>
          <Link to="/terms" className="mob-menu-items" activeClassName="active">
            <button className="navbtn">Terms of Service</button>
          </Link>
          <Link
            to="/privacy"
            className="mob-menu-items"
            activeClassName="active"
          >
            <button className="navbtn">Privacy Policy</button>
          </Link>
        </div>
      </div>
    </aside>
  )
}
