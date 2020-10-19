import {Card} from "antd"
import {GithubOutlined} from "@ant-design/icons"
import React from "react"
import ReactDOM from "react-dom"

const About = () => {
  return (
    <Card
      cover={
        <img
          src="https://raw.githubusercontent.com/cedricdelpoux/gatsby-source-google-docs/master/logo.png"
          style={{padding: "16px 16px 0", width: "100%"}}
        />
      }
      actions={[
        <a
          key="github"
          href="https://github.com/cedricdelpoux/google-docs-for-gatsby"
          target="_blank"
          rel="noreferrer"
        >
          <GithubOutlined />
          {" Docs add-on"}
        </a>,
        <a
          key="github"
          href="https://github.com/cedricdelpoux/gatsby-source-google-docs"
          target="_blank"
          rel="noreferrer"
        >
          <GithubOutlined />
          {" Gatsby plugin"}
        </a>,
      ]}
    >
      <Card.Meta
        title="Gatsby + Google Docs"
        description="Docs for Gatsby add-on help you manage your documents metadata and publish your Gatsby website, when using gatsby-source-google-docs plugin, directly from Google Docs."
      />
    </Card>
  )
}

ReactDOM.render(<About />, document.getElementById("index"))
