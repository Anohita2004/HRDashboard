// src/components/ExcelUploader.jsx
import * as XLSX from "xlsx"

export default function ExcelUploader({ onData }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result)
      const workbook = XLSX.read(data, { type: "array" })

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" })

      onData(json)
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <input
      type="file"
      accept=".xlsx, .xls"
      onChange={handleFileUpload}
      className="p-2 border rounded"
    />
  )
}
