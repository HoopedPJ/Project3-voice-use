"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="flex items-center justify-center">
      <div className={`status-indicator ${isOnline ? "status-online" : "status-offline"}`} />
      {isOnline ? (
        <div className="flex items-center text-green-600">
          <Wifi className="w-4 h-4 mr-1" />
          Online
        </div>
      ) : (
        <div className="flex items-center text-red-600">
          <WifiOff className="w-4 h-4 mr-1" />
          Offline Mode
        </div>
      )}
    </div>
  )
}
