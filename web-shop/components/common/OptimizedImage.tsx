/**
 * Next.js Image Optimization Helper
 * Based on Next.js Guidelines #17-21
 */

import Image from 'next/image'
import React from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  sizes?: string
  className?: string
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  className = '',
  objectFit = 'cover',
  quality = 75,
}: OptimizedImageProps) {
  // Default sizes for responsive images
  const defaultSizes = fill
    ? '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
    : undefined

  const imageProps = {
    src: src || '/images/placeholder-product.svg',
    alt: alt || 'Product image',
    quality,
    className,
    sizes: sizes || defaultSizes,
    priority,
  }

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          {...imageProps}
          fill
          style={{ objectFit }}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    )
  }

  return (
    <Image
      {...imageProps}
      width={width || 400}
      height={height || 400}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}

// Product Image with fallback
export function ProductImage({
  src,
  alt,
  priority = false,
  className = '',
}: {
  src?: string
  alt: string
  priority?: boolean
  className?: string
}) {
  return (
    <OptimizedImage
      src={src || '/images/placeholder-product.svg'}
      alt={alt}
      width={400}
      height={400}
      priority={priority}
      className={className}
      objectFit="cover"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
    />
  )
}

// Hero/Banner Image with priority loading
export function HeroImage({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority={true}
      className={className}
      objectFit="cover"
      quality={85}
      sizes="100vw"
    />
  )
}

// Avatar/Profile Image
export function Avatar({
  src,
  alt,
  size = 40,
  className = '',
}: {
  src?: string
  alt: string
  size?: number
  className?: string
}) {
  return (
    <div className={`relative rounded-full overflow-hidden ${className}`} style={{ width: size, height: size }}>
      <OptimizedImage
        src={src || '/images/default-avatar.png'}
        alt={alt}
        width={size}
        height={size}
        objectFit="cover"
        quality={80}
      />
    </div>
  )
}
