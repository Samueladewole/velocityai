from typing import Dict, List, Any, Optional
import asyncio
from playwright.async_api import async_playwright, Page, Browser
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential
import hashlib
import json
from datetime import datetime
import aiohttp
from ..core.celery_app import app, rate_limiter, circuit_breaker

logger = structlog.get_logger()

class BrowserPool:
    """Efficient browser instance pooling"""
    def __init__(self, max_browsers=10):
        self.max_browsers = max_browsers
        self.browsers: Dict[str, Browser] = {}
        self.locks = {}
        self._playwright = None
    
    async def get_browser(self, browser_type='chromium') -> Browser:
        if browser_type not in self.browsers:
            if not self._playwright:
                self._playwright = await async_playwright().start()
            
            browser = await getattr(self._playwright, browser_type).launch(
                headless=True,
                args=[
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-blink-features=AutomationControlled'
                ]
            )
            self.browsers[browser_type] = browser
        
        return self.browsers[browser_type]
    
    async def cleanup(self):
        for browser in self.browsers.values():
            await browser.close()
        if self._playwright:
            await self._playwright.stop()

browser_pool = BrowserPool()

@app.task(bind=True, name='agents.tasks.browser.capture_evidence')
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
async def capture_evidence(
    self,
    customer_id: str,
    workflow_id: str,
    target_url: str,
    selectors: List[str],
    framework_id: str,
    control_id: str,
    instructions: Optional[str] = None
) -> Dict[str, Any]:
    """Efficiently capture evidence from web pages"""
    
    # Rate limiting
    if not rate_limiter.is_allowed(f"browser:{customer_id}"):
        raise Exception("Rate limit exceeded")
    
    task_id = self.request.id
    evidence_items = []
    
    try:
        browser = await browser_pool.get_browser()
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='ERIP Compliance Agent/2.0',
            ignore_https_errors=True,
            locale='en-US',
            timezone_id='America/New_York'
        )
        
        page = await context.new_page()
        
        # Navigate with smart waiting
        await page.goto(target_url, wait_until='domcontentloaded', timeout=30000)
        
        # Wait for dynamic content
        await page.wait_for_load_state('networkidle', timeout=10000)
        
        # Execute custom instructions if provided
        if instructions:
            await execute_natural_language_instructions(page, instructions)
        
        # Capture evidence for each selector
        for selector in selectors:
            try:
                evidence = await capture_selector_evidence(
                    page, selector, customer_id, framework_id, control_id
                )
                evidence_items.append(evidence)
            except Exception as e:
                logger.warning(
                    "selector_capture_failed",
                    selector=selector,
                    error=str(e)
                )
        
        # Take full page screenshot as backup
        full_screenshot = await capture_full_page_screenshot(
            page, customer_id, framework_id, control_id
        )
        evidence_items.append(full_screenshot)
        
        await context.close()
        
        return {
            'task_id': task_id,
            'status': 'completed',
            'evidence_count': len(evidence_items),
            'evidence_items': evidence_items
        }
        
    except Exception as e:
        logger.error(
            "browser_task_failed",
            task_id=task_id,
            error=str(e)
        )
        raise

async def capture_selector_evidence(
    page: Page,
    selector: str,
    customer_id: str,
    framework_id: str,
    control_id: str
) -> Dict[str, Any]:
    """Capture evidence for a specific selector"""
    
    # Smart selector resolution
    element = await find_element_smart(page, selector)
    
    if not element:
        raise Exception(f"Element not found: {selector}")
    
    # Scroll element into view
    await element.scroll_into_view_if_needed()
    await page.wait_for_timeout(500)  # Brief pause for rendering
    
    # Take element screenshot
    screenshot_bytes = await element.screenshot()
    
    # Extract text content
    text_content = await element.text_content()
    
    # Get element attributes
    attributes = await element.evaluate('''
        (element) => {
            const attrs = {};
            for (const attr of element.attributes) {
                attrs[attr.name] = attr.value;
            }
            return attrs;
        }
    ''')
    
    # Generate evidence ID
    evidence_id = hashlib.sha256(
        f"{customer_id}:{framework_id}:{control_id}:{selector}:{datetime.utcnow().isoformat()}".encode()
    ).hexdigest()[:16]
    
    # Store evidence efficiently
    evidence_url = await store_evidence_efficient(
        evidence_id, screenshot_bytes, customer_id
    )
    
    return {
        'id': evidence_id,
        'type': 'element_screenshot',
        'url': evidence_url,
        'selector': selector,
        'text_content': text_content,
        'attributes': attributes,
        'framework_id': framework_id,
        'control_id': control_id,
        'captured_at': datetime.utcnow().isoformat(),
        'validation_status': 'pending'
    }

async def find_element_smart(page: Page, selector: str) -> Any:
    """Smart element finding with multiple strategies"""
    
    strategies = [
        lambda: page.query_selector(selector),
        lambda: page.get_by_text(selector),
        lambda: page.get_by_label(selector),
        lambda: page.get_by_placeholder(selector),
        lambda: page.get_by_alt_text(selector),
        lambda: page.get_by_title(selector),
        lambda: page.query_selector(f"[aria-label*='{selector}']"),
        lambda: page.query_selector(f"[title*='{selector}']"),
    ]
    
    for strategy in strategies:
        try:
            element = await strategy()
            if element:
                return element
        except:
            continue
    
    return None

