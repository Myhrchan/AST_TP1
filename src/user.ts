import { LevelDb } from "./leveldb"
import WriteStream from 'level-ws'

const bcrypt = require('bcrypt-nodejs')

var salt = bcrypt.genSaltSync(10);

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
        //TODO : faire le hash
        var hashed = bcrypt.hashSync(password, salt); 
        return new User(username, email, hashed)
    }

    public setPassword(toSet: string): void {
        // Hash and set password
        this.password = bcrypt.hashSync(toSet, salt); 
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
        return bcrypt.compareSync(this.password, toValidate)
    }
}

export class UserHandler {
    public db: any
  
    constructor(path: string) {
      this.db = LevelDb.open(path)
    }
  
    public get(username: string, callback: (err: Error | null, result?: User) => void) {
      
      this.db.get(`user:${username}`, function (err: Error, data: any) {
        if (err) callback(err)
        else if (data === undefined) callback(null, data)
        else callback(null, User.fromDb(username, data))
      })
    }
  
    public save(user: User, callback: (err: Error | null) => void) {
      console.log(user)
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