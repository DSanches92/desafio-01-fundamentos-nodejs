import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('../../tasks.csv', import.meta.url)
const stream = fs.createReadStream(csvPath)

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

export async function readTasksCSV() {
  process.stdout.write('start csv import...\n')
  const rows = stream.pipe(csvParse)

  for await (const row of rows) {
    const [title, description] = row

    const data = { title, description }

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf8'
      },
      body: JSON.stringify(data)
    })

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  process.stdout.write('...done\n')
}
