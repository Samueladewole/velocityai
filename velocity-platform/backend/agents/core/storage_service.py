"""
High-performance storage service for evidence management.
Replaces TypeScript storage.ts with optimized Python implementation.
"""

import boto3
import asyncio
import aiofiles
from typing import Dict, List, Any, Optional, BinaryIO
import hashlib
import gzip
import io
from datetime import datetime, timedelta
from concurrent.futures import ThreadPoolExecutor
import structlog
from PIL import Image
import os
from cryptography.fernet import Fernet
from dataclasses import dataclass
import json
import tempfile
import time

logger = structlog.get_logger()


@dataclass
class StorageConfig:
    bucket_name: str
    region: str = 'us-east-1'
    encryption_key: Optional[str] = None
    compression_level: int = 6
    thumbnail_size: tuple = (300, 200)
    presigned_url_expiry: int = 3600  # 1 hour


class HighPerformanceStorageService:
    """Optimized storage service with parallel operations and intelligent caching"""
    
    def __init__(self, config: StorageConfig):
        self.config = config
        self.s3_client = boto3.client('s3', region_name=config.region)
        self.executor = ThreadPoolExecutor(max_workers=20)
        
        # Initialize encryption
        if config.encryption_key:
            self.cipher = Fernet(config.encryption_key.encode()[:44])  # Fernet key must be 44 chars
        else:
            self.cipher = Fernet(Fernet.generate_key())
        
        # Local cache for frequently accessed items
        self._cache = {}
        self._cache_ttl = {}
    
    async def store_evidence_batch(
        self, 
        evidence_items: List[Dict[str, Any]]
    ) -> List[Dict[str, str]]:
        """Store multiple evidence items in parallel for maximum efficiency"""
        
        tasks = []
        for item in evidence_items:
            if item.get('type') == 'screenshot':
                task = self._store_screenshot(
                    item['customer_id'],
                    item['evidence_id'],
                    item['data'],
                    item.get('metadata', {})
                )
            else:
                task = self._store_generic_evidence(
                    item['customer_id'],
                    item['evidence_id'],
                    item['data'],
                    item.get('content_type', 'application/octet-stream'),
                    item.get('metadata', {})
                )
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        storage_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error(
                    "evidence_storage_failed",
                    evidence_id=evidence_items[i].get('evidence_id'),
                    error=str(result)
                )
                storage_results.append({
                    'evidence_id': evidence_items[i].get('evidence_id'),
                    'status': 'failed',
                    'error': str(result)
                })
            else:
                storage_results.append({
                    'evidence_id': evidence_items[i].get('evidence_id'),
                    'status': 'success',
                    **result
                })
        
        return storage_results
    
    async def _store_screenshot(
        self,
        customer_id: str,
        evidence_id: str,
        image_data: bytes,
        metadata: Dict[str, Any]
    ) -> Dict[str, str]:
        """Store screenshot with compression and thumbnail generation"""
        
        # Process in parallel: compression, encryption, thumbnail
        compression_task = asyncio.create_task(self._compress_data(image_data))
        thumbnail_task = asyncio.create_task(self._generate_thumbnail(image_data))
        
        compressed_data, thumbnail_data = await asyncio.gather(
            compression_task, thumbnail_task
        )
        
        # Encrypt both images
        encrypted_data = await self._encrypt_data(compressed_data)
        encrypted_thumbnail = await self._encrypt_data(thumbnail_data)
        
        # Generate storage keys
        base_key = f"evidence/{customer_id}/screenshots/{evidence_id}"
        image_key = f"{base_key}.png"
        thumbnail_key = f"{base_key}_thumb.png"
        
        # Upload in parallel
        upload_tasks = [
            self._upload_to_s3(
                image_key,
                encrypted_data,
                'image/png',
                {**metadata, 'compressed': 'true', 'encrypted': 'true'}
            ),
            self._upload_to_s3(
                thumbnail_key,
                encrypted_thumbnail,
                'image/png',
                {**metadata, 'thumbnail': 'true', 'encrypted': 'true'}
            )
        ]
        
        await asyncio.gather(*upload_tasks)
        
        # Generate presigned URLs
        image_url = await self._generate_presigned_url(image_key)
        thumbnail_url = await self._generate_presigned_url(thumbnail_key)
        
        return {
            'image_url': image_url,
            'thumbnail_url': thumbnail_url,
            'storage_key': image_key,
            'file_size': len(encrypted_data),
            'compressed_size': len(compressed_data),
            'compression_ratio': len(image_data) / len(compressed_data)
        }
    
    async def _store_generic_evidence(
        self,
        customer_id: str,
        evidence_id: str,
        data: bytes,
        content_type: str,
        metadata: Dict[str, Any]
    ) -> Dict[str, str]:
        """Store generic evidence with optimization"""
        
        # Compress and encrypt
        compressed_data = await self._compress_data(data)
        encrypted_data = await self._encrypt_data(compressed_data)
        
        # Generate storage key
        storage_key = f"evidence/{customer_id}/data/{evidence_id}"
        
        # Upload to S3
        await self._upload_to_s3(
            storage_key,
            encrypted_data,
            content_type,
            {**metadata, 'compressed': 'true', 'encrypted': 'true'}
        )
        
        # Generate presigned URL
        url = await self._generate_presigned_url(storage_key)
        
        return {
            'url': url,
            'storage_key': storage_key,
            'file_size': len(encrypted_data),
            'compressed_size': len(compressed_data),
            'compression_ratio': len(data) / len(compressed_data)
        }
    
    async def _compress_data(self, data: bytes) -> bytes:
        """Compress data using gzip"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            lambda: gzip.compress(data, compresslevel=self.config.compression_level)
        )
    
    async def _encrypt_data(self, data: bytes) -> bytes:
        """Encrypt data using Fernet"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self.cipher.encrypt,
            data
        )
    
    async def _decrypt_data(self, encrypted_data: bytes) -> bytes:
        """Decrypt data using Fernet"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self.cipher.decrypt,
            encrypted_data
        )
    
    async def _generate_thumbnail(self, image_data: bytes) -> bytes:
        """Generate thumbnail from image data"""
        
        def _create_thumbnail():
            img = Image.open(io.BytesIO(image_data))
            img.thumbnail(self.config.thumbnail_size, Image.Resampling.LANCZOS)
            
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Save to bytes
            output = io.BytesIO()
            img.save(output, format='PNG', optimize=True, quality=85)
            return output.getvalue()
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _create_thumbnail)
    
    async def _upload_to_s3(
        self,
        key: str,
        data: bytes,
        content_type: str,
        metadata: Dict[str, str]
    ) -> None:
        """Upload data to S3 with optimal settings"""
        
        def _upload():
            # Calculate MD5 for integrity
            md5_hash = hashlib.md5(data).hexdigest()
            
            self.s3_client.put_object(
                Bucket=self.config.bucket_name,
                Key=key,
                Body=data,
                ContentType=content_type,
                ContentMD5=md5_hash,
                ServerSideEncryption='AES256',
                StorageClass='INTELLIGENT_TIERING',
                Metadata={k: str(v) for k, v in metadata.items()},
                CacheControl='max-age=31536000',  # 1 year cache
                ContentEncoding='gzip' if metadata.get('compressed') else None
            )
        
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(self.executor, _upload)
    
    async def _generate_presigned_url(self, key: str) -> str:
        """Generate presigned URL for S3 object"""
        
        def _generate():
            return self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.config.bucket_name,
                    'Key': key
                },
                ExpiresIn=self.config.presigned_url_expiry
            )
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _generate)
    
    async def retrieve_evidence(
        self, 
        storage_key: str,
        use_cache: bool = True
    ) -> Optional[bytes]:
        """Retrieve and decrypt evidence data"""
        
        # Check cache first
        if use_cache and storage_key in self._cache:
            cache_time = self._cache_ttl.get(storage_key, 0)
            if time.time() - cache_time < 300:  # 5 min cache
                return self._cache[storage_key]
        
        try:
            def _download():
                response = self.s3_client.get_object(
                    Bucket=self.config.bucket_name,
                    Key=storage_key
                )
                return response['Body'].read()
            
            loop = asyncio.get_event_loop()
            encrypted_data = await loop.run_in_executor(self.executor, _download)
            
            # Decrypt and decompress
            compressed_data = await self._decrypt_data(encrypted_data)
            
            def _decompress():
                return gzip.decompress(compressed_data)
            
            data = await loop.run_in_executor(self.executor, _decompress)
            
            # Cache result
            if use_cache:
                self._cache[storage_key] = data
                self._cache_ttl[storage_key] = time.time()
            
            return data
            
        except Exception as e:
            logger.error("evidence_retrieval_failed", storage_key=storage_key, error=str(e))
            return None
    
    async def list_evidence(
        self,
        customer_id: str,
        prefix: Optional[str] = None,
        limit: int = 1000
    ) -> List[Dict[str, Any]]:
        """List evidence with metadata"""
        
        list_prefix = f"evidence/{customer_id}/"
        if prefix:
            list_prefix += prefix
        
        def _list_objects():
            paginator = self.s3_client.get_paginator('list_objects_v2')
            page_iterator = paginator.paginate(
                Bucket=self.config.bucket_name,
                Prefix=list_prefix,
                MaxKeys=limit
            )
            
            objects = []
            for page in page_iterator:
                if 'Contents' in page:
                    objects.extend(page['Contents'])
            
            return objects
        
        loop = asyncio.get_event_loop()
        objects = await loop.run_in_executor(self.executor, _list_objects)
        
        # Format results
        evidence_list = []
        for obj in objects:
            evidence_list.append({
                'storage_key': obj['Key'],
                'size': obj['Size'],
                'last_modified': obj['LastModified'].isoformat(),
                'etag': obj['ETag'].strip('"'),
                'evidence_id': obj['Key'].split('/')[-1].split('.')[0]
            })
        
        return evidence_list
    
    async def delete_evidence(self, storage_keys: List[str]) -> Dict[str, bool]:
        """Delete multiple evidence items in batch"""
        
        def _batch_delete():
            delete_objects = [{'Key': key} for key in storage_keys]
            
            response = self.s3_client.delete_objects(
                Bucket=self.config.bucket_name,
                Delete={'Objects': delete_objects}
            )
            
            deleted = {obj['Key']: True for obj in response.get('Deleted', [])}
            errors = {obj['Key']: False for obj in response.get('Errors', [])}
            
            return {**deleted, **errors}
        
        loop = asyncio.get_event_loop()
        results = await loop.run_in_executor(self.executor, _batch_delete)
        
        # Clear cache for deleted items
        for key in storage_keys:
            self._cache.pop(key, None)
            self._cache_ttl.pop(key, None)
        
        return results
    
    async def get_storage_metrics(self, customer_id: str) -> Dict[str, Any]:
        """Get storage usage metrics for customer"""
        
        def _calculate_metrics():
            prefix = f"evidence/{customer_id}/"
            
            paginator = self.s3_client.get_paginator('list_objects_v2')
            page_iterator = paginator.paginate(
                Bucket=self.config.bucket_name,
                Prefix=prefix
            )
            
            total_size = 0
            total_objects = 0
            by_type = {}
            
            for page in page_iterator:
                if 'Contents' in page:
                    for obj in page['Contents']:
                        total_size += obj['Size']
                        total_objects += 1
                        
                        # Categorize by file type
                        if 'screenshots' in obj['Key']:
                            by_type['screenshots'] = by_type.get('screenshots', 0) + obj['Size']
                        elif 'data' in obj['Key']:
                            by_type['data'] = by_type.get('data', 0) + obj['Size']
            
            return {
                'total_size_bytes': total_size,
                'total_size_mb': round(total_size / (1024 * 1024), 2),
                'total_objects': total_objects,
                'by_type': by_type,
                'cost_estimate_monthly': total_size * 0.000023  # €0.023 per GB/month
            }
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, _calculate_metrics)
    
    async def optimize_storage(self, customer_id: str) -> Dict[str, Any]:
        """Optimize storage by removing duplicates and old files"""
        
        evidence_list = await self.list_evidence(customer_id)
        
        # Find duplicates by size and potential content
        size_groups = {}
        for item in evidence_list:
            size = item['size']
            if size not in size_groups:
                size_groups[size] = []
            size_groups[size].append(item)
        
        duplicates = []
        for size, items in size_groups.items():
            if len(items) > 1:
                # Potential duplicates - would need content comparison
                duplicates.extend(items[1:])  # Keep first, mark others as duplicates
        
        # Find old files (>1 year)
        cutoff_date = datetime.utcnow() - timedelta(days=365)
        old_files = [
            item for item in evidence_list
            if datetime.fromisoformat(item['last_modified'].replace('Z', '+00:00')) < cutoff_date
        ]
        
        return {
            'total_items': len(evidence_list),
            'potential_duplicates': len(duplicates),
            'old_files': len(old_files),
            'savings_potential_mb': sum(item['size'] for item in duplicates + old_files) / (1024 * 1024),
            'duplicate_keys': [item['storage_key'] for item in duplicates],
            'old_file_keys': [item['storage_key'] for item in old_files]
        }


# Create singleton instance
def create_storage_service() -> HighPerformanceStorageService:
    """Create storage service with environment configuration"""
    
    config = StorageConfig(
        bucket_name=os.getenv('EVIDENCE_BUCKET', 'erip-evidence'),
        region=os.getenv('AWS_REGION', 'us-east-1'),
        encryption_key=os.getenv('ENCRYPTION_KEY')
    )
    
    return HighPerformanceStorageService(config)


# Global instance
storage_service = create_storage_service()