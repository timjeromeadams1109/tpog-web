# TPOG Next.js - System Requirements

## PROJECT ISOLATION
- **STRICT SEPARATION**: This is a standalone church application
- **NO MIXING**: Completely separate from any other projects
- **COMPLETE DUPLICATE**: Replicate Flutter app functionality exactly
- **ADD CHATBOT**: Integrate AI chatbot (separate feature)

## SCREENS (Must Match Flutter App Exactly)

### 1. HomeScreen
- Full-viewport hero carousel (auto-rotate every 6s)
- Countdown timer to next service (days, hours, minutes, seconds)
- Smooth page indicators
- Cached network images

### 2. ChatScreen
- Welcome message from "Grace" AI assistant
- 5 suggested quick responses
- Message input field
- Chat message history (user vs bot)
- Typing indicator simulation
- Keyword-based responses:
  * "service" / "time" → service times
  * "give" / "tithe" / "donate" → giving info
  * "pastor" → pastor info
  * "events" → upcoming events
  * "prayer" → how to submit prayer requests

### 3. PrayerScreen
- List of APPROVED prayer requests only
- Category filtering (Health, Family, Financial, Guidance, Gratitude, Other)
- Prayer count tracking
- Prayer request submission form
- Anonymous checkbox
- Relative time display (just now, 5 mins ago, etc)

### 4. GiveScreen
- Scripture hero section (editable)
- Text to Give banner
- List of donation options with images
- Clickable links (launch URL)

### 5. LiveScreen
- Stream title
- Streaming platform links
- Simulated live chat (display only, not real messages)
- Viewer count simulator
- Chat input field (for Phase 2)

### 6. EventsScreen
- Event list (featured highlighted)
- Dynamic category filtering
- Each event: title, date, time, location, description, image, category
- RSVP toggle per event
- External registration URLs

### 7. PodcastsScreen
- Sermon episodes list
- Series names
- Episode images and descriptions
- Platform subscribe links (Spotify, Apple Podcasts, etc.)

### 8. VodScreen
- Video library list with thumbnails
- Platform filtering (All, YouTube, Facebook, Vimeo, Instagram)
- Video details: title, speaker, date, duration, platform, description, URL
- Clickable video links

## DATA TABLES (Supabase)

**Config:**
- app_settings (primary_color, app_name, logo_url)
- site_config (church_name, pastor_name, tagline, denomination)
- home_settings (countdown_date, show_countdown, hero_image_url)
- app_menu_items (navigation, dynamically ordered)

**Content:**
- hero_slides (carousel images)
- events (with featured, RSVP, categories)
- sermons/videos (VOD content)
- prayer_requests (approval needed)
- donations (giving options)
- custom_links (podcast platforms)

**User Data:**
- posts (community posts, from chat)
- prayer_requests (submitted, awaiting approval)

## CHATBOT FEATURE
- Separate from Flutter app replication
- AI-powered responses (not just keywords)
- Real conversation capability
- Integrated into chat screen but clearly identified as NEW feature

## ISOLATION REQUIREMENTS
- [ ] Separate GitHub branch
- [ ] Separate Vercel project
- [ ] Separate database connection (if needed)
- [ ] No code sharing with other projects
- [ ] No imports from external modules
- [ ] Type checking enforced
- [ ] Fully self-contained

