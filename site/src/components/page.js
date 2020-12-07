import React from "react"

export const Page = ({children}) => {
  return (
    <main className="content">
      <article className="page-article">
        <div className="wrap-content">
          <div className="page-content">{children}</div>
        </div>
      </article>
    </main>
  )
}
