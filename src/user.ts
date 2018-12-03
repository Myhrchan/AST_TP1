import { LevelDb } from "./leveldb"
import WriteStream from 'level-ws'

const bcrypt = require('bcrypt-nodejs')

var salt = bcrypt.genSaltSync(5);

export class User {
    public username: string
    public email: string
    private password: string = ""

    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
      this.username = username
        this.email = email

        if (!passwordHashed) {
            this.setPassword(password)
        } else this.password = password
    }

    static fromDb(username: string, value: any): User {
        // Parse db result and return a User
        const [password, email] = value.split(":")
        return new User(username, email, password, true)
    }

    public setPassword(toSet: string): void {
        // Hash and set password
        this.password = bcrypt.hashSync(toSet, salt); 
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
      return bcrypt.compareSync(toValidate, this.password)
    }
}

export class UserHandler {
    public db: any
  
    constructor(openDb: any) {
      if (this.db == null) this.db = openDb
    }
  
    public get(username: string, callback: (err: Error | null, result?: User) => void) {
      
      this.db.get(`user:${username}`, function (err: Error, data: any) {
        if (err) callback(null)
       // else if (data === undefined) callback(null, data)
        else callback(null, User.fromDb(username, data))
      })
    }
  
    public save(user: User, callback: (err: Error | null) => void) {
      var password = user.getPassword()
      this.db.put(
        `user:${user.username}`,
        `${password}:${user.email}`,
        (err: Error | null) => {
          callback(err)
        }
      )
    }
  
    public delete(username: string, callback: (err: Error | null) => void) {
      this.db.del(`user:${username}`, function (err: Error, data: any) {
        if (err) callback(err)
        else callback(null)
      })
  }
}