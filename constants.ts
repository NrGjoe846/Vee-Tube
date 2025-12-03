import { Movie, Category } from './types';

export const VIDEO_SOURCE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; 
export const VIDEO_SOURCE_2 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";

// --- POLITICAL CONTENT MOCK DATA ---

export const MOCK_POLITICAL_CONTENT: Movie[] = [
  // Hero / Featured
  {
    id: '1',
    title: 'State of the Union: Behind Closed Doors',
    description: 'An exclusive, unfiltered look at the negotiations happening behind the scenes of the latest budget bill. We interview key senators on both sides of the aisle.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&q=80&w=600',
    coverUrl: 'https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&q=80&w=1920',
    videoUrl: VIDEO_SOURCE,
    duration: '58m',
    year: 2024,
    genre: ['Documentary', 'Exclusive'],
    rating: 'PG-13',
    type: 'interview',
    channelName: 'Capitol Insider',
    isOriginal: true
  },
  {
    id: '2',
    title: 'The Great Debate 2024',
    description: 'The final showdown before election day. Full unedited coverage of the presidential debate featuring expert analysis and fact-checking in real-time.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&q=80&w=600',
    coverUrl: 'https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&q=80&w=1920',
    videoUrl: VIDEO_SOURCE_2,
    duration: '2h 15m',
    year: 2024,
    genre: ['Live Event', 'Debate'],
    rating: 'TV-14',
    type: 'live',
    channelName: 'Medai News',
    views: '12M views'
  },
  {
    id: '3',
    title: 'Policy & Pints: Economy Special',
    description: 'Economists and politicians sit down for a casual but heated discussion about inflation, taxes, and the future of the free market.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600',
    coverUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1920',
    videoUrl: VIDEO_SOURCE,
    duration: '1h 30m',
    year: 2024,
    genre: ['Podcast', 'Economy'],
    rating: 'TV-MA',
    type: 'podcast',
    channelName: 'The Fiscal Note'
  },
  
  // Live Now
  {
    id: '4',
    title: '🔴 Senate Floor Live Coverage',
    description: 'Live broadcast from the Senate floor as voting begins on the healthcare reform act.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=600',
    coverUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=1920',
    videoUrl: VIDEO_SOURCE_2,
    duration: 'LIVE',
    year: 2024,
    genre: ['News', 'Live'],
    rating: 'G',
    type: 'live',
    channelName: 'C-SPAN Feed',
    views: '45K watching'
  },
  {
    id: '5',
    title: '🔴 Breaking: Press Briefing',
    description: 'The Press Secretary addresses the nation regarding the international summit.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529101091760-6149d4c46b29?auto=format&fit=crop&q=80&w=600',
    coverUrl: 'https://images.unsplash.com/photo-1529101091760-6149d4c46b29?auto=format&fit=crop&q=80&w=1920',
    videoUrl: VIDEO_SOURCE,
    duration: 'LIVE',
    year: 2024,
    genre: ['Breaking News'],
    rating: 'G',
    type: 'live',
    channelName: 'White House Feed',
    views: '112K watching'
  },

  // Podcasts
  {
    id: '6',
    title: 'The Daily Briefing',
    description: 'Your morning download of everything happening in Washington D.C.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=600',
    coverUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&q=80&w=1920',
    videoUrl: VIDEO_SOURCE_2,
    duration: '25m',
    year: 2024,
    genre: ['Podcast', 'Daily News'],
    rating: 'PG',
    type: 'podcast',
    channelName: 'Morning Wire'
  },
  {
    id: '7',
    title: 'Left, Right & Center',
    description: 'A civilized debate from all sides of the political spectrum.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600',
    coverUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1920',
    videoUrl: VIDEO_SOURCE,
    duration: '45m',
    year: 2024,
    genre: ['Podcast', 'Debate'],
    rating: 'PG-13',
    type: 'podcast',
    channelName: 'KCRW'
  },

  // Trending Interviews
  {
    id: '8',
    title: 'One on One with the Governor',
    description: 'A candid conversation about state rights and federal overreach.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=600',
    coverUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=1920',
    videoUrl: VIDEO_SOURCE_2,
    duration: '32m',
    year: 2024,
    genre: ['Interview', 'State Politics'],
    rating: 'PG',
    type: 'interview',
    channelName: 'State Focus'
  },

  // Reels (Vertical Shorts)
  {
    id: 'r1',
    title: 'Senate Walkout! 😱',
    description: 'Shocking moment during the hearing today.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
    coverUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400&h=711', // Vertical crop simulation
    videoUrl: VIDEO_SOURCE,
    duration: '45s',
    year: 2024,
    genre: ['Shorts', 'Viral'],
    rating: 'PG-13',
    type: 'reel',
    channelName: 'PolitiClips'
  },
  {
    id: 'r2',
    title: 'Best Debate Zinger 🔥',
    description: 'He really said that live on air.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&q=80&w=400',
    coverUrl: 'https://images.unsplash.com/photo-1544144433-d50aff500b91?auto=format&fit=crop&q=80&w=400&h=711',
    videoUrl: VIDEO_SOURCE,
    duration: '59s',
    year: 2024,
    genre: ['Shorts', 'Funny'],
    rating: 'PG',
    type: 'reel',
    channelName: 'Campaign Trail'
  },
  {
    id: 'r3',
    title: 'Protest outside City Hall',
    description: 'Thousands gather for the march.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=400',
    coverUrl: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=400&h=711',
    videoUrl: VIDEO_SOURCE,
    duration: '30s',
    year: 2024,
    genre: ['Shorts', 'News'],
    rating: 'PG-13',
    type: 'reel',
    channelName: 'Citizen Journalist'
  },
  {
    id: 'r4',
    title: 'Vote Today! 🗳️',
    description: 'Reminder to hit the polls.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&q=80&w=400',
    coverUrl: 'https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&q=80&w=400&h=711',
    videoUrl: VIDEO_SOURCE,
    duration: '15s',
    year: 2024,
    genre: ['Shorts', 'PSA'],
    rating: 'G',
    type: 'reel',
    channelName: 'VoteNow'
  },
    {
    id: 'r5',
    title: 'Mic Drop Moment',
    description: 'Ending the speech with a bang.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1529101091760-6149d4c46b29?auto=format&fit=crop&q=80&w=400',
    coverUrl: 'https://images.unsplash.com/photo-1529101091760-6149d4c46b29?auto=format&fit=crop&q=80&w=400&h=711',
    videoUrl: VIDEO_SOURCE,
    duration: '22s',
    year: 2024,
    genre: ['Shorts', 'Speech'],
    rating: 'G',
    type: 'reel',
    channelName: 'SpeechArchive'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'trending-interviews',
    title: 'Trending Interviews',
    movies: [MOCK_POLITICAL_CONTENT[0], MOCK_POLITICAL_CONTENT[7], MOCK_POLITICAL_CONTENT[2], MOCK_POLITICAL_CONTENT[5]],
    type: 'interview'
  },
  {
    id: 'live-now',
    title: 'Live Now',
    movies: [MOCK_POLITICAL_CONTENT[3], MOCK_POLITICAL_CONTENT[4], MOCK_POLITICAL_CONTENT[1]],
    type: 'live'
  },
  {
    id: 'top-podcasts',
    title: 'Top Political Podcasts',
    movies: [MOCK_POLITICAL_CONTENT[5], MOCK_POLITICAL_CONTENT[6], MOCK_POLITICAL_CONTENT[2]],
    type: 'podcast'
  },
  {
    id: 'recommended',
    title: 'Recommended For You',
    movies: [MOCK_POLITICAL_CONTENT[1], MOCK_POLITICAL_CONTENT[0], MOCK_POLITICAL_CONTENT[6], MOCK_POLITICAL_CONTENT[7]],
    type: 'movie'
  },
  {
    id: 'reels-row',
    title: 'Reels For You',
    movies: [MOCK_POLITICAL_CONTENT[8], MOCK_POLITICAL_CONTENT[9], MOCK_POLITICAL_CONTENT[10], MOCK_POLITICAL_CONTENT[11], MOCK_POLITICAL_CONTENT[12]],
    type: 'reel'
  }
];