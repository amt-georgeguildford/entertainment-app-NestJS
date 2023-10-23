import {pbkdf2Sync} from"crypto"
export const encryptPassword= (password: string, secret: string)=>{
    try {
            const hashed= pbkdf2Sync(password,process.env.PASSWORD_SECRET , 1000, 64, 'sha512')
            return hashed.toString("hex")
    } catch (error) {
      throw error   
    }
}


export const decryptPassword= (password: string, hashedPassword: string, secret: string)=>{
    try {
        const hashed= encryptPassword(password, secret)
        return hashed===hashedPassword
    } catch (error) {
        throw error
    }
}
