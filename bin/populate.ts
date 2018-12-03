#!/usr/bin/env ts-node

import { Metric, MetricsHandler } from '../src/metrics'
import {UserHandler, User} from '../src/user'


const met = [
    new Metric('123456789', 12),
    new Metric('123456789', 10),
    new Metric('123456789', 8)
]

const dbMet = new MetricsHandler('./db/metrics')
const dbUser = new UserHandler('./db/users')

var user = new User("mariane", "mariane@ece.fr", "m")

dbUser.save(user,  (err: Error | null) => {
    if (err) throw err
    console.log('User saved')
})

dbMet.save('0', 'mariane', met, (err: Error | null) => {
    if (err) throw err
    console.log('Metrics saved')
})