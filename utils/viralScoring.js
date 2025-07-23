/**
 * Viral Hook Scoring Algorithm
 * Scores hooks based on 5 factors: curiosity gap, emotional trigger, 
 * specificity, controversy, and action-oriented language
 */

export class ViralScorer {
  constructor() {
    this.curiosityWords = ['secret', 'hidden', 'nobody', 'never', 'shocking', 'truth', 'revealed'];
    this.emotionalWords = ['devastating', 'heartbreaking', 'incredible', 'amazing', 'shocking', 'destroyed', 'saved'];
    this.specificityPatterns = [/\d+/, /\b(step|minute|second|hour|day|week|month|year)s?\b/i];
    this.controversyWords = ['wrong', 'lie', 'lying', 'opposite', 'uncomfortable', 'unethical', 'controversial'];
    this.actionWords = ['how to', 'exactly', 'step', 'guide', 'method', 'strategy', 'hack', 'tip'];
  }

  scoreCuriosityGap(text) {
    const lowerText = text.toLowerCase();
    let score = 0;
    
    this.curiosityWords.forEach(word => {
      if (lowerText.includes(word)) score += 15;
    });
    
    if (lowerText.includes('what they don\'t want you to know')) score += 25;
    if (lowerText.includes('...')) score += 10;
    
    return Math.min(100, score);
  }

  scoreEmotionalTrigger(text) {
    const lowerText = text.toLowerCase();
    let score = 0;
    
    this.emotionalWords.forEach(word => {
      if (lowerText.includes(word)) score += 20;
    });
    
    if (lowerText.includes('break your heart')) score += 25;
    if (lowerText.includes('changed my life')) score += 20;
    
    return Math.min(100, score);
  }

  scoreSpecificity(text) {
    let score = 0;
    
    this.specificityPatterns.forEach(pattern => {
      if (pattern.test(text)) score += 25;
    });
    
    const numbers = text.match(/\d+/g);
    if (numbers) score += numbers.length * 10;
    
    return Math.min(100, score);
  }

  scoreControversy(text) {
    const lowerText = text.toLowerCase();
    let score = 0;
    
    this.controversyWords.forEach(word => {
      if (lowerText.includes(word)) score += 20;
    });
    
    if (lowerText.includes('everyone says') && lowerText.includes('wrong')) score += 30;
    
    return Math.min(100, score);
  }

  scoreActionOriented(text) {
    const lowerText = text.toLowerCase();
    let score = 0;
    
    this.actionWords.forEach(word => {
      if (lowerText.includes(word)) score += 15;
    });
    
    if (lowerText.startsWith('here\'s exactly how')) score += 25;
    
    return Math.min(100, score);
  }

  calculateViralScore(hook) {
    const curiosity = this.scoreCuriosityGap(hook);
    const emotional = this.scoreEmotionalTrigger(hook);
    const specificity = this.scoreSpecificity(hook);
    const controversy = this.scoreControversy(hook);
    const actionOriented = this.scoreActionOriented(hook);
    
    const totalScore = (curiosity + emotional + specificity + controversy + actionOriented) / 5;
    return Math.round(totalScore);
  }
}

export const viralScorer = new ViralScorer();
