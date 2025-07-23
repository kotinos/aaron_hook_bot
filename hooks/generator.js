import { GoogleGenAI } from '@google/genai';
import { config } from '../config/config.js';
import { logger } from '../utils/logger.js';
import { ValidationError } from '../utils/errorHandler.js';
import { viralScorer } from '../utils/viralScoring.js';

class HookGenerator {
  constructor() {
    this.ai = new GoogleGenAI(config.gemini.apiKey);
    
    this.openerTemplates = [
      'Here\'s exactly how to [outcome]. [solution].',
      'Here\'s exactly how you\'re gonna [outcome].',
      'Here\'s the exact 3 step process to [outcome].',
      'Here\'s exactly how to NEVER [opposite of outcome].',
      'Here\'s the only [solution] that will let you [personal outcome].',
      'Here\'s the only method/way/strategy/hack that will let you [personal outcome].',
      'Here\'s the only guide to [solution] you will ever need.',
      'Here\'s how to never [opposite of solution] for the rest of your life.',
      'Alright if I was you and I needed to [outcome] really quickly, I\'m gonna tell you exactly what I would do. Free sauce.',
      'You ever see videos on Youtube of [outcome], and you\'re like how the hell is that even possible?',
      'Everybody that tells you that you don\'t need to [solution] to [outcome] is lying to you.',
      'If there\'s one piece of advice about how to [outcome] today, please let it be this.',
      'If you wanna [outcome] in 3 months time, here\'s your 5 step checklist for you to do right now, if you just do this I promise you\'ll [outcome]. Step 1…',
      'A lot of people who wanna [outcome] fail to do so because they\'re not [solution].',
      'Wanna know why most people never [outcome]?',
      'Here\'s how to stop [opposite of outcome]. [Solution].',
      'If I was young again and I had to [personal outcome] all over again, this is exactly how I\'d do it.',
      'I\'m gonna show you exactly how to [outcome] in a very very specific way.',
      'Alright I\'m gonna teach you exactly how to [outcome] in one video.',
      'Here\'s the story of how I accidentally [personal outcome].',
      'You ever see people who just have [outcome], and you kinda wonder like, what it is that makes them so special?',
      'You ever see people who seem to [outcome] SO easily, and you kinda wonder like, what it is that makes them so special?',
      'In 60 seconds I\'m going to logically prove to you how you can literally [outcome].',
      'Here\'s why you should [solution].',
      'Here\'s how to [outcome]. Stop [solution, if about quitting something].',
      'Here\'s how to [outcome]. [Solution].',
      'Here\'s the ONE [solution] I used to [outcome]. Like I [personal outcome] literally just spamming this ONE [solution].',
      'Here\'s how to [outcome]. The solution that\'s always worked for me is [solution].',
      'Here\'s how to stop [opposite of outcome]. Stop [solution, if about quitting something].',
      'Today, we\'re gonna be talking about how to [outcome].',
      'Alright this is the single easiest way to [outcome].',
      'If you want to instantly [outcome], this is the ONLY video you will ever need to watch.',
      'Here\'s exactly how you\'re gonna [outcome] in 2025. You\'re gonna [solution].',
      'Here\'s the only video you will ever need to watch to [outcome].',
      'Here\'s the strategy I used to [outcome]. I used a strategy I like to call [solution].',
      'The easiest way to [outcome] is to [solution].',
      'The way to instantly [outcome] is to simply [solution].',
      'If there\'s one thing you can do to [outcome] that actually takes ZERO work, it\'s this.',
      'If you\'re tired of [opposite of outcome], here\'s the ultimate guide to [outcome]. Take notes and thank me later.',
      'If you\'re tired of never [outcome], you NEED to watch this video.',
      'I\'m gonna give you guys my BEST [solution] as someone who [personal outcome] that\'s literally gonna help you [outcome].',
      'So I heard you wanna [outcome]. This is the SIMPLEST and BEST way to [outcome], coming from a guy whose [personal outcome].',
      'Here\'s exactly how you\'re gonna [verb] your first [outcome].',
      'I get this question SO often. How did you [personal outcome]? And I literally just [solution].',
      'Here\'s some unethical life hacks to [outcome] that you definitely shouldn\'t use.',
      'Here\'s exactly how you\'re gonna [outcome] in the next 60 seconds.',
      'Here\'s exactly how I [personal outcome]. I [solution].',
      'I [personal outcome], and I just wanna break down the exact [solution] I used to get such crazy results.',
      'I recently [personal outcome], and I just wanna break down the exact [solution] I used to get such crazy results.',
      'So you failed to [personal outcome]. Tough love, but it\'s because you didn\'t [solution].',
      'Here\'s how to ACTUALLY [outcome]. [Solution].',
      'Here\'s how to NOT [opposite of outcome]. Stop [opposite of solution]',
      'It is officially the easiest time to [outcome], and I\'m gonna give yall all the sauce on how you\'re gonna [outcome] in the next week.',
      'In 60 seconds, I\'ll show you how to [outcome].',
      'I\'m gonna show you exactly how to become a [outcome] in one video.',
      'I\'m gonna show you exactly how to get over your [outcome] in one video.',
      'It took me 4 years to learn what I\'m about to teach you in a minute and a half.',
      'This is how to [outcome]. What you\'re gonna need is a [solution]. What is a [solution]?',
      'Every day I [personal outcome], and here are my 8 tips to [personal outcome].',
      'After years of [personal outcome], these are the 6 rules of [outcome] I know to be true.',
      'After years of research, I\'ve developed the greatest routine to [outcome]. Here are the 7 steps you should take every day.',
      'I just completed [personal outcome]. Here\'s why I haven\'t stopped.',
      '3 steps for becoming [outcome].',
      '5 principles for becoming [outcome].',
      '3 things I wish I knew in my early 20s. [solution].',
      '4 ways to [outcome].',
      '5 things you need to know if you want to [outcome].',
      'This goes out to all my homies who struggle with [outcome].',
      'Here\'s a life hack that\'s gonna [outcome] that they never taught you in school.',
      'Here\'s how to [outcome] in a way a 5 year-old could understand.',
      'This is exactly how to [outcome] in a way a 5 year-old could understand.',
      'You wanna [outcome] in 2025, I recommend listening to this video all the way through because the trends/methods/strategies/tricks that have worked for [outcome] in the past aren\'t anymore, but the new trend/method/strategy/trick you need to use is…',
      'I was just [personal story] and I just got the best advice on [outcome] that I\'ve ever heard.',
      'This is the ultimate guide on how to [outcome].',
      'Does [solution] ACTUALLY get you [outcome]?',
      'You guys ever heard of the [solution]? Cus the [solution] is life-changing.',
      'One of the things I really like to do if I wanna [outcome] but I don\'t know how is the [solution] method.',
      'Alright if you want one of your average [noun from the outcome] to look like this, the best thing you can do is [solution].',
      'Here\'s how to [outcome] literally anywhere.',
      'If I needed to [dream outcome] or someone was gonna blow my brains out, this is what I would do.',
      'Your [thing/situation]s will feel way less [outcome] when you understand these 3 things.',
      'Here are 3 rules you should follow if you actually wanna [dream outcome].',
      'Here are 3 reasons why you\'re gonna [dream outcome].',
      'In 60 seconds I\'m gonna logically prove to you how you can [dream outcome].',
      'There are 3 reasons you\'re [problem] right now. Either one, you [negative habit/action]…',
      'Having [dream outcome] is pretty fucking cool. So if you wanna [dream outcome], here are 3 ways you can actually do that. Number one…[habit/action].',
      'So I just [personal dream outcome] yesterday, and I wanted to tell yall some lessons I\'ve learned along the way to teach you what I wish I knew now.',
      'So I just [personal dream outcome] last week/month/year, and here are 3 lessons I\'ve learned along the way.',
      'Here are 3 [niche] hacks guaranteed to turn you into a [dream outcome].',
      'If I could teleport back to before I [personal dream outcome], here are the 3 things that I would sell my kidney today to tell past me.',
      'Here are the 3 easiest ways to [dream outcome].',
      'The 3 [thing/action/habit]s you need to [dream outcome].',
      'Here are 3 ways to actually [dream outcome]. If you don\'t implement some sort of system to [same dream outcome], you\'re gonna have [problem].',
      'These are 3 [thing/situation] tips that you fuckin\' need. Lock in, implement them, and [dream outcome].',
      '3 signs you\'re probably the [trait] homie.',
      'I\'m not sure if you guys know this or not, but right now people are boycotting [thing].',
      'If you\'re a guy and there\'s this [dream outcome], or you\'re a girl and there\'s this [female variation of dream outcome], I\'mma give you 3 ways to [dream outcome].'
    ];

    this.followUpTemplates = [
      'And I\'m not trying to pat myself on the back here, but just to provide some credibility, I [personal outcome].',
      'Now, you might be thinking…{OBJECTION}',
      '"Oh, but I don\'t know how to [solution]"',
      'Now, you might be thinking… "what the hell is [solution]?"',
      'I promise, I\'m about to absolutely transform your [niche] game.',
      'Now I know you\'re probably thinking…{OBJECTION}',
      'Now I know, you\'re probably thinking, {OBJECTION}. But just hear me out.',
      'No, [solution] is not {OBJECTION}.',
      'That is literally the only thing that\'s stopping you from [outcome]. And the reason why is because…',
      'Now, I know you don\'t wanna hear this information because {OBJECTION}.',
      'I\'ve obsessed over this for the past year of my life, and you probably haven\'t heard anyone else put it this way. Everyone that has that [outcome] does [solution].',
      'I\'ve studied this a lot, and you probably haven\'t heard anyone else put it this way. Everyone that has that [outcome] does [solution].',
      'I\'ll tell you, but you\'re gonna hate me. The reason is because most people don\'t [solution]. Here me out.',
      'If you\'re wondering why you should listen to me, I [personal outcome].',
      'Okay, so I did exactly that. I [personal outcome], and I wanted to make this video to let you know that it\'s not as hard as you think.',
      'You\'re probably thinking, who the hell is this guy and why should I listen to him? Well, I [personal outcome].',
      'This technique I\'m about to show you has allowed me to [personal outcome].',
      'I\'m getting goosebumps already. Make sure you listen til the end of this video.',
      'It\'s so simple, but like nobody does it.',
      'Now I know I sound corny but just hear me out.',
      'Nowadays, there\'s content about how to [outcome] everywhere.',
      'Don\'t feel attacked, bro. Just take notes.',
      'You might think…{OBJECTION}',
      'This is a life-changing TikTok, you need to tap in right now. It\'s really hard to [outcome], I\'m gonna give you the entire roadmap.',
      'Now most of you guys make the most common mistake when it comes to [outcome]…'
    ];
  }

