const GHL_BASE = 'https://services.leadconnectorhq.com'

export async function ghlGet(path: string) {
  const res = await fetch(`${GHL_BASE}${path}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GHL GET ${res.status} on ${path}: ${text}`)
  }
  return res.json()
}

export async function ghlPost(path: string, body: object) {
  const res = await fetch(`${GHL_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GHL POST ${res.status} on ${path}: ${text}`)
  }
  return res.json()
}
