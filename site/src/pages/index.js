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
  query Index {
    page: markdownRemark(fields: {slug: {eq: "/README"}}) {
      html
    }
  }
`