  validateContext(context) {
    if (!context || typeof context !== 'string') {
      throw new ValidationError('Context must be a non-empty string', 'context');
    }

    const trimmed = context.trim();
    
    if (trimmed.length < 3) {
      throw new ValidationError('Context must be at least 3 characters long', 'context');
    }
    
    if (trimmed.length > 500) {
      throw new ValidationError('Context must be no more than 500 characters long', 'context');
    }

    const inappropriateWords = ['spam', 'scam', 'illegal', 'drugs'];
    const lowerContext = trimmed.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (lowerContext.includes(word)) {
        throw new ValidationError('Context contains inappropriate content', 'context');
      }
    }

    return trimmed;
  }

  extractPlaceholders(context) {
    const outcome = context;
    const solution = `implementing ${context}`;
    const personalOutcome = `mastered ${context}`;
    
    return { outcome, solution, personalOutcome };
  }

  async generateHooksWithGemini(context) {
    try {
      const { outcome, solution, personalOutcome } = this.extractPlaceholders(context);
      
      const systemPrompt = `You are a viral content hook generator. Generate 15-20 viral educational hooks using the provided opener and follow-up templates.

RULES:
1. Combine ONE opener sentence with ONE follow-up sentence word-for-word
2. Replace placeholders: [outcome] = "${outcome}", [solution] = "${solution}", [personal outcome] = "${personalOutcome}"
3. Make hooks specific, extreme, and controversial
4. Include numbers, timeframes, and bold claims
5. Use attention-grabbing language
6. Add emotional triggers and curiosity gaps
7. Include current year references (2025)

OPENER TEMPLATES (use word-for-word):
${this.openerTemplates.slice(0, 20).join('\n')}

FOLLOW-UP TEMPLATES (use word-for-word):
${this.followUpTemplates.slice(0, 10).join('\n')}

Generate 15-20 complete hooks by combining one opener + one follow-up. Make them viral and engaging for social media.`;

      const model = this.ai.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 2048
        }
      });

      const generatedText = response.response.text();
      return this.parseGeneratedHooks(generatedText, context);
      
    } catch (error) {
      logger.error('Gemini API call failed:', error);
      throw new Error('Failed to generate hooks with AI');
    }
  }

  parseGeneratedHooks(generatedText, context) {
    const lines = generatedText.split('\n').filter(line => line.trim());
    const hooks = [];
    
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#') && line.length > 20) {
        const cleanHook = line.replace(/^\d+\.\s*/, '').trim();
        if (cleanHook.length > 0) {
          hooks.push({
            hook: cleanHook,
            viralScore: viralScorer.calculateViralScore(cleanHook),
            context: context
          });
        }
      }
    }
    
    return hooks;
  }

  async generateHooks(context) {
    try {
      const validatedContext = this.validateContext(context);
      
      logger.info(`Generating AI-powered hooks for context: "${validatedContext}"`);
      
      const generatedHooks = await this.generateHooksWithGemini(validatedContext);
      
      const sortedHooks = generatedHooks
        .sort((a, b) => b.viralScore - a.viralScore)
        .slice(0, 10);
      
      const finalHooks = sortedHooks.map((hook, _index) => ({
        type: this.classifyHookType(hook.hook),
        emoji: this.getHookEmoji(hook.hook),
        hook: hook.hook,
        engagementScore: Math.max(70, Math.min(98, hook.viralScore + Math.floor(Math.random() * 10))),
        viralScore: hook.viralScore
      }));
      
      logger.info(`Generated ${finalHooks.length} AI-powered hooks with viral scores ranging from ${finalHooks[finalHooks.length - 1].viralScore} to ${finalHooks[0].viralScore}`);
      
      return finalHooks;
      
    } catch (error) {
      logger.error('Hook generation failed:', error);
      throw error;
    }
  }

  classifyHookType(hook) {
    const lowerHook = hook.toLowerCase();
    
    if (lowerHook.includes('question') || lowerHook.includes('what if') || lowerHook.includes('?')) {
      return 'Question Hook';
    } else if (lowerHook.includes('secret') || lowerHook.includes('hidden') || lowerHook.includes('nobody')) {
      return 'Curiosity Gap';
    } else if (lowerHook.includes('wrong') || lowerHook.includes('controversial') || lowerHook.includes('uncomfortable')) {
      return 'Controversial Statement';
    } else if (lowerHook.includes('story') || lowerHook.includes('years ago') || lowerHook.includes('destroyed my life')) {
      return 'Storytelling Opener';
    } else if (lowerHook.includes('exactly how') || lowerHook.includes('step') || lowerHook.includes('guide')) {
      return 'Actionable Tip';
    } else if (lowerHook.includes('everyone') || lowerHook.includes('opposite')) {
      return 'Contrarian Take';
    } else if (lowerHook.includes('%') || lowerHook.includes('statistics') || /\d+/.test(lowerHook)) {
      return 'Statistical Hook';
    } else if (lowerHook.includes('urgent') || lowerHook.includes('24 hours') || lowerHook.includes('time')) {
      return 'Urgency Hook';
    } else if (lowerHook.includes('break your heart') || lowerHook.includes('devastating')) {
      return 'Emotional Trigger';
    } else {
      return 'Personal Anecdote';
    }
  }

  getHookEmoji(hook) {
    const type = this.classifyHookType(hook);
    const emojiMap = {
      'Question Hook': '❓',
      'Curiosity Gap': '🔍',
      'Controversial Statement': '🔥',
      'Storytelling Opener': '📖',
      'Actionable Tip': '💡',
      'Contrarian Take': '🔄',
      'Statistical Hook': '📊',
      'Urgency Hook': '⚡',
      'Emotional Trigger': '💔',
      'Personal Anecdote': '👤'
    };
    return emojiMap[type] || '🎯';
  }

  formatHooksForDiscord(hooks) {
    const header = '🎯 **Your AI-Generated Viral Content Hooks** 🎯\n\n';
    
    const hookList = hooks.map((hook, index) => {
      return `**${index + 1}. ${hook.emoji} ${hook.type}** (${hook.engagementScore}% engagement)\n${hook.hook}\n`;
    }).join('\n');
    
    const footer = '\n💡 *Tip: These hooks are AI-generated and ranked by viral potential!*';
    
    return header + hookList + footer;
  }
}

export const hookGenerator = new HookGenerator();
export default hookGenerator;
