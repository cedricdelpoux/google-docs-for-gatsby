export const getFile = () => {
  const fileID = DocumentApp.getActiveDocument().getId()
  return DriveApp.getFileById(fileID)
}

export const getDescription = () => {
  return getFile().getDescription()
}

export const setDescription = (description) => {
  if (description) {
    getFile().setDescription(description)
  }
}

export const getCreatedDate = () => {
  const date = getFile().getDateCreated()
  return date.toISOString()
}
