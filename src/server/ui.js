export const onOpen = () => {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Metadata", "openMetadataDialog")
    .addItem("Publish", "publish")
    .addSeparator()
    .addItem("Settings", "openSettings")
    .addItem("About", "openAboutDialog")
    .addToUi()
}

export const openMetadataDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile("metadata")
    .setWidth(500)
    .setHeight(400)
  DocumentApp.getUi().showModalDialog(html, "Metadata")
}

export const openAboutDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile("about")
    .setWidth(300)
    .setHeight(370)
  DocumentApp.getUi().showModalDialog(html, "About")
}

const BUILD_WEBHOOK_URL_KEY = "build-webhook-url"

export const openSettings = () => {
  const ui = DocumentApp.getUi()
  const userProperties = PropertiesService.getUserProperties()
  let buildWebhookURL = userProperties.getProperty(BUILD_WEBHOOK_URL_KEY)

  const response = ui.prompt(
    "Publish settings",
    `Builds Webhook:${
      buildWebhookURL ? `\n(current: ${buildWebhookURL})` : ""
    }`,
    ui.ButtonSet.OK_CANCEL
  )

  if (response.getSelectedButton() === ui.Button.OK) {
    buildWebhookURL = response.getResponseText().trim()
    if (buildWebhookURL) {
      userProperties.setProperty(BUILD_WEBHOOK_URL_KEY, buildWebhookURL)
    }
  }
}

export const publish = () => {
  const ui = DocumentApp.getUi()
  const userProperties = PropertiesService.getUserProperties()
  const buildWebhookURL = userProperties.getProperty(BUILD_WEBHOOK_URL_KEY)

  if (!buildWebhookURL) {
    ui.alert('Go to "Gatsby -> Settings" menu to add your Builds Webhook URL')
    return
  }

  UrlFetchApp.fetch(buildWebhookURL, {
    method: "POST",
  })
}
