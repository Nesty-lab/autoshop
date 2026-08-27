import { useState } from 'react'
import {
  siAudi,
  siBmw,
  siChevrolet,
  siFord,
  siHonda,
  siHyundai,
  siJeep,
  siKia,
  siMazda,
  siMitsubishi,
  siNissan,
  siPorsche,
  siSubaru,
  siTesla,
  siToyota,
  siVolvo,
  siVolkswagen,
} from 'simple-icons'

function createFallbackLogo(name) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="36" fill="#fff7e8"/><circle cx="80" cy="80" r="56" fill="#ff9900" opacity=".16"/><path d="M30 99c18-27 39-39 52-39 18 0 35 10 48 29v16H30V99z" fill="#ff9900" opacity=".22"/><circle cx="62" cy="104" r="7" fill="#ff9900"/><circle cx="104" cy="104" r="7" fill="#ff9900"/><text x="80" y="76" text-anchor="middle" dominant-baseline="middle" font-size="38" font-weight="700" fill="#d97706" font-family="Arial, sans-serif">${initials}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const logoSlugs = {
  BMW: siBmw,
  Toyota: siToyota,
  Ford: siFord,
  Honda: siHonda,
  Audi: siAudi,
  Nissan: siNissan,
  Volkswagen: siVolkswagen,
  Hyundai: siHyundai,
  Kia: siKia,
  Tesla: siTesla,
  Porsche: siPorsche,
  Mazda: siMazda,
  Subaru: siSubaru,
  Jeep: siJeep,
  Chevrolet: siChevrolet,
  Volvo: siVolvo,
  Mitsubishi: siMitsubishi,
}

const customLogos = {
  'Mercedes-Benz': '<circle cx="12" cy="12" r="9" fill="none" stroke="#0d1b2a" stroke-width="1.5"/><path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" fill="none" stroke="#0d1b2a" stroke-width="1.5"/>',
  Lexus: '<ellipse cx="12" cy="12" rx="9" ry="7" fill="none" stroke="#6d28d9" stroke-width="1.5"/><path d="M8 8h8M12 8v8M12 16l5-8" fill="none" stroke="#6d28d9" stroke-width="1.5" stroke-linecap="round"/>',
  'Land Rover': '<ellipse cx="12" cy="12" rx="9" ry="6" fill="none" stroke="#166534" stroke-width="1.5"/><text x="12" y="13.5" text-anchor="middle" font-size="3.5" font-weight="700" fill="#166534" font-family="Arial">LAND ROVER</text>',
}

export default function BrandLogo({ name = 'Car', src, className = 'h-12 w-12' }) {
  const [imageFailed, setImageFailed] = useState(false)
  const bundledLogo = logoSlugs[name]
  const customLogo = customLogos[name]
  const bundledLogoSource = bundledLogo || customLogo
    ? `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${customLogo || `<path fill="#${bundledLogo.hex}" d="${bundledLogo.path}"/>`}</svg>`)}\n`
    : ''
  const logoSource = bundledLogoSource || src

  return (
    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#fff7e8] ${className}`}>
      <img src={createFallbackLogo(name)} alt={`${name} logo`} className="absolute inset-0 h-full w-full object-contain p-1" />
      {logoSource && !imageFailed && (
        <img
          src={logoSource}
          alt={`${name} logo`}
          className="absolute inset-0 h-full w-full bg-[#fff7e8] object-contain p-1"
          onError={() => setImageFailed(true)}
        />
      )}
    </div>
  )
}
