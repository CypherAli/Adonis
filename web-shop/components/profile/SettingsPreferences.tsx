'use client'

import React from 'react'
import '../ProfileTabs.css'

interface SettingsPreferencesProps {
  userData: any
  onUpdate?: (data: any) => void
}

const SettingsPreferences: React.FC<SettingsPreferencesProps> = ({ userData, onUpdate }) => {
  return (
    <div className="settings-preferences-tab">
      <p>Settings & Preferences - Coming soon</p>
    </div>
  )
}

export default SettingsPreferences
