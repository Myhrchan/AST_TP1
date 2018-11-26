import { LevelDb } from "./leveldb";
import WriteStream from 'level-ws'

export class Metric {
    public timestamp: Date
    public value: number

    constructor(ts: number, v: number) {
        this.timestamp = new Date(ts)
        this.value = v
    }
}

export class MetricsHandler {
    private db: any

    constructor(dbPath: string) {
        this.db = LevelDb.open(dbPath)
    }

    public save(key: string, metrics: Array<Metric>, callback: (err: Error | null) => void) {
        const stream = WriteStream(this.db)

        stream.on('error', callback)
        stream.on('close', callback)

        metrics.forEach((m: Metric) => {
            if(m.timestamp instanceof  Date)
                var time = m.timestamp.getTime()
            else time = m.timestamp
            stream.write({ key: `metric:${key}:${time}`, value: m.value })
        })

        stream.end()
    }

    public delete(key: string, callback: (err: Error | null) => void) {

        const stream = this.db.createReadStream()
        var met: Metric[] = []

        stream.on('error', callback)
            .on('end', (err: Error) => {
                callback(null)
            })
            .on('data', (data: any) => {
                const [_, k, timestamp] = data.key.split(":")
                if (k === key) this.db.del(data.key)
            })
    }

    public get(key: string, callback: (error: Error | null, result?: Metric[]) => void) {
        const stream = this.db.createReadStream()
        var met: Metric[] = []

        stream.on('error', callback)
            .on('end', (err: Error) => {
                callback(null, met)
            })
            .on('data', (data: any) => {
                const [_, k, timestamp] = data.key.split(":")
                const value = data.value

                //console.log("in db :", k, " ", timestamp, " ", value)

                if (key == k)
                    met.push(new Metric(parseInt(timestamp), value))
            })
    }
}

