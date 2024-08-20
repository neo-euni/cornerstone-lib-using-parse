import { readFileSync } from 'fs'
import { Buffer } from 'buffer'

/**
 * 주어진 파일 경로에서 파일을 읽어 Buffer로 반환하는 함수
 * @param filePath - 파일 경로
 * @returns 파일의 Buffer
 */
export function readDicomFileToBuffer(filePath: string): Buffer {
  try {
    return readFileSync(filePath)
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error)
    throw error
  }
}

/**
 * 주어진 Buffer를 ArrayBuffer로 변환하는 함수
 * @param buffer - Node.js Buffer 객체
 * @returns 변환된 ArrayBuffer
 */
export function dicomFileBufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

/**
 * 주어진 파일 경로에서 파일을 읽어 ArrayBuffer로 변환하는 함수
 * @param filePath - 파일 경로
 * @returns 파일의 ArrayBuffer
 */
export function readDicomFileToArrayBuffer(filePath: string): ArrayBuffer {
  console.log('[Util]readDicomFileToArrayBuffer function in')
  const buffer = readDicomFileToBuffer(filePath)
  return dicomFileBufferToArrayBuffer(buffer)
}