async def execute_natural_language_instructions(page: Page, instructions: str):
    """Execute natural language instructions efficiently"""
    
    # Parse instructions into actions
    actions = parse_instructions(instructions)
    
    for action in actions:
        if action['type'] == 'click':
            element = await find_element_smart(page, action['target'])
            if element:
                await element.click()
                await page.wait_for_load_state('networkidle', timeout=5000)
        
        elif action['type'] == 'fill':
            element = await find_element_smart(page, action['target'])
            if element:
                await element.fill(action['value'])
        
        elif action['type'] == 'wait':
            await page.wait_for_timeout(action['duration'])
        
        elif action['type'] == 'navigate':
            await page.goto(action['url'], wait_until='domcontentloaded')

def parse_instructions(instructions: str) -> List[Dict[str, Any]]:
    """Parse natural language into executable actions"""
    
    actions = []
    instructions_lower = instructions.lower()
    
    # Simple pattern matching for common actions
    if 'click' in instructions_lower:
        # Extract what to click
        parts = instructions.split('click')
        if len(parts) > 1:
            target = parts[1].strip().strip('"\'')
            actions.append({'type': 'click', 'target': target})
    
    if 'fill' in instructions_lower or 'type' in instructions_lower:
        # Extract field and value
        import re
        match = re.search(r'(fill|type)\s+(.+?)\s+with\s+(.+)', instructions_lower)
        if match:
            actions.append({
                'type': 'fill',
                'target': match.group(2).strip(),
                'value': match.group(3).strip().strip('"\'')
            })
    
    if 'wait' in instructions_lower:
        # Extract wait duration
        import re
        match = re.search(r'wait\s+(\d+)', instructions_lower)
        if match:
            actions.append({
                'type': 'wait',
                'duration': int(match.group(1)) * 1000
            })
    
    return actions

async def capture_full_page_screenshot(
    page: Page,
    customer_id: str,
    framework_id: str,
    control_id: str
) -> Dict[str, Any]:
    """Capture full page screenshot efficiently"""
    
    screenshot_bytes = await page.screenshot(full_page=True)
    
    evidence_id = hashlib.sha256(
        f"{customer_id}:{framework_id}:{control_id}:full_page:{datetime.utcnow().isoformat()}".encode()
    ).hexdigest()[:16]
    
    evidence_url = await store_evidence_efficient(
        evidence_id, screenshot_bytes, customer_id
    )
    
    return {
        'id': evidence_id,
        'type': 'full_page_screenshot',
        'url': evidence_url,
        'page_url': page.url,
        'page_title': await page.title(),
        'framework_id': framework_id,
        'control_id': control_id,
        'captured_at': datetime.utcnow().isoformat(),
        'validation_status': 'pending'
    }

async def store_evidence_efficient(
    evidence_id: str,
    data: bytes,
    customer_id: str
) -> str:
    """Store evidence with efficient compression and encryption"""
    
    # Compress data
    import zlib
    compressed_data = zlib.compress(data, level=6)
    
    # Encrypt data
    from cryptography.fernet import Fernet
    import os
    key = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
    f = Fernet(key)
    encrypted_data = f.encrypt(compressed_data)
    
    # Store in S3 with intelligent tiering
    import boto3
    s3 = boto3.client('s3')
    
    key = f"evidence/{customer_id}/{evidence_id}"
    s3.put_object(
        Bucket=os.getenv('EVIDENCE_BUCKET', 'erip-evidence'),
        Key=key,
        Body=encrypted_data,
        StorageClass='INTELLIGENT_TIERING',
        ServerSideEncryption='AES256',
        Metadata={
            'customer_id': customer_id,
            'evidence_id': evidence_id,
            'compressed': 'true',
            'encrypted': 'true'
        }
    )
    
    # Return signed URL
    url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': os.getenv('EVIDENCE_BUCKET', 'erip-evidence'), 'Key': key},
        ExpiresIn=3600
    )
    
    return url

@app.task(bind=True, name='agents.tasks.browser.batch_capture')
async def batch_capture_evidence(
    self,
    customer_id: str,
    workflows: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """Batch capture evidence for multiple workflows efficiently"""
    
    results = []
    browser = await browser_pool.get_browser()
    
    # Create single context for all captures
    context = await browser.new_context(
        viewport={'width': 1920, 'height': 1080},
        user_agent='ERIP Compliance Agent/2.0',
        ignore_https_errors=True
    )
    
    try:
        # Process workflows in parallel with controlled concurrency
        sem = asyncio.Semaphore(3)  # Max 3 concurrent pages
        
        async def process_workflow(workflow):
            async with sem:
                page = await context.new_page()
                try:
                    result = await capture_evidence(
                        self,
                        customer_id,
                        workflow['id'],
                        workflow['url'],
                        workflow['selectors'],
                        workflow['framework_id'],
                        workflow['control_id'],
                        workflow.get('instructions')
                    )
                    return result
                finally:
                    await page.close()
        
        results = await asyncio.gather(
            *[process_workflow(w) for w in workflows],
            return_exceptions=True
        )
        
    finally:
        await context.close()
    
    return {
        'task_id': self.request.id,
        'total_workflows': len(workflows),
        'successful': sum(1 for r in results if not isinstance(r, Exception)),
        'failed': sum(1 for r in results if isinstance(r, Exception)),
        'results': results
    }