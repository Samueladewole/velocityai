"""
High-performance OCR service for evidence text extraction.
Optimized Python implementation with multiple OCR engines.
"""

import cv2
import numpy as np
import pytesseract
from PIL import Image
import asyncio
from typing import Dict, List, Any, Optional, Tuple
import structlog
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor
import io
import re

logger = structlog.get_logger()


@dataclass
class OCRResult:
    text: str
    confidence: float
    words: List[Dict[str, Any]]
    processing_time: float


@dataclass
class OCRConfig:
    languages: str = 'eng'
    psm_mode: int = 6  # Uniform block of text
    oem_mode: int = 3  # Default OCR Engine Mode
    dpi: int = 300
    whitelist: Optional[str] = None


class HighPerformanceOCRService:
    """Advanced OCR service with preprocessing and multiple engine support"""
    
    def __init__(self, config: OCRConfig = None):
        self.config = config or OCRConfig()
        self.executor = ThreadPoolExecutor(max_workers=4)
        
        # Build Tesseract config string
        self.base_config = f'--oem {self.config.oem_mode} --psm {self.config.psm_mode}'
        if self.config.whitelist:
            self.base_config += f' -c tessedit_char_whitelist={self.config.whitelist}'
    
    async def extract_text_batch(
        self, 
        image_buffers: List[bytes]
    ) -> List[OCRResult]:
        """Extract text from multiple images in parallel"""
        
        tasks = [
            self._extract_text_single(buffer, i) 
            for i, buffer in enumerate(image_buffers)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        ocr_results = []
        for result in results:
            if isinstance(result, Exception):
                logger.error("ocr_extraction_failed", error=str(result))
                ocr_results.append(OCRResult(
                    text="",
                    confidence=0.0,
                    words=[],
                    processing_time=0.0
                ))
            else:
                ocr_results.append(result)
        
        return ocr_results
    
    async def _extract_text_single(
        self, 
        image_buffer: bytes, 
        index: int = 0
    ) -> OCRResult:
        """Extract text from single image with preprocessing"""
        
        start_time = asyncio.get_event_loop().time()
        
        try:
            # Convert buffer to OpenCV image
            nparr = np.frombuffer(image_buffer, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise ValueError("Unable to decode image")
            
            # Preprocess image for better OCR
            processed_img = await self._preprocess_image(img)
            
            # Extract text with detailed information
            loop = asyncio.get_event_loop()
            
            # Get text and confidence data
            text_task = loop.run_in_executor(
                self.executor,
                self._extract_text_tesseract,
                processed_img
            )
            
            data_task = loop.run_in_executor(
                self.executor,
                self._extract_detailed_data,
                processed_img
            )
            
            text, detailed_data = await asyncio.gather(text_task, data_task)
            
            # Process detailed data
            words = self._process_word_data(detailed_data)
            confidence = self._calculate_average_confidence(detailed_data)
            
            processing_time = asyncio.get_event_loop().time() - start_time
            
            return OCRResult(
                text=text.strip(),
                confidence=confidence,
                words=words,
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error("ocr_processing_failed", error=str(e), index=index)
            processing_time = asyncio.get_event_loop().time() - start_time
            
            return OCRResult(
                text="",
                confidence=0.0,
                words=[],
                processing_time=processing_time
            )
    
    async def _preprocess_image(self, img: np.ndarray) -> np.ndarray:
        """Advanced image preprocessing for better OCR accuracy"""
        
        def _process():
            # Convert to grayscale
            if len(img.shape) == 3:
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            else:
                gray = img.copy()
            
            # Noise reduction
            denoised = cv2.fastNlMeansDenoising(gray)
            
            # Increase contrast using CLAHE
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            contrast_enhanced = clahe.apply(denoised)
            
            # Adaptive thresholding
            binary = cv2.adaptiveThreshold(
                contrast_enhanced,
                255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY,
                11,
                2
            )
            
            # Morphological operations to clean up
            kernel = np.ones((1, 1), np.uint8)
            cleaned = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
            
            # Scale up image for better OCR (if small)
            height, width = cleaned.shape
            if height < 300 or width < 300:
                scale_factor = max(300 / height, 300 / width)
                new_width = int(width * scale_factor)
                new_height = int(height * scale_factor)
                cleaned = cv2.resize(
                    cleaned, 
                    (new_width, new_height), 
                    interpolation=cv2.INTER_CUBIC
                )
            
            return cleaned
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _process)
    
    def _extract_text_tesseract(self, img: np.ndarray) -> str:
        """Extract text using Tesseract"""
        
        # Convert numpy array to PIL Image
        pil_img = Image.fromarray(img)
        
        # Extract text
        text = pytesseract.image_to_string(
            pil_img, 
            lang=self.config.languages,
            config=self.base_config
        )
        
        return text
    
    def _extract_detailed_data(self, img: np.ndarray) -> Dict[str, Any]:
        """Extract detailed OCR data including word positions and confidence"""
        
        # Convert numpy array to PIL Image
        pil_img = Image.fromarray(img)
        
        # Get detailed data
        data = pytesseract.image_to_data(
            pil_img,
            lang=self.config.languages,
            config=self.base_config,
            output_type=pytesseract.Output.DICT
        )
        
        return data
    
    def _process_word_data(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Process word-level OCR data"""
        
        words = []
        n_boxes = len(data['text'])
        
        for i in range(n_boxes):
            if int(data['conf'][i]) > 0:  # Only include confident detections
                word_data = {
                    'text': data['text'][i],
                    'confidence': float(data['conf'][i]),
                    'bbox': {
                        'x': int(data['left'][i]),
                        'y': int(data['top'][i]),
                        'width': int(data['width'][i]),
                        'height': int(data['height'][i])
                    },
                    'level': int(data['level'][i])
                }
                
                # Only add words with actual text
                if word_data['text'].strip():
                    words.append(word_data)
        
        return words
    
    def _calculate_average_confidence(self, data: Dict[str, Any]) -> float:
        """Calculate average confidence score"""
        
        confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
        
        if not confidences:
            return 0.0
        
        return sum(confidences) / len(confidences) / 100.0  # Normalize to 0-1
    
    async def extract_structured_data(
        self, 
        image_buffer: bytes,
        patterns: Dict[str, str]
    ) -> Dict[str, Optional[str]]:
        """Extract structured data using regex patterns"""
        
        # First extract all text
        ocr_result = await self._extract_text_single(image_buffer)
        text = ocr_result.text
        
        # Apply patterns to extract structured data
        extracted_data = {}
        
        for field_name, pattern in patterns.items():
            try:
                match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
                extracted_data[field_name] = match.group(1) if match else None
            except Exception as e:
                logger.warning(
                    "pattern_extraction_failed",
                    field=field_name,
                    pattern=pattern,
                    error=str(e)
                )
                extracted_data[field_name] = None
        
        return extracted_data
    
    async def detect_document_type(self, image_buffer: bytes) -> Dict[str, Any]:
        """Detect document type based on text content"""
        
        ocr_result = await self._extract_text_single(image_buffer)
        text = ocr_result.text.lower()
        
        # Document type patterns
        document_patterns = {
            'aws_console': [
                'aws management console', 'amazon web services', 
                'aws console', 'cloudformation', 'ec2', 's3'
            ],
            'google_workspace': [
                'google workspace', 'g suite', 'google admin', 
                'gmail admin', 'google cloud console'
            ],
            'github': [
                'github', 'repository', 'pull request', 'commit',
                'github.com', 'git'
            ],
            'azure': [
                'microsoft azure', 'azure portal', 'azure active directory',
                'azure ad', 'azure console'
            ],
            'compliance_report': [
                'compliance', 'audit', 'soc 2', 'iso 27001',
                'gdpr', 'hipaa', 'assessment'
            ],
            'security_settings': [
                'security', 'authentication', 'mfa', 'two-factor',
                'access control', 'permissions'
            ]
        }
        
        # Score each document type
        scores = {}
        for doc_type, keywords in document_patterns.items():
            score = sum(1 for keyword in keywords if keyword in text)
            scores[doc_type] = score / len(keywords)  # Normalize
        
        # Find best match
        best_match = max(scores.items(), key=lambda x: x[1])
        
        return {
            'document_type': best_match[0] if best_match[1] > 0.2 else 'unknown',
            'confidence': best_match[1],
            'all_scores': scores,
            'total_text_length': len(ocr_result.text),
            'word_count': len(ocr_result.words)
        }
    
    async def validate_text_quality(self, image_buffer: bytes) -> Dict[str, Any]:
        """Validate text extraction quality"""
        
        ocr_result = await self._extract_text_single(image_buffer)
        
        # Quality metrics
        text = ocr_result.text
        words = ocr_result.words
        
        # Calculate metrics
        total_chars = len(text)
        printable_chars = sum(1 for c in text if c.isprintable())
        alpha_chars = sum(1 for c in text if c.isalpha())
        digit_chars = sum(1 for c in text if c.isdigit())
        
        # Word-level analysis
        confident_words = [w for w in words if w['confidence'] > 0.7]
        avg_word_confidence = (
            sum(w['confidence'] for w in words) / len(words) 
            if words else 0
        )
        
        # Text structure analysis
        lines = text.split('\n')
        non_empty_lines = [line for line in lines if line.strip()]
        
        return {
            'overall_confidence': ocr_result.confidence,
            'text_length': total_chars,
            'printable_ratio': printable_chars / max(1, total_chars),
            'alpha_ratio': alpha_chars / max(1, total_chars),
            'digit_ratio': digit_chars / max(1, total_chars),
            'word_count': len(words),
            'confident_words': len(confident_words),
            'avg_word_confidence': avg_word_confidence,
            'line_count': len(non_empty_lines),
            'processing_time': ocr_result.processing_time,
            'quality_score': self._calculate_quality_score(
                ocr_result.confidence,
                printable_chars / max(1, total_chars),
                len(confident_words) / max(1, len(words))
            )
        }
    
    def _calculate_quality_score(
        self, 
        ocr_confidence: float,
        printable_ratio: float,
        confident_word_ratio: float
    ) -> float:
        """Calculate overall text quality score"""
        
        # Weighted combination of factors
        weights = {
            'ocr_confidence': 0.4,
            'printable_ratio': 0.3,
            'confident_word_ratio': 0.3
        }
        
        score = (
            ocr_confidence * weights['ocr_confidence'] +
            printable_ratio * weights['printable_ratio'] +
            confident_word_ratio * weights['confident_word_ratio']
        )
        
        return min(1.0, max(0.0, score))


# Singleton instance
ocr_service = HighPerformanceOCRService()