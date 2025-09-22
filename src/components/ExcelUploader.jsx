// src/components/ExcelUploader.jsx
import { useState } from "react"
import * as XLSX from "xlsx"

export default function ExcelUploader({ onData }) {
  const [error, setError] = useState("")

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ]

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload an Excel file (.xls or .xlsx)")
      e.target.value = "" // reset input
      return
    }

    setError("") // clear previous error

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
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="p-2 border rounded"
      />
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  )
}

