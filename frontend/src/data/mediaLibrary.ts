import { MediaItem } from '../components/Media/MediaPlayer';

// Wellness-focused media library
export const mediaLibrary: MediaItem[] = [
  // Relaxation Music
  {
    id: 'relaxing-music-1',
    title: 'Peaceful Piano Meditation',
    description: 'Gentle piano melodies to help you relax and unwind',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder - replace with actual content
    category: 'relaxation',
    duration: 600
  },
  {
    id: 'relaxing-music-2',
    title: 'Nature Sounds & Rain',
    description: 'Soothing rain sounds with gentle nature ambiance',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder - replace with actual content
    category: 'nature',
    duration: 900
  },
  {
    id: 'relaxing-music-3',
    title: 'Ocean Waves Meditation',
    description: 'Calming ocean waves to wash away stress and anxiety',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder - replace with actual content
    category: 'meditation',
    duration: 1200
  },
  {
    id: 'relaxing-music-4',
    title: 'Soft Ambient Music',
    description: 'Gentle ambient sounds perfect for focus and relaxation',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder - replace with actual content
    category: 'music',
    duration: 720
  },

  // Meditation Videos
  {
    id: 'meditation-video-1',
    title: '5-Minute Breathing Meditation',
    description: 'Quick guided breathing exercise to center yourself',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Placeholder - replace with actual content
    thumbnail: 'https://via.placeholder.com/400x225/4299e1/ffffff?text=Breathing+Meditation',
    category: 'meditation',
    duration: 300
  },
  {
    id: 'meditation-video-2',
    title: '10-Minute Mindfulness Practice',
    description: 'Gentle mindfulness meditation for mental clarity',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', // Placeholder - replace with actual content
    thumbnail: 'https://via.placeholder.com/400x225/48bb78/ffffff?text=Mindfulness+Practice',
    category: 'meditation',
    duration: 600
  },
  {
    id: 'meditation-video-3',
    title: 'Progressive Muscle Relaxation',
    description: 'Full body relaxation technique to release tension',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Placeholder - replace with actual content
    thumbnail: 'https://via.placeholder.com/400x225/9f7aea/ffffff?text=Muscle+Relaxation',
    category: 'relaxation',
    duration: 900
  },

  // Nature Videos
  {
    id: 'nature-video-1',
    title: 'Forest Walk Visualization',
    description: 'Immersive forest experience for stress relief',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', // Placeholder - replace with actual content
    thumbnail: 'https://via.placeholder.com/400x225/38a169/ffffff?text=Forest+Walk',
    category: 'nature',
    duration: 1200
  },
  {
    id: 'nature-video-2',
    title: 'Sunrise Over Mountains',
    description: 'Peaceful mountain sunrise for morning meditation',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', // Placeholder - replace with actual content
    thumbnail: 'https://via.placeholder.com/400x225/ed8936/ffffff?text=Mountain+Sunrise',
    category: 'nature',
    duration: 600
  },

  // Therapeutic Content
  {
    id: 'therapy-audio-1',
    title: 'Anxiety Relief Meditation',
    description: 'Guided meditation specifically designed for anxiety management',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder - replace with actual content
    category: 'therapy',
    duration: 900
  },
  {
    id: 'therapy-audio-2',
    title: 'Sleep Stories for Rest',
    description: 'Calming bedtime stories to help with insomnia',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder - replace with actual content
    category: 'therapy',
    duration: 1800
  }
];

// Helper functions for media search and filtering
export const searchMedia = (query: string): MediaItem[] => {
  const lowerQuery = query.toLowerCase();
  return mediaLibrary.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  );
};

export const getMediaByCategory = (category: MediaItem['category']): MediaItem[] => {
  return mediaLibrary.filter(item => item.category === category);
};

export const getRandomMedia = (category?: MediaItem['category']): MediaItem => {
  const filteredMedia = category ? getMediaByCategory(category) : mediaLibrary;
  return filteredMedia[Math.floor(Math.random() * filteredMedia.length)];
};

// Keywords for AI to detect media requests
export const mediaKeywords = {
  relaxation: ['relax', 'relaxing', 'calm', 'peaceful', 'stress relief', 'unwind'],
  meditation: ['meditate', 'meditation', 'mindfulness', 'breathing', 'center'],
  nature: ['nature', 'forest', 'ocean', 'rain', 'birds', 'water', 'natural'],
  music: ['music', 'song', 'play music', 'melody', 'tune'],
  video: ['video', 'watch', 'show me', 'play video'],
  audio: ['audio', 'sound', 'listen', 'hear'],
  therapy: ['anxiety', 'depression', 'sleep', 'insomnia', 'therapy', 'therapeutic']
};

// Function to detect media requests in user messages
export const detectMediaRequest = (message: string): {
  hasMediaRequest: boolean;
  requestedCategory?: MediaItem['category'];
  requestedType?: 'audio' | 'video';
  suggestedMedia?: MediaItem;
} => {
  const lowerMessage = message.toLowerCase();
  
  // Check for specific media requests
  let requestedCategory: MediaItem['category'] | undefined;
  let requestedType: 'audio' | 'video' | undefined;

  // Detect category
  for (const [category, keywords] of Object.entries(mediaKeywords)) {
    if (category === 'video' || category === 'audio') continue;
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      requestedCategory = category as MediaItem['category'];
      break;
    }
  }

  // Detect type
  if (mediaKeywords.video.some(keyword => lowerMessage.includes(keyword))) {
    requestedType = 'video';
  } else if (mediaKeywords.audio.some(keyword => lowerMessage.includes(keyword)) || 
             mediaKeywords.music.some(keyword => lowerMessage.includes(keyword))) {
    requestedType = 'audio';
  }

  // Check if it's a media request
  const hasMediaRequest = Boolean(
    requestedCategory || 
    requestedType || 
    ['play', 'show', 'listen', 'watch'].some(verb => lowerMessage.includes(verb))
  );

  let suggestedMedia: MediaItem | undefined;
  if (hasMediaRequest) {
    // Get appropriate media based on request
    if (requestedCategory && requestedType) {
      const categoryMedia = getMediaByCategory(requestedCategory).filter(m => m.type === requestedType);
      suggestedMedia = categoryMedia.length > 0 ? 
        categoryMedia[Math.floor(Math.random() * categoryMedia.length)] : 
        getRandomMedia(requestedCategory);
    } else if (requestedCategory) {
      suggestedMedia = getRandomMedia(requestedCategory);
    } else if (requestedType) {
      const typeMedia = mediaLibrary.filter(m => m.type === requestedType);
      suggestedMedia = typeMedia[Math.floor(Math.random() * typeMedia.length)];
    } else {
      suggestedMedia = getRandomMedia();
    }
  }

  return {
    hasMediaRequest,
    requestedCategory,
    requestedType,
    suggestedMedia
  };
};
