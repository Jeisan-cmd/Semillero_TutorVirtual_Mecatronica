import fetch from 'node-fetch'

;(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sIjoiQURNSU4iLCJpYXQiOjE3Njk4MjkzOTMsImV4cCI6MTc2OTg1ODE5M30.jrlB0gN_aFSFxlg9TTe9YfYT4XJw81GSRFSXM8lmqVE'
      },
      body: JSON.stringify({ mensaje: 'Explícame física', moduloId: 1 })
    })

    const text = await res.text()
    console.log('status', res.status)
    console.log('body', text)
  } catch (e) {
    console.error('error', e)
  }
})()
