// Builds public/favicon.ico (multi-size, PNG-encoded entries) from public/logo.png.
// No image libraries in this project, so we decode/encode PNG by hand using node:zlib.
import { readFileSync, writeFileSync } from 'node:fs'
import { inflateSync, deflateSync } from 'node:zlib'

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

/** Decode an 8-bit RGBA, non-interlaced PNG into {width, height, data}. */
function decodePng(buf) {
  if (buf.readUInt32BE(12) !== 0x49484452) throw new Error('not a PNG (missing IHDR)')
  const width = buf.readUInt32BE(16)
  const height = buf.readUInt32BE(20)
  const bitDepth = buf[24]
  const colorType = buf[25]
  const interlace = buf[28]
  if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
    throw new Error(`unsupported PNG: depth=${bitDepth} colorType=${colorType} interlace=${interlace}`)
  }

  const idat = []
  let off = 8
  while (off < buf.length) {
    const len = buf.readUInt32BE(off)
    const type = buf.toString('ascii', off + 4, off + 8)
    if (type === 'IDAT') idat.push(buf.subarray(off + 8, off + 8 + len))
    if (type === 'IEND') break
    off += 12 + len
  }

  const raw = inflateSync(Buffer.concat(idat))
  const bpp = 4
  const stride = width * bpp
  const data = Buffer.alloc(height * stride)

  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)]
    const src = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride)
    const cur = data.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? data.subarray((y - 1) * stride, y * stride) : null

    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0
      const b = prev ? prev[x] : 0
      const c = prev && x >= bpp ? prev[x - bpp] : 0
      let v
      switch (filter) {
        case 0: v = src[x]; break
        case 1: v = src[x] + a; break
        case 2: v = src[x] + b; break
        case 3: v = src[x] + ((a + b) >> 1); break
        case 4: {
          const p = a + b - c
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
          v = src[x] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)
          break
        }
        default: throw new Error('bad filter ' + filter)
      }
      cur[x] = v & 0xff
    }
  }
  return { width, height, data }
}

/** Box-filter downscale with area averaging, premultiplying alpha so edges stay clean. */
function resize(src, size) {
  const out = Buffer.alloc(size * size * 4)
  const scale = src.width / size

  for (let y = 0; y < size; y++) {
    const y0 = Math.floor(y * scale), y1 = Math.min(src.height, Math.ceil((y + 1) * scale))
    for (let x = 0; x < size; x++) {
      const x0 = Math.floor(x * scale), x1 = Math.min(src.width, Math.ceil((x + 1) * scale))
      let r = 0, g = 0, b = 0, a = 0, n = 0
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * src.width + sx) * 4
          const al = src.data[i + 3] / 255
          r += src.data[i] * al; g += src.data[i + 1] * al; b += src.data[i + 2] * al
          a += src.data[i + 3]
          n++
        }
      }
      const o = (y * size + x) * 4
      const avgA = a / n
      const unpre = avgA > 0 ? 255 / avgA : 0
      out[o] = Math.min(255, Math.round((r / n) * unpre))
      out[o + 1] = Math.min(255, Math.round((g / n) * unpre))
      out[o + 2] = Math.min(255, Math.round((b / n) * unpre))
      out[o + 3] = Math.round(avgA)
    }
  }
  return { width: size, height: size, data: out }
}

function chunk(type, payload) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(payload.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), payload])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePng({ width, height, data }) {
  const stride = width * 4
  const raw = Buffer.alloc(height * (stride + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: None
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

function buildIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)              // reserved
  header.writeUInt16LE(1, 2)              // type: icon
  header.writeUInt16LE(images.length, 4)  // image count

  const entries = []
  let offset = 6 + images.length * 16
  for (const { size, png } of images) {
    const e = Buffer.alloc(16)
    e[0] = size >= 256 ? 0 : size        // 0 means 256
    e[1] = size >= 256 ? 0 : size
    e[2] = 0                             // palette colors
    e[3] = 0                             // reserved
    e.writeUInt16LE(1, 4)                // color planes
    e.writeUInt16LE(32, 6)               // bits per pixel
    e.writeUInt32LE(png.length, 8)
    e.writeUInt32LE(offset, 12)
    entries.push(e)
    offset += png.length
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)])
}

const source = decodePng(readFileSync('public/logo.png'))
console.log(`source: ${source.width}x${source.height}`)

const images = [16, 32, 48].map((size) => {
  const png = encodePng(resize(source, size))
  console.log(`  ${size}x${size} -> ${png.length} bytes`)
  return { size, png }
})

const ico = buildIco(images)
writeFileSync('public/favicon.ico', ico)
console.log(`public/favicon.ico written: ${ico.length} bytes`)

const apple = encodePng(resize(source, 180))
writeFileSync('public/apple-touch-icon.png', apple)
console.log(`public/apple-touch-icon.png written: ${apple.length} bytes`)
