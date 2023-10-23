export default ()=>{
    const env={
        PASSWORD_SECRET: process.env.PASSWORD_SECRET,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET
    }
    return env
}