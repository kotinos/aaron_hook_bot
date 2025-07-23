# Discord Hook Bot 🎯

A comprehensive Discord bot for generating viral content hooks with advanced rate limiting, engagement scoring, and persistent data storage.

## Features

- **🎯 Viral Hook Generation**: Generate 10 different types of engaging content hooks
- **⚡ Rate Limiting**: 3 requests per user per 24 hours with persistent storage
- **📊 Engagement Scoring**: AI-powered scoring system for hook effectiveness
- **🔒 Secure & Robust**: Input validation, error handling, and SQL injection protection
- **📈 Analytics**: User statistics and request logging
- **🎨 Rich Discord Integration**: Slash commands with ephemeral responses

## Hook Types

1. **❓ Question Hooks** - Thought-provoking questions
2. **🔍 Curiosity Gaps** - "What they don't want you to know"
3. **🔥 Controversial Statements** - Bold, attention-grabbing claims
4. **💔 Emotional Triggers** - Heart-touching stories
5. **⚡ Urgency Hooks** - Time-sensitive content
6. **📖 Storytelling Openers** - Personal narrative beginnings
7. **📊 Statistical Hooks** - Data-driven attention grabbers
8. **🔄 Contrarian Takes** - Against-the-grain perspectives
9. **👤 Personal Anecdotes** - Relatable personal experiences
10. **💡 Actionable Tips** - Practical, implementable advice

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
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DATABASE_PATH=./data/bot.db
RATE_LIMIT_REQUESTS=3
RATE_LIMIT_WINDOW_HOURS=24
LOG_LEVEL=info
NODE_ENV=production
```

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

## Usage Examples

### Generate Hooks
```
/hook enter context: starting a fitness journey
```

Response includes:
- 10 different hook types with emojis
- Engagement scores (70-98%)
- Usage statistics
- Time until rate limit reset

### Check Status
```
/status
```

Shows:
- Bot health and uptime
- Your usage statistics
- Request history and success rate

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
