#!/usr/bin/env ts-node

import { Metric, MetricsHandler } from '../src/metrics'
import {UserHandler, User} from '../src/user'
import {LevelDb} from "../src/leveldb";


const met = [
    new Metric('123456789', 12),
    new Metric('123456788', 10),
    new Metric('123456787', 8)
]

const met2 = [
    new Metric('123456789', 15),
    new Metric('123456788', 16),
    new Metric('123456787', 17)
]

const db = LevelDb.open('./db/all')
const dbMet: MetricsHandler = new MetricsHandler(db)
const dbUser: UserHandler = new UserHandler(db)

var user1 = new User("mariane", "mariane@ece.fr", "m")
var user2 = new User("arthur", "arthur@ece.fr", "a")


dbUser.save(user1,  (err: Error | null) => {
    if (err) throw err
    console.log('User saved')
})

dbUser.save(user2,  (err: Error | null) => {
    if (err) throw err
    console.log('User saved')
})

dbMet.save('0', 'arthur', met, (err: Error | null) => {
    if (err) throw err
    console.log('Metrics saved')
})

dbMet.save('1', 'mariane', met2, (err: Error | null) => {
    if (err) throw err
    console.log('Metrics saved')
})
