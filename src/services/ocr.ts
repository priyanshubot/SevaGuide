import { createWorker } from 'tesseract.js';

export interface OcrProgress {
  stage: 'validating' | 'loading' | 'initializing' | 'recognizing' | 'completed' | 'failed';
  progress: number; // 0 - 100
  message: string;
}

export interface OcrTextResult {
  rawText: string;
  confidence: number; // 0 - 100
  lines: string[];
}

export const SUPPORTED_OCR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
export const MAX_OCR_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validates whether the supplied file is eligible for browser-based OCR.
 * Currently supports JPEG and PNG images under 10MB.
 */
export function validateOcrFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided for text extraction.' };
  }

  const isSupportedType =
    SUPPORTED_OCR_MIME_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png)$/i.test(file.name);

  if (!isSupportedType) {
    if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
      return {
        valid: false,
        error:
          'PDF documents are not supported for browser-side OCR. Please upload a clear photo or scan of your document in JPG or PNG format.',
      };
    }
    return {
      valid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload a JPEG or PNG image.`,
    };
  }

  if (file.size > MAX_OCR_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image size (${sizeMb} MB) exceeds the 10 MB limit. Please resize or compress the image before uploading.`,
    };
  }

  return { valid: true };
}

/**
 * Executes browser-side OCR using Tesseract.js WebAssembly / Web Worker.
 * Does not log document images or extracted citizen details to the console.
 */
export async function extractTextFromImage(
  file: File | Blob,
  onProgress?: (progress: OcrProgress) => void
): Promise<OcrTextResult> {
  if (file instanceof File) {
    const validation = validateOcrFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }

  onProgress?.({
    stage: 'loading',
    progress: 5,
    message: 'Initializing browser OCR engine...',
  });

  let worker: any = null;

  try {
    worker = await createWorker('eng', 1, {
      logger: (m: any) => {
        if (!onProgress || !m) return;

        const currentProg = typeof m.progress === 'number' ? m.progress : 0;

        if (m.status === 'loading tesseract core') {
          onProgress({
            stage: 'loading',
            progress: Math.round(5 + currentProg * 20),
            message: 'Loading OCR core engine...',
          });
        } else if (
          m.status === 'initializing tesseract' ||
          m.status === 'loading language traineddata' ||
          m.status === 'initializing api'
        ) {
          onProgress({
            stage: 'initializing',
            progress: Math.round(25 + currentProg * 25),
            message: 'Loading language recognition models...',
          });
        } else if (m.status === 'recognizing text') {
          const percent = Math.round(currentProg * 100);
          onProgress({
            stage: 'recognizing',
            progress: Math.round(50 + currentProg * 45),
            message: `Extracting text from image (${percent}%)...`,
          });
        }
      },
    });

    onProgress?.({
      stage: 'recognizing',
      progress: 55,
      message: 'Scanning image pixels for character text...',
    });

    const ret = await worker.recognize(file);

    const rawText = ret?.data?.text || '';
    const confidence = typeof ret?.data?.confidence === 'number' ? Math.round(ret.data.confidence) : 0;
    const lines = (ret?.data?.lines || [])
      .map((l: any) => (l.text || '').trim())
      .filter((l: string) => l.length > 0);

    onProgress?.({
      stage: 'completed',
      progress: 100,
      message: 'Text extraction complete.',
    });

    return {
      rawText,
      confidence,
      lines,
    };
  } catch (err: any) {
    onProgress?.({
      stage: 'failed',
      progress: 0,
      message: err.message || 'OCR extraction failed.',
    });
    throw new Error(err.message || 'Failed to extract text from the document image.');
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // cleanup suppression
      }
    }
  }
}
