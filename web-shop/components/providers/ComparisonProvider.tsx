"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ComparisonContextType {
  compareList: any[]
  addToCompare: (product: any) => void
  removeFromCompare: (productId: string) => void
  clearCompare: () => void
  isInCompare: (productId: string) => boolean
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

export const useComparison = () => {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider')
  }
  return context
}

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [compareList, setCompareList] = useState<any[]>([])

  const addToCompare = (product: any) => {
    if (compareList.length >= 4) {
      alert('Bạn chỉ có thể so sánh tối đa 4 sản phẩm')
      return
    }
    if (!compareList.find((p) => p._id === product._id || p.id === product.id)) {
      setCompareList([...compareList, product])
    }
  }

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter((p) => p._id !== productId && p.id !== productId))
  }

  const clearCompare = () => {
    setCompareList([])
  }

  const isInCompare = (productId: string) => {
    return compareList.some((p) => p._id === productId || p.id === productId)
  }

  return (
    <ComparisonContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}
