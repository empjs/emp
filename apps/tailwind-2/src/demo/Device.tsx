import React from 'react'

function getDeviceType() {
  const ua = navigator.userAgent
  if (/mobile/i.test(ua)) return 'Mobile'
  if (/tablet/i.test(ua)) return 'Tablet'
  return 'Desktop'
}

function getOSWithVersion() {
  const {userAgent} = navigator
  if (/windows nt ([\d.]+)/i.test(userAgent)) {
    const version = userAgent.match(/windows nt ([\d.]+)/i)?.[1] || ''
    return `Windows ${version}`
  }
  if (/mac os x ([\d_]+)/i.test(userAgent)) {
    const version = userAgent.match(/mac os x ([\d_]+)/i)?.[1].replace(/_/g, '.') || ''
    return `MacOS ${version}`
  }
  if (/android ([\d.]+)/i.test(userAgent)) {
    const version = userAgent.match(/android ([\d.]+)/i)?.[1] || ''
    return `Android ${version}`
  }
  if (/iphone os ([\d_]+)/i.test(userAgent)) {
    const version = userAgent.match(/iphone os ([\d_]+)/i)?.[1].replace(/_/g, '.') || ''
    return `iOS ${version}`
  }
  if (/linux/i.test(userAgent)) {
    return 'Linux'
  }
  return 'Unknown'
}

function getBrowserWithVersion() {
  const {userAgent} = navigator
  let match
  if ((match = userAgent.match(/chrome\/([\d.]+)/i))) {
    return `Chrome ${match[1]}`
  }
  if ((match = userAgent.match(/firefox\/([\d.]+)/i))) {
    return `Firefox ${match[1]}`
  }
  if ((match = userAgent.match(/edg\/([\d.]+)/i))) {
    return `Edge ${match[1]}`
  }
  if ((match = userAgent.match(/safari\/([\d.]+)/i)) && !/chrome/i.test(userAgent)) {
    return `Safari ${match[1]}`
  }
  if ((match = userAgent.match(/msie ([\d.]+)/i))) {
    return `IE ${match[1]}`
  }
  if ((match = userAgent.match(/trident\/.*rv:([\d.]+)/i))) {
    return `IE ${match[1]}`
  }
  return 'Unknown'
}

const DeviceInfo: React.FC = () => {
  const [device, setDevice] = React.useState('')
  const [os, setOS] = React.useState('')
  const [browser, setBrowser] = React.useState('')

  React.useEffect(() => {
    setDevice(getDeviceType())
    setOS(getOSWithVersion())
    setBrowser(getBrowserWithVersion())
  }, [])

  return (
    <div className="p-4 border rounded shadow bg-white max-w-sm">
      <h2 className="text-lg font-bold mb-2">设备信息</h2>
      <ul>
        <li>设备类型: {device}</li>
        <li>操作系统: {os}</li>
        <li>浏览器: {browser}</li>
      </ul>
    </div>
  )
}

export default DeviceInfo
