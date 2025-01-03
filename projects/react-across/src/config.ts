export const ip = process.env.ip as string
export const port = process.env.port as string
export const mode = process.env.mode as string
export const name = `reactCross_${port}`
export const remoteName = `reactCross_component`
export const remoteEntry = `http://${ip}:${port}/emp.js`
