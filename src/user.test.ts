import { expect } from 'chai'
import { User, UserHandler } from './user'
import { LevelDb } from "./leveldb"

const dbPath: string = 'db_test/users'
var dbUser: UserHandler

describe('Users', function () {
  before(function () {
    LevelDb.clear(dbPath)
    const db = LevelDb.open(dbPath)
    dbUser = new UserHandler(db)
  })

  after(function () {
    dbUser.db.close()
  })

  describe('#get', function () {
    it('should get undefined on non existing User', function () {
      dbUser.get("ouyfqeouysf", function (err: Error | null, result?: User | undefined) {
        expect(err).to.have.property('notFound', true)
        expect(result).to.be.undefined
      })
    })
  })

  describe('#save', function () {
    let user = new User("haha", "test@gmail.com", "test")

    it('should save a User', function () {
      dbUser.save(user, function (err: Error | null, result?: User[]) {
        expect(err).to.be.undefined
        expect(result).to.be.undefined
      })
    })

    user = new User("test", "test2@gmail.com", "test")

    it('should update a User', function () {
      dbUser.save(user, function (err: Error | null, result?: User[]) {
        expect(err).to.be.undefined
        expect(result).to.be.undefined
      })
    })
  })

  describe('#delete', function () {
    it('should delete a User', function () {
      this.timeout(5000)
      setTimeout(function () {
        dbUser.delete("haha", function (err: Error | null, result?: User[]) {
          expect(err).to.be.empty
          expect(result).to.be.undefined
        })
      }, 5000)
    })

    it('should not fail if User does not exist', function () {
      dbUser.delete("ouyfqeouysf", function (err: Error | null, result?: User[]) {
        expect(result).to.be.undefined
      })
    })
  })
})