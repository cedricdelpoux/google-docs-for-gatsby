import React, {useEffect} from "react"
import ReactDOM from "react-dom"

import googleAppsScript from "../google-apps-script"

const {FILENAME, PORT} = process.env

const DevServer = () => {
  const iframe = React.useRef(null)
  useEffect(() => {
    const handleRequest = (event) => {
      const request = event.data
      const {type, functionName, id, args} = request

      if (type !== "REQUEST") return

      googleAppsScript[functionName](...args)
        .then((response) => {
          iframe.current.contentWindow.postMessage(
            {type: "RESPONSE", id, status: "SUCCESS", response},
            `https://localhost:${PORT}`
          )
        })
        .catch((err) => {
          iframe.current.contentWindow.postMessage(
            {
              type: "RESPONSE",
              id,
              status: "ERROR",
              response: err,
            },
            `https://localhost:${PORT}`
          )
        })
    }

    window.addEventListener("message", handleRequest, false)
  }, [])

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <iframe
        style={{
          width: "100%",
          height: "100%",
          border: "0",
          position: "absolute",
        }}
        ref={iframe}
        src={`https://localhost:${PORT}/gas/${FILENAME}-impl.html`}
      />
    </div>
  )
}

ReactDOM.render(<DevServer />, document.getElementById("index"))
