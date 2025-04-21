# 📷 Image Uploader App

An intuitive, responsive, and fully-functional image uploader built using **HTML**, **CSS**, and **JavaScript**, integrated with **Cloudinary** for image storage. Users can drag and drop images, view upload progress, see thumbnails with metadata, and manage their uploads with ease.

## 🚀 Features

- ✅ Upload images via drag-and-drop or file picker
- 🖼️ Display uploaded images in a responsive grid layout
- ✍️ Auto-generated image titles (filename-based)
- 💾 Store uploaded image data in **localStorage** for persistence
- 🗑️ Delete individual images from UI and localStorage
- 📏 Show image dimensions, size (KB), and upload timestamp
- 📱 Fully responsive layout for mobile and desktop
- 💅 Hover effects and smooth transitions for better UX
- 🔀 Drag-and-drop to reorder images (with `SortableJS`)

## 📸 Demo

![Demo Preview](demo-preview.gif)  
_Optional: Insert a demo video or gif here._

## 🧠 Tech Stack

- HTML5
- CSS3
- JavaScript (ES6)
- [Cloudinary](https://cloudinary.com/) – for image hosting
- [SortableJS](https://github.com/SortableJS/Sortable) – for drag-and-drop sorting

## 🛠️ How It Works

1. **Select or drag images** into the upload area.
2. Images are uploaded to **Cloudinary** using an **unsigned upload preset**.
3. The uploaded image URL and metadata are saved to `localStorage`.
4. Images are displayed in a gallery format with titles, size, dimensions, and delete buttons.
5. Users can reorder images using drag-and-drop.
