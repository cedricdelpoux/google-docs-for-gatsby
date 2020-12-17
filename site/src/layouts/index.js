import "src/styles/main.css"
import "src/styles/mobile.css"

import React from "react"
import {Sidebar} from "src/components/sidebar"
import {Page} from "src/components/page"

export default ({children}) => {
  return (
    <>
      <Sidebar />
      <Page>{children}</Page>
    </>
  )
}
