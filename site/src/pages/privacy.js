import React from "react"
import {graphql} from "gatsby"
import {Layout} from "../components/layout"

export default ({
  data: {
    page: {html},
  },
}) => {
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{__html: html}} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query Privacy {
    page: markdownRemark(fields: {slug: {eq: "/PRIVACY"}}) {
      html
    }
  }
`
