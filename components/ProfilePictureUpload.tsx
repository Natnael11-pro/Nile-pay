'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Camera, Upload, X, RotateCcw, Check, Move, CornerDownRight } from 'lucide-react';
import Image from 'next/image';
import SuccessDialog from './SuccessDialog';

interface ProfilePictureUploadProps {
  user: any;
  onUploadComplete?: (avatarUrl: string) => void;
}

const ProfilePictureUpload = ({ user, onUploadComplete }: ProfilePictureUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setIsOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropArea.x, y: e.clientY - cropArea.y });
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();

    if (isDragging) {
      const newX = Math.max(0, Math.min(e.clientX - dragStart.x, rect.width - cropArea.width));
      const newY = Math.max(0, Math.min(e.clientY - dragStart.y, rect.height - cropArea.height));
      setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      let newCropArea = { ...cropArea };

      switch (resizeHandle) {
        case 'se': // Southeast corner
          newCropArea.width = Math.max(50, Math.min(cropArea.width + deltaX, rect.width - cropArea.x));
          newCropArea.height = Math.max(50, Math.min(cropArea.height + deltaY, rect.height - cropArea.y));
          break;
        case 'sw': // Southwest corner
          const newWidth = Math.max(50, cropArea.width - deltaX);
          const newX = Math.max(0, cropArea.x + (cropArea.width - newWidth));
          newCropArea.width = newWidth;
          newCropArea.x = newX;
          newCropArea.height = Math.max(50, Math.min(cropArea.height + deltaY, rect.height - cropArea.y));
          break;
        case 'ne': // Northeast corner
          newCropArea.width = Math.max(50, Math.min(cropArea.width + deltaX, rect.width - cropArea.x));
          const newHeight = Math.max(50, cropArea.height - deltaY);
          const newY = Math.max(0, cropArea.y + (cropArea.height - newHeight));
          newCropArea.height = newHeight;
          newCropArea.y = newY;
          break;
        case 'nw': // Northwest corner
          const newWidthNW = Math.max(50, cropArea.width - deltaX);
          const newXNW = Math.max(0, cropArea.x + (cropArea.width - newWidthNW));
          const newHeightNW = Math.max(50, cropArea.height - deltaY);
          const newYNW = Math.max(0, cropArea.y + (cropArea.height - newHeightNW));
          newCropArea.width = newWidthNW;
          newCropArea.x = newXNW;
          newCropArea.height = newHeightNW;
          newCropArea.y = newYNW;
          break;
      }

      setCropArea(newCropArea);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, isResizing, dragStart, cropArea, resizeHandle]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const cropImage = () => {
    if (!selectedImage || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    // Set canvas size to desired output size
    canvas.width = 200;
    canvas.height = 200;

    // Calculate scale factors
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    // Draw cropped image
    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      200,
      200
    );

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCroppedImage(croppedDataUrl);
  };

  const uploadImage = async () => {
    if (!croppedImage) return;

    setIsUploading(true);
    try {
      // Convert data URL to blob
      const response = await fetch(croppedImage);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'profile-picture.jpg');
      formData.append('userId', user.id || user.$id);

      // Upload to API
      const uploadResponse = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();

      if (uploadResponse.ok) {
        onUploadComplete?.(result.avatarUrl);
        setIsOpen(false);
        setSelectedImage(null);
        setCroppedImage(null);
        setShowSuccessDialog(true);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const resetCrop = () => {
    setCropArea({ x: 0, y: 0, width: 200, height: 200 });
    setCroppedImage(null);
  };

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Picture
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload and customize your profile picture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            {/* Current Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                {user.avatar_url || user.avatarUrl ? (
                  <Image
                    src={user.avatar_url || user.avatarUrl}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {user.firstName?.[0] || user.first_name?.[0] || 'U'}
                  </span>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New Picture
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or GIF. Max size 5MB. Recommended: 200x200px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crop Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crop Your Profile Picture</DialogTitle>
            <DialogDescription>
              Drag the crop area to select the part of the image you want to use
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedImage && (
              <div className="relative inline-block">
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Selected"
                  className="max-w-full max-h-96 object-contain"
                  onLoad={() => {
                    if (imageRef.current) {
                      const rect = imageRef.current.getBoundingClientRect();
                      const size = Math.min(rect.width, rect.height, 200);
                      setCropArea({
                        x: (rect.width - size) / 2,
                        y: (rect.height - size) / 2,
                        width: size,
                        height: size
                      });
                    }
                  }}
                />
                
                {/* Crop Overlay */}
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/20 cursor-move select-none"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height,
                  }}
                  onMouseDown={handleDragStart}
                >
                  <div className="absolute inset-0 border border-white/50" />

                  {/* Resize Handles */}
                  <div
                    className="absolute w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
                    style={{ top: -6, left: -6 }}
                    onMouseDown={(e) => handleResizeStart(e, 'nw')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
                    style={{ top: -6, right: -6 }}
                    onMouseDown={(e) => handleResizeStart(e, 'ne')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
                    style={{ bottom: -6, left: -6 }}
                    onMouseDown={(e) => handleResizeStart(e, 'sw')}
                  />
                  <div
                    className="absolute w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
                    style={{ bottom: -6, right: -6 }}
                    onMouseDown={(e) => handleResizeStart(e, 'se')}
                  />

                  {/* Center move icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none">
                    <Move className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )}

            {/* Preview */}
            {croppedImage && (
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="inline-block w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                  <img src={croppedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Hidden Canvas for Cropping */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              
              <Button variant="outline" onClick={resetCrop}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              
              <Button onClick={cropImage} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Crop
              </Button>
              
              <Button
                onClick={uploadImage}
                disabled={!croppedImage || isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          window.location.reload();
        }}
        title="Profile Picture Updated"
        message="Your profile picture has been successfully updated and is now visible across your account."
        details={[
          'New profile picture is now active',
          'Changes are visible on all pages',
          'Image has been optimized for best quality',
          'Your Ethiopian Banking profile is updated'
        ]}
        icon={<Camera className="h-6 w-6 text-blue-500" />}
        color="blue"
        actionLabel="Continue"
        onAction={() => window.location.reload()}
      />
    </>
  );
};

export default ProfilePictureUpload;
