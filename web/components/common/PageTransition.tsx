'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

const pageVariants = {
  initial: {
    opacity: 0.8,
  },
  in: {
    opacity: 1,
  },
}

const pageTransition = {
  duration: 0.15,
  ease: 'easeInOut',
}

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayPath, setDisplayPath] = useState(pathname)

  useEffect(() => {
    setDisplayPath(pathname)
  }, [pathname])

  return (
    <motion.div
      key={displayPath}
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
