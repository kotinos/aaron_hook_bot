import { logger } from '../utils/logger.js';
import { ValidationError } from '../utils/errorHandler.js';

class HookGenerator {
  constructor() {
    this.hookTypes = [
      {
        name: 'Question Hook',
        emoji: '❓',
        templates: [
          'What if I told you that {context} could change everything you thought you knew?',
          'Have you ever wondered why {context} seems impossible until it suddenly isn\'t?',
          'What would happen if everyone knew the truth about {context}?',
          'Why do most people get {context} completely wrong?'
        ],
        baseScore: 85
      },
      {
        name: 'Curiosity Gap',
        emoji: '🔍',
        templates: [
          'The secret behind {context} that nobody talks about...',
          'What they don\'t want you to know about {context}',
          'The hidden truth about {context} revealed',
          'I discovered something shocking about {context}'
        ],
        baseScore: 88
      },
      {
        name: 'Controversial Statement',
        emoji: '🔥',
        templates: [
          'Unpopular opinion: {context} is completely overrated',
          'I\'m about to say something controversial about {context}...',
          'Everyone is wrong about {context}, and here\'s why',
          'The uncomfortable truth about {context} that no one admits'
        ],
        baseScore: 92
      },
      {
        name: 'Emotional Trigger',
        emoji: '💔',
        templates: [
          'This {context} story will break your heart',
          'I cried when I learned the truth about {context}',
          'The devastating reality of {context} that changed my life',
          'Why {context} makes me angry every single day'
        ],
        baseScore: 90
      },
      {
        name: 'Urgency Hook',
        emoji: '⚡',
        templates: [
          'You have 24 hours to understand {context} before it\'s too late',
          'URGENT: Everything about {context} is about to change',
          'Last chance to get {context} right before the deadline',
          'Time is running out for {context} - here\'s what you need to know'
        ],
        baseScore: 87
      },
      {
        name: 'Storytelling Opener',
        emoji: '📖',
        templates: [
          'Three years ago, {context} completely destroyed my life. Today, it saved it.',
          'The day {context} taught me the most important lesson of my life',
          'I never believed in {context} until this happened to me...',
          'My grandmother\'s advice about {context} seemed crazy until I tried it'
        ],
        baseScore: 89
      },
      {
        name: 'Statistical Hook',
        emoji: '📊',
        templates: [
          '97% of people don\'t know this about {context}',
          'Only 3 out of 100 people understand {context} correctly',
          'The shocking statistics about {context} that will change your mind',
          'Data reveals the surprising truth about {context}'
        ],
        baseScore: 84
      },
      {
        name: 'Contrarian Take',
        emoji: '🔄',
        templates: [
          'Everyone says {context} is the answer. They\'re wrong.',
          'While everyone obsesses over {context}, I\'m doing the opposite',
          'The reason {context} doesn\'t work (and what does instead)',
          'Stop doing {context}. Start doing this instead.'
        ],
        baseScore: 86
      },
      {
        name: 'Personal Anecdote',
        emoji: '👤',
        templates: [
          'How {context} changed my life in ways I never expected',
          'My biggest mistake with {context} (and what I learned)',
          'The moment {context} clicked for me after years of struggle',
          'Why I wish I had understood {context} 10 years ago'
        ],
        baseScore: 83
      },
      {
        name: 'Actionable Tip',
        emoji: '💡',
        templates: [
          'The 5-minute {context} hack that changed everything',
          'How to master {context} in just 30 days',
          'The simple {context} trick that pros don\'t want you to know',
          'One small change to your {context} approach that yields massive results'
        ],
        baseScore: 81
      }
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

    const inappropriateWords = ['spam', 'scam', 'hack', 'illegal', 'drugs'];
    const lowerContext = trimmed.toLowerCase();
    
    for (const word of inappropriateWords) {
      if (lowerContext.includes(word)) {
        throw new ValidationError('Context contains inappropriate content', 'context');
      }
    }

    return trimmed;
  }

  calculateEngagementScore(hookType, context) {
    let score = hookType.baseScore;
    
    const contextLength = context.length;
    if (contextLength > 50) score += 2;
    if (contextLength > 100) score += 1;
    
    const wordCount = context.split(' ').length;
    if (wordCount > 5) score += 1;
    if (wordCount > 10) score += 1;
    
    const hasNumbers = /\d/.test(context);
    if (hasNumbers) score += 2;
    
    const hasEmotionalWords = /\b(amazing|incredible|shocking|devastating|breakthrough|revolutionary)\b/i.test(context);
    if (hasEmotionalWords) score += 3;
    
    const randomVariation = Math.floor(Math.random() * 11) - 5;
    score += randomVariation;
    
    return Math.max(70, Math.min(98, score));
  }

  generateHook(hookType, context) {
    const template = hookType.templates[Math.floor(Math.random() * hookType.templates.length)];
    const hook = template.replace(/\{context\}/g, context);
    const engagementScore = this.calculateEngagementScore(hookType, context);
    
    return {
      type: hookType.name,
      emoji: hookType.emoji,
      hook,
      engagementScore,
      template: template
    };
  }

  generateHooks(context) {
    try {
      const validatedContext = this.validateContext(context);
      
      logger.info(`Generating hooks for context: "${validatedContext}"`);
      
      const hooks = this.hookTypes.map(hookType => 
        this.generateHook(hookType, validatedContext)
      );
      
      hooks.sort((a, b) => b.engagementScore - a.engagementScore);
      
      logger.info(`Generated ${hooks.length} hooks with scores ranging from ${hooks[hooks.length - 1].engagementScore}% to ${hooks[0].engagementScore}%`);
      
      return hooks;
      
    } catch (error) {
      logger.error('Hook generation failed:', error);
      throw error;
    }
  }

  formatHooksForDiscord(hooks) {
    const header = '🎯 **Your Viral Content Hooks** 🎯\n\n';
    
    const hookList = hooks.map((hook, index) => {
      return `**${index + 1}. ${hook.emoji} ${hook.type}** (${hook.engagementScore}% engagement)\n${hook.hook}\n`;
    }).join('\n');
    
    const footer = '\n💡 *Tip: Higher engagement scores indicate hooks more likely to go viral!*';
    
    return header + hookList + footer;
  }
}

export const hookGenerator = new HookGenerator();
export default hookGenerator;
