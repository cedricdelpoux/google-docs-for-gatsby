import React from "react"
import {graphql} from "gatsby"

export default ({
  data: {
    page: {html},
  },
}) => {
  return <div dangerouslySetInnerHTML={{__html: html}} />
}

export const pageQuery = graphql`
  query Privacy {
    page: markdownRemark(fields: {slug: {eq: "/PRIVACY"}}) {
      html
    }
  }
`
