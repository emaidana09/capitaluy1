(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/about', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'admin_session=aaa-bbb-capitalu'
      },
      body: JSON.stringify({ title: 'NODE TEST TITLE', intro: 'Updated via node fetch' }),
    })
    const text = await res.text()
    console.log('status:', res.status)
    console.log(text)
  } catch (err) {
    console.error(err)
  }
})()
