import fs from 'node:fs/promises'

const dbPath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(dbPath, 'utf8')
    .then((data) => {
      this.#database = JSON.parse(data)
    })
    .catch(() => {
      this.#persist()
    })
  }

  #persist() {
    fs.writeFile(dbPath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  selectById(table, id) {
    if (!id) return null

    const index = this.#database[table].findIndex((row) => {
      return row.id === id
    })
    if (index < 0) return null

    return {
      title: this.#database[table][index].title,
      description: this.#database[table][index].description,
      completed_at: this.#database[table][index].completed_at
    }
  }

  insert(table, data) {
    if (!data) return null

    const dateTime = this.newDateTime()
    const data_db = {
      ...data,
      completed_at: null,
      created_at: dateTime,
      updated_at: null
    }

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data_db)
    } else {
      this.#database[table] = [data_db]
    }

    this.#persist()

    return data
  }

  update(table, id, data) {
    const index = this.#database[table].findIndex((row) => {
      return row.id === id
    })

    if (index >= 0) {
      const dateTime = this.newDateTime()
      const item = this.#database[table][index]

      const data_db = {
        id,
        title: data.title,
        description: data.description,
        completed_at: data.completed_at ? data.completed_at : item.completed_at,
        created_at: item.created_at,
        updated_at: dateTime
      }
      this.#database[table][index] = data_db
      this.#persist()
      return true
    }
    return false
  }

  delete(table, id) {
    const index = this.#database[table].findIndex((row) => {
      return row.id === id
    })

    if (index >= 0) {
      this.#database[table].splice(index, 1)
      this.#persist()
      return true
    }
    return false
  }

  newDateTime() {
    const date = new Date()
    const timezoneOffset = -180

    const dateTimeZone = new Date(date.getTime() + timezoneOffset * 60 * 1000)

    return dateTimeZone.toISOString()
  }

}
