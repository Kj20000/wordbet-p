# Hybrid Phonics + TTS System for Kids Letter App

## Overview
The app now uses a **hybrid system** for audio feedback:
- **Individual Letters**: Phonics files (`/public/audio/phonics/*.mp3`)
- **Complete Words**: Text-to-Speech (TTS) with definition format: "a for apple"

## How It Works

### 1. Letter Typing (Phonics)
When a child types each letter:
- Plays the corresponding phonics file (e.g., `a.mp3`, `b.mp3`, etc.)
- Example: Typing "A" → plays `/audio/phonics/a.mp3`
- If no file exists, falls back to synthetic sounds
- Idle reminder repeats the current letter after 2.5 seconds

### 2. Word Completion (TTS)
When a complete word is typed:
- Uses browser's **Web Speech Synthesis API**
- Speaks the word in format: **"a for apple"**
- Example: Completing "APPLE" → speaks "a for apple"
- Automatically selects child-friendly voice if available
- Slightly slower rate (0.9x) and higher pitch (1.2x) for clarity

## File Changes

### 1. `/src/lib/audio.ts`
Added new functions:
- `speakWord(word: string, definition?: string)` - Speaks word with "X for Y" format
- `speakWordOnly(word: string)` - Speaks just the word

### 2. `/src/pages/Learning.tsx`
Updated to use hybrid system:
- **Import**: Added `speakWord` to audio imports
- **Initial Load**: Uses phonics for word and first letter
- **Letter Input**: Uses phonics for each letter typed
- **Word Complete**: Uses TTS to speak "a for apple" format
- **Idle Reminder**: Repeats phonics sound after 2.5 seconds

## Audio Files Structure
```
/public/audio/phonics/
├── a.mp3    (phonics sound for 'a')
├── b.mp3    (phonics sound for 'b')
├── c.mp3    (phonics sound for 'c')
...
└── z.mp3    (phonics sound for 'z')
```

## Browser Compatibility
- **Web Speech API**: Supported on Chrome, Edge, Safari, Firefox
- **Fallback**: If TTS fails, app gracefully falls back to phonics
- **Mobile**: Works on iOS Safari and Android Chrome

## Customization Options

### Change TTS Voice/Rate
Edit in `/src/lib/audio.ts` in `speakWord()`:
```typescript
utterance.rate = 0.9;     // Change from 0.9 (slower)
utterance.pitch = 1.2;    // Change from 1.2 (higher)
utterance.volume = 1.0;   // Change from 1.0 (louder)
```

### Add Custom Definition Words
When calling `speakWord()`:
```typescript
await speakWord('a', 'apple');     // "a for apple"
await speakWord('cat', 'meow');    // "cat for meow"
```

## Testing Checklist
- [ ] Typing letters plays phonics files
- [ ] Completing word triggers TTS "X for Y" speech
- [ ] Idle after 2.5s repeats the hint letter
- [ ] Audio stops when switching words
- [ ] Celebration animations still work
- [ ] Mobile device speakers work correctly

## Notes
- TTS pronunciation depends on browser language settings
- Some browsers may require user interaction before playing audio
- Phonics files use MP3 format (can be extended to WAV, OGG, etc.)
