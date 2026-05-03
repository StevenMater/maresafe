export function downloadZip(blob: Blob, vesselName: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  const today = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `MareSafe - ${vesselName || "card"} - Netherlands - ${today}.zip` // TODO: hardcoded country should be changed to a sailingArea selector
  a.click()
  URL.revokeObjectURL(url)
}
