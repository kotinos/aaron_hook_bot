# Discord Hook Bot 🎯

A comprehensive Discord bot for generating viral content hooks using Google Gemini AI with advanced rate limiting, engagement scoring, and persistent data storage.

## Features

- **🤖 AI-Powered Hook Generation**: Uses Google Gemini AI to generate viral content hooks with proven opener/follow-up structures
- **🎯 Viral Scoring Algorithm**: 5-factor scoring system analyzing curiosity gap, emotional triggers, specificity, controversy, and action-oriented language
- **⚡ Rate Limiting**: 3 requests per user per 24 hours with persistent storage
- **📊 Engagement Scoring**: AI-powered scoring system for hook effectiveness with viral potential ranking
- **🔒 Secure & Robust**: Input validation, error handling, and SQL injection protection
- **📈 Analytics**: User statistics and request logging
- **🎨 Rich Discord Integration**: Slash commands with ephemeral responses

## Hook Types & AI Generation

### AI-Powered Hook Generation Process
1. **Context Analysis**: Gemini AI analyzes user input to extract key outcomes, solutions, and personal achievements
2. **Template Selection**: Combines opener and follow-up sentences from 80+ proven viral structures
3. **Viral Scoring**: 5-factor algorithm scores each hook for viral potential
4. **Top Selection**: Returns the 10 highest-scoring hooks with engagement predictions

### Hook Types Generated
1. **❓ Question Hooks** - Thought-provoking questions that engage curiosity
2. **🔍 Curiosity Gaps** - Creates information gaps that demand attention
3. **🔥 Controversial Statements** - Bold claims that spark discussion
4. **💔 Emotional Triggers** - Content that evokes strong emotional responses
5. **⚡ Urgency Hooks** - Time-sensitive content that demands immediate action
6. **📖 Storytelling Openers** - Personal narratives that draw readers in
7. **📊 Statistical Hooks** - Data-driven content that provides credibility
8. **🔄 Contrarian Takes** - Challenges conventional wisdom
9. **👤 Personal Anecdotes** - Relatable personal experiences
10. **💡 Actionable Tips** - Practical advice that provides immediate value

### Viral Scoring Factors
- **Curiosity Gap**: Measures information gaps and intrigue
- **Emotional Trigger**: Analyzes emotional impact and engagement
- **Specificity**: Evaluates concrete details and numbers
- **Controversy**: Assesses potential for discussion and debate
- **Action-Oriented**: Measures actionable content and clear next steps

## Commands

- `/hook enter <context>` - Generate 10 viral hooks based on your context
- `/status` - View bot health and your usage statistics

## Setup

### Prerequisites

- Node.js 18.0.0 or higher
- Discord Bot Token
- Discord Application with slash commands enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kotinos/aaron_hook_bot.git
cd aaron_hook_bot
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your Discord bot token
```

4. Start the bot:
```bash
npm start
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Discord Bot Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_GUILD_ID=your_discord_guild_id_here

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration
DATABASE_PATH=./data/bot.db

# Rate Limiting Configuration
RATE_LIMIT_REQUESTS=3
RATE_LIMIT_WINDOW_HOURS=24

# Logging Configuration
LOG_LEVEL=info

# Environment Configuration
NODE_ENV=production
```

### 🔑 Getting API Keys

**Google Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" and create a new project
4. Generate an API key and copy it to your `.env` file
5. The Gemini API is used for intelligent hook generation with proven viral structures

### Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token to your `.env` file
5. Go to "OAuth2" > "URL Generator"
6. Select scopes: `bot`, `applications.commands`
7. Select permissions: `Send Messages`, `Use Slash Commands`
8. Use the generated URL to invite the bot to your server

## Architecture

```
aaron_hook_bot/
├── index.js                 # Main bot entry point
├── config/
│   └── config.js           # Configuration management
├── database/
│   ├── manager.js          # SQLite database operations
│   └── schema.sql          # Database schema
├── utils/
│   ├── rateLimiter.js      # Rate limiting logic
│   ├── errorHandler.js     # Error handling utilities
│   └── logger.js           # Logging configuration
├── hooks/
│   └── generator.js        # Hook generation engine
├── commands/
│   ├── hook.js            # /hook command handler
│   └── status.js          # /status command handler
├── events/
│   ├── ready.js           # Bot ready event
│   └── interactionCreate.js # Interaction handling
└── data/                   # Database storage (auto-created)
```

## User Experience (UX) Guide

### Discord Interface Overview

The bot integrates seamlessly with Discord using modern slash commands. All responses are **ephemeral** (only visible to you), ensuring privacy and reducing channel clutter.

### Command Discovery

Users can discover commands by typing `/` in any channel where the bot is present:

```
/hook    - Generate viral content hooks
/status  - View bot health and usage stats
```

Discord's autocomplete will show available commands and their descriptions.

---

## Detailed UX Flows

### 🎯 Generating Hooks with `/hook enter`

#### Step 1: Command Input
```
/hook enter context: starting a fitness journey
```

**What the user sees:**
- Discord shows command autocomplete with parameter hints
- Required `context` parameter is clearly marked
- Character limit guidance (3-500 characters)

#### Step 2: Bot Processing
```
🤖 Bot is thinking... (ephemeral message appears)
```

**User experience:**
- Immediate feedback that command was received
- "Thinking" indicator shows processing is happening
- Typical response time: 1-3 seconds

#### Step 3: Hook Generation Response

**Full Response Example:**
```
🎯 **Your Viral Content Hooks** 🎯

