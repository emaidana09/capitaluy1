(async () => {
  const ports = [3000, 3001, 3002]
  let base = null
  for (const p of ports) {
    try {
      const res = await fetch(`http://localhost:${p}/api/config`, { method: 'GET' })
      if (res.ok) { base = `http://localhost:${p}`; break }
    } catch (e) {
      // try next
    }
  }
  if (!base) throw new Error('Could not reach localhost on ports ' + ports.join(','))
  const token = Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 15) + '-capitaluy'
  const headers = { 'Content-Type': 'application/json', 'Cookie': `admin_session=${token}` }
  const dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII='

  try {
    console.log('TOKEN:', token)
    const addBody = {
      action: 'add',
      course: {
        title: 'Smoke Test Course',
        description: 'test',
        level: 'Principiante',
        duration: '1 hora',
        students: 1,
        rating: 5,
        price: 1,
        currency: 'UYU',
        features: ['a', 'b', 'c'],
        images: [{ name: 'test.png', data: dataURL }],
      },
    }

    let r = await fetch(base + '/api/courses', { method: 'POST', headers, body: JSON.stringify(addBody) })
    let j = await r.json()
    console.log('ADD:', j.success ? 'ok' : 'fail', JSON.stringify(j).slice(0, 300))
    if (!j.success) process.exit(1)

    const created = j.course || (j.courses && j.courses.find((c) => c.title === 'Smoke Test Course'))
    console.log('CREATED ID:', created?.id)

    if (created?.id) {
      const upd = { action: 'update', course: { ...created, title: 'Smoke Test Course Updated' } }
      r = await fetch(base + '/api/courses', { method: 'POST', headers, body: JSON.stringify(upd) })
      j = await r.json()
      console.log('UPDATE:', j.success ? 'ok' : 'fail')

      const del = { action: 'delete', course: { id: created.id } }
      r = await fetch(base + '/api/courses', { method: 'POST', headers, body: JSON.stringify(del) })
      j = await r.json()
      console.log('DELETE:', j.success ? 'ok' : 'fail')
    }

    const cfgRes = await fetch(base + '/api/config')
    const cfg = await cfgRes.json()
    console.log('CONFIG EMAIL:', cfg.email)
    process.exit(0)
  } catch (e) {
    console.error('ERR', e)
    process.exit(2)
  }
})()
