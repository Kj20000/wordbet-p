# Phonetic Audio Files Setup

This directory should contain MP3 files for alphabet letter sounds.

## File Naming Convention
- `a.mp3` - sound for letter A
- `b.mp3` - sound for letter B
- `c.mp3` - sound for letter C
- ... up to `z.mp3`

## Download Sources

### 1. FreeSound.org (Recommended)
- Visit: https://freesound.org/
- Search for "letter sounds", "phonics", "alphabet sounds", "A sound", "B sound", etc.
- Download high-quality MP3 files
- Make sure files are short (1-2 seconds each)

### 2. BBC Learning Phonics
- Search "BBC phonics sounds" on Google
- Professional recordings by native speakers

### 3. Educational Websites
- Starfall.com: Has complete phonics audio library
- Education.com: Free phonics resources
- ReadingA-Z.com: Professional letter sounds

### 4. Text-to-Speech Services (Quick Alternative)
- Google Translate: Type letters → Listen → Download audio
- NaturalReaders.com: Free TTS with download option
- TTSMP3.com: Convert text to MP3 instantly

## File Requirements
- Format: MP3
- Duration: 1-2 seconds per letter
- Quality: Clear, natural pronunciation
- Volume: Consistent across all files

## Setup Instructions
1. Download MP3 files for each letter (a-z)
2. Rename files to match the convention above (a.mp3, b.mp3, etc.)
3. Place all files in this `public/audio/phonics/` directory
4. Restart the development server

## Fallback Behavior
- If an MP3 file exists for a letter, it will play that file
- If no MP3 file exists, the app falls back to synthetic beep sounds
- You can mix and match - some letters with real audio, others with beeps

The app will automatically use these professional recordings instead of synthetic beeps, making your learning experience much more natural and educational!