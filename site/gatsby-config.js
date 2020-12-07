module.exports = {
  pathPrefix: "/google-docs-for-gatsby",
  siteMetadata: {
    title: `Docs for Gatsby`,
    description: `Manage and publish your Gatsby website from Google Docs`,
    author: `Cédric Delpoux`,
    siteUrl: `https://gatsby-starter-fresh.netlify.app`,
  },
  plugins: [
    "gatsby-plugin-slug",
    "gatsby-plugin-remove-trailing-slashes",
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-images",
          "gatsby-remark-external-links",
        ],
      },
    },
  ],
}
