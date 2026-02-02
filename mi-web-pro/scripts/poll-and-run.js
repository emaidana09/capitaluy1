(async () => {
  const base = 'http://localhost:3000'
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`${base}/api/config`)
      if (res.ok) {
        const j = await res.json()
        console.log('CONFIG_OK')
        console.log(JSON.stringify(j, null, 2))
        const { exec } = require('child_process')
        exec('node scripts/smoke-test.js', { cwd: process.cwd() }, (err, stdout, stderr) => {
          if (err) {
            console.error('SMOKE ERR', err)
            console.error(stderr)
            process.exit(1)
          }
          console.log('SMOKE OUTPUT:\n', stdout)
          process.exit(0)
        })
        return
      }
    } catch (e) {
      // ignore
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  console.error('FAILED_TO_REACH_CONFIG')
  process.exit(2)
})()