**1. 🔥 Controversial Statement** (94% engagement)
Everyone says starting a fitness journey is about motivation. They're wrong.

**2. 💔 Emotional Trigger** (92% engagement)
This starting a fitness journey story will break your heart

**3. 🔍 Curiosity Gap** (90% engagement)
The secret behind starting a fitness journey that nobody talks about...

**4. 📖 Storytelling Opener** (89% engagement)
Three years ago, starting a fitness journey completely destroyed my life. Today, it saved it.

**5. ❓ Question Hook** (88% engagement)
What if I told you that starting a fitness journey could change everything you thought you knew?

**6. ⚡ Urgency Hook** (87% engagement)
You have 24 hours to understand starting a fitness journey before it's too late

**7. 🔄 Contrarian Take** (86% engagement)
While everyone obsesses over starting a fitness journey, I'm doing the opposite

**8. 📊 Statistical Hook** (84% engagement)
97% of people don't know this about starting a fitness journey

**9. 👤 Personal Anecdote** (83% engagement)
How starting a fitness journey changed my life in ways I never expected

**10. 💡 Actionable Tip** (81% engagement)
The 5-minute starting a fitness journey hack that changed everything

💡 *Tip: Higher engagement scores indicate hooks more likely to go viral!*

📊 **Usage**: 1/3 requests used | 2 remaining
⏰ **Resets**: 23h 59m
```

**UX Features:**
- ✅ **Ranked by engagement** - Highest scoring hooks appear first
- ✅ **Visual hierarchy** - Clear numbering, emojis, and formatting
- ✅ **Engagement scores** - Percentage indicates viral potential
- ✅ **Usage tracking** - Shows remaining requests clearly
- ✅ **Reset timer** - Exact time until rate limit resets
- ✅ **Ephemeral response** - Only visible to the user who ran the command

---

### 📊 Checking Status with `/status`

#### Command Input
```
/status
```

#### Response Example
```
🤖 Bot Status & Statistics

🟢 Bot Health
Status: Online
Uptime: 2h 34m
Memory: 45 MB
Database: Connected

📊 Your Usage
Requests Used: 1/3
Remaining: 2
Resets In: 23h 59m

📈 Your Statistics
Total Requests: 5
Successful: 5
Avg Response: 1,247ms

Hook Bot v1.0.0
```

**UX Features:**
- ✅ **Health indicators** - Green status shows everything working
- ✅ **Personal usage** - Your specific rate limit status
- ✅ **Historical stats** - Track your usage over time
- ✅ **Performance metrics** - Response time transparency

---

## Error Handling UX

### Rate Limit Exceeded
```
⏰ Rate Limit Exceeded

You've reached your limit of 3 requests per 24 hours. 
You can make 3 requests every 24 hours. Try again in 2h 15m.

Reset Time: 2h 15m
```

### Invalid Input
```
❌ Invalid Input

Context must be at least 3 characters long

If this error persists, please contact support
```

### Content Filter Triggered
```
❌ Invalid Input

Context contains inappropriate content

If this error persists, please contact support
```

---

## Mobile Experience

The bot works seamlessly on Discord mobile apps:

- **Touch-friendly** - Large tap targets for commands
- **Readable text** - Optimized formatting for small screens  
- **Quick access** - Slash commands work identically on mobile
- **Ephemeral responses** - Reduces notification spam

---

## Accessibility Features

- **Screen reader friendly** - Semantic formatting with clear headings
- **High contrast** - Emojis and formatting improve readability
- **Clear language** - Simple, direct messaging
- **Error guidance** - Specific, actionable error messages

---

## Privacy & Security UX

- **🔒 Ephemeral responses** - Your hooks are private to you
- **🛡️ No data retention** - Context isn't stored permanently
- **⚡ Rate limiting** - Prevents spam and ensures fair usage
- **🔍 Input validation** - Protects against malicious input

---

## Usage Examples by Context Type

### Business/Marketing
```
Input: "launching a new product"
Top Hook: "The uncomfortable truth about launching a new product that no one admits" (95%)
```

### Personal Development  
```
Input: "learning to code"
Top Hook: "Everyone says learning to code is about practice. They're wrong." (93%)
```

### Lifestyle
```
Input: "morning routines"
Top Hook: "What they don't want you to know about morning routines" (91%)
```

### Technology
```
Input: "AI replacing jobs"
Top Hook: "97% of people don't know this about AI replacing jobs" (89%)
```

## Rate Limiting

- **Limit**: 3 requests per user per 24 hours
- **Persistence**: Survives bot restarts
- **Reset**: Automatic 24-hour rolling windows
- **Feedback**: Clear messaging about remaining requests

## Error Handling

- Input validation (3-500 characters)
- Content filtering for inappropriate terms
- Graceful error messages
- Comprehensive logging
- Database transaction safety

## Development

### Scripts

```bash
npm start          # Start the bot
npm run dev        # Start with file watching
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
```

### Code Quality

- ESLint configuration for consistent code style
- Comprehensive error handling
- JSDoc comments throughout
- Modular architecture for maintainability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
- Create an issue on GitHub
- Contact: Aaron (aaronchanlin@gmail.com)

---

**Built with ❤️ using Discord.js v14, SQLite, and Node.js**
