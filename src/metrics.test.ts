import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDb } from "./leveldb"

const dbPath: string = 'db_test/metrics'
var dbMet: MetricsHandler

describe('Metrics', function () {
    before(function () {
        LevelDb.clear(dbPath)
        dbMet = new MetricsHandler(dbPath)
    })

    after(function () {
        dbMet.db.close()
    })

    describe('#get', function () {
        it('should get empty array on non existing group', function () {
            dbMet.get("1", function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.be.empty
            })
        })
    })

    describe('#save', function () {

        let metrics = [new Metric("1384686660000", 10)]

        it('should save data', function () {
            dbMet.save("2", metrics, function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.undefined
                expect(result).to.be.undefined
            })
        })
    
        metrics = [new Metric("1384686660000", 12)]

        it('should update data', function () {
            dbMet.save("2", metrics, function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.undefined
                expect(result).to.be.undefined
            })
        })
      })
    
      describe('#delete', function () {

        it('should delete data', function () {
            this.timeout(3000)
            setTimeout(function(){
                dbMet.delete("2", function (err: Error | null, result?: Metric[]) {
                    expect(err).to.be.null
                    expect(result).to.be.empty
                })
            }, 3000)
        })
    
        it('should not fail if data does not exist', function () {
            dbMet.delete("15", function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.null
                expect(result).to.be.empty
            })
        })
    })
})