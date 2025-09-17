export const motivationalQuotes = [
  "You are stronger than you think.",
  "Progress, not perfection.",
  "Every small step counts.",
  "Your mental health matters.",
  "It's okay to not be okay sometimes.",
  "You are worthy of love and happiness.",
  "Healing is not linear.",
  "You have survived 100% of your worst days.",
  "Your feelings are valid.",
  "Tomorrow is a fresh start.",
  "You are enough, just as you are.",
  "Self-care isn't selfish.",
  "Growth begins at the end of your comfort zone.",
  "You are braver than you believe.",
  "Every day is a new opportunity.",
  "Your story isn't over yet.",
  "You matter more than you know.",
  "Courage doesn't mean you're not afraid.",
  "You are capable of amazing things.",
  "Peace comes from within.",
  "You are not alone in this journey.",
  "Small progress is still progress.",
  "You deserve compassion, especially from yourself.",
  "Your current situation is not your final destination.",
  "Every breath is a new beginning.",
  "You are writing your own story.",
  "Kindness starts with being kind to yourself.",
  "You have the power to change your thoughts.",
  "Your sensitivity is a strength, not a weakness.",
  "You are allowed to take up space.",
  "Rest is productive too.",
  "You are doing better than you think.",
  "Your pace doesn't have to match anyone else's.",
  "You are worthy of good things.",
  "Your mental health is a priority, not a luxury.",
  "You are not broken, you are healing.",
  "Every moment is a chance to start over.",
  "You are exactly where you need to be.",
  "Your journey is unique and valuable.",
  "You have everything you need within you.",
  "Today is full of possibilities.",
  "You are loved, even when it doesn't feel like it.",
  "Your struggles don't define you.",
  "You are resilient beyond measure.",
  "It's okay to ask for help.",
  "You are worthy of patience and understanding.",
  "Your feelings deserve to be heard.",
  "You are making a difference just by being here.",
  "Every day you choose to keep going is an act of courage.",
  "You are more resilient than you realize."
];

export const getDailyQuote = (): string => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem('daily_quote_date');
  
  if (stored === today) {
    return localStorage.getItem('daily_quote') || motivationalQuotes[0];
  }
  
  // New day, get new quote
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const quoteIndex = dayOfYear % motivationalQuotes.length;
  const quote = motivationalQuotes[quoteIndex];
  
  localStorage.setItem('daily_quote', quote);
  localStorage.setItem('daily_quote_date', today);
  
  return quote;
};

export const getRandomQuote = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};
