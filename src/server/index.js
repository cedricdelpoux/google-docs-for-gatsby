import * as ui from "./ui"
import * as drive from "./drive"

// Ui
global.onOpen = ui.onOpen
global.openMetadataDialog = ui.openMetadataDialog
global.openAboutDialog = ui.openAboutDialog
global.openSettings = ui.openSettings
global.publish = ui.publish

// Drive
global.getDriveDescription = drive.getDescription
global.setDriveDescription = drive.setDescription
global.getDriveCreatedDate = drive.getCreatedDate
