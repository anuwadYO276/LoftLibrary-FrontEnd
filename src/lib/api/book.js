function getBasicAuthHeader() {
  const user = process.env.NEXT_PUBLIC_AUTH_USER || ""
  const pass = process.env.NEXT_PUBLIC_AUTH_PASS || ""
  const token = typeof window !== "undefined"
    ? btoa(`${user}:${pass}`)
    : Buffer.from(`${user}:${pass}`).toString("base64")
  return `Basic ${token}`
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// สมมติว่าฟังก์ชันนี้ได้รับ author_id จาก caller หรือ context
// เช่น createBook(data, authorId)
export async function createBook(data) {
  const formData = new FormData()
  console.log("Creating book with data:", data)
  console.log("Author ID:", data.authorId)
  formData.append("title", data.name || data.title) // fallback กรณีชื่อ property ต่างกัน
  formData.append("description", data.description)
  formData.append("release_date", data.releaseDate || data.release_date)
  formData.append("status", data.status)
  formData.append("price_per_chapter", data.pricePerChapter || 0) // fallback กรณีไม่มีค่า
  formData.append("author_id", data.authorId)

  // แปลง categories เป็น string เดียว คั่นด้วย comma
  if (data.categories && data.categories.length > 0) {
    const categoriesString = data.categories.map(cat => cat.value || cat).join(",")
    formData.append("category", categoriesString)
  }


  if (data.coverFile) {
    formData.append("cover", data.coverFile)
  }

  const res = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader()
    },
    body: formData,
  })

  console.log("Creating book with data:", res)
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to create book")
  }

  return await res.json()
}


export async function updateBook(id, data, authorId) {
  const formData = new FormData()
  formData.append("title", data.name)
  formData.append("description", data.description)
  formData.append("release_date", data.releaseDate)
  formData.append("status", data.status)

  if (data.categories && data.categories.length > 0) {
    const categoriesString = data.categories.map(cat => cat.value).join(",")
    formData.append("category", categoriesString)
  }

  formData.append("author_id", authorId)

  if (data.coverFile) {
    formData.append("cover", data.coverFile)
  }

  const res = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: "PUT",
    headers: {
      Authorization: getBasicAuthHeader()
    },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || "Failed to update book")
  }

  return await res.json()
}
