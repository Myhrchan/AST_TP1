import WriteStream from 'level-ws'

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  public db: any

  constructor(openDb: any) {
    if (this.db == null) this.db = openDb
  }

  public save(key: string, user: string, met: Metric[], callback: (err: Error | null) => void) {
    const stream = WriteStream(this.db)

    stream.on('close', callback)
    stream.on('error', callback)

    met.forEach((m: Metric) => {
      stream.write({ key: `metrics:${user}:${key}:${m.timestamp}`, value: m.value })
    })

    stream.end()
  }

  public get(key: string, user: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []

    stream.on('error', callback)
      .on('end', (err: Error) => {
        callback(null, met)
      })
      .on('data', (data: any) => {
        const [type, username, k, timestamp] = data.key.split(":")
        console.log(type)
        if(type == "metrics"){
          const value = data.value

          //  console.log("in db :", username, k, " ", timestamp, " ", value)

          if (username != user && k != key) {
          //  console.log(`LOG/ LevelDB error: ${username} does not match key ${user}`)
          } else {
            met.push(new Metric(timestamp, value))
          }
        }
      })
  }

  public getByUser(user: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: any[] = []

    stream.on('error', callback)
      .on('end', (err: Error) => {
        callback(null, met)
      })
      .on('data', (data: any) => {
        const [type, username, k, timestamp] = data.key.split(":")
        if(type == "metrics"){
          const value = data.value

          //  console.log("in db :", username, k, " ", timestamp, " ", value)

          if (username != user) {
         //   console.log(`LOG/ LevelDB error: ${username} does not match key ${user}`)
          } else {
            var tmp: any[] = []
            tmp.push(k)
            tmp.push(new Metric(timestamp, value))
            met.push(tmp)
          }
        }
      })
  }

  public delete(key: string, user: string, callback: (err: Error | null) => void) {

    const stream = this.db.createReadStream()
    //var met: Metric[] = []

    stream.on('error', callback)
      .on('end', (err: Error) => {
        callback(null)
      })
      .on('data', (data: any) => {
        const [_, username, k, timestamp] = data.key.split(":")
        if (k === key && username == user) this.db.del(data.key)
      })
  }
}

