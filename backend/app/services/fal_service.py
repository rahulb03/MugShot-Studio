import os
import fal_client
import httpx
import base64
from app.core.config import get_settings
from app.utils.logger import logger
from app.utils.exceptions import ModelGenerationException

settings = get_settings()

class FalService:
    def __init__(self):
        # FAL_KEY should be in environment variables
        pass
        
    def generate_image(self, prompt: str, model: str = "fal-ai/flux/dev", 
                      aspect_ratio: str = "16:9", num_images: int = 1):
        """
        Generate image using Fal.ai service.
        
        Args:
            prompt: Text prompt for image generation
            model: Model to use (default: fal-ai/flux/dev)
            aspect_ratio: Aspect ratio for generation
            num_images: Number of images to generate
            
        Returns:
            List of image data (URLs or base64)
        """
        # Map aspect ratio to image_size
        aspect_ratio_map = {
            "1:1": "square_hd",
            "16:9": "landscape_16_9",
            "9:16": "portrait_16_9",
            "3:2": "landscape_3_2",
            "2:3": "portrait_3_2"
        }
        
        image_size = aspect_ratio_map.get(aspect_ratio, "landscape_16_9")
        
        arguments = {
            "prompt": prompt,
            "image_size": image_size,
            "num_inference_steps": 28,
            "guidance_scale": 3.5,
            "num_images": num_images,
            "enable_safety_checker": True
        }
        
        logger.info(f"Generating image with Fal.ai model: {model}")
        
        try:
            handler = fal_client.submit(model, arguments=arguments)
            result = handler.get()
            
            # Process result
            images = []
            if result and "images" in result and len(result["images"]) > 0:
                for img in result["images"]:
                    if "url" in img:
                        # Download image and convert to base64 for consistency
                        try:
                            response = httpx.get(img["url"])
                            response.raise_for_status()
                            b64_image = base64.b64encode(response.content).decode('utf-8')
                            images.append(b64_image)
                        except Exception as e:
                            logger.warning(f"Failed to download image from URL: {str(e)}")
                            # Fallback to URL if download fails
                            images.append(img["url"])
            
            logger.info(f"Successfully generated {len(images)} images with Fal.ai")
            return images
            
        except Exception as e:
            logger.error(f"Fal generation failed: {str(e)}")
            raise ModelGenerationException(f"Failed to generate image with Fal: {str(e)}", model)