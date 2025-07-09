// lib/auth.js

function getBasicAuthHeader() {
  const user = process.env.NEXT_PUBLIC_AUTH_USER || ""
  const pass = process.env.NEXT_PUBLIC_AUTH_PASS || ""
  const token = typeof window !== "undefined"
    ? btoa(`${user}:${pass}`)
    : Buffer.from(`${user}:${pass}`).toString("base64") // ถ้า run ฝั่ง server
  return `Basic ${token}`
}

export async function login({ email, password }) {
  const url = process.env.NEXT_PUBLIC_API_URL_LOGIN || "/api/login"

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": getBasicAuthHeader(),
      },
      body: JSON.stringify({ Account: email, password }), // ตามตัวอย่าง curl ใช้ key "Account" นะครับ
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    return await response.json()
  } catch (err) {
    throw err
  }
}

export async function register(signupData) {
  let URL_API_URL = ''
  if (signupData.role === "Reader") {
    URL_API_URL = `${process.env.NEXT_PUBLIC_API_URL_REGISTER_READER}`
  } else {
    URL_API_URL = `${process.env.NEXT_PUBLIC_API_URL_REGISTER_WRITER}`
  }

  const res = await fetch(URL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(
        `${process.env.NEXT_PUBLIC_AUTH_USER}:${process.env.NEXT_PUBLIC_AUTH_PASS}`
      )}`,
    },
    body: JSON.stringify(signupData),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Register failed")
  }

  const json = await res.json()
  return {
    statusCode: res.status,
    ...json
  }
}
