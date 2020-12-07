import "./stylesheets/main.css"
import "./stylesheets/mobile.css"

import React from "react"
import {Sidebar} from "./sidebar"
import {Page} from "./page"

export const Layout = ({children}) => {
  return (
    <>
      <Sidebar />
      <Page>{children}</Page>
    </>
  )
}
