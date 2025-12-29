// Pochy Books Knowledge Base
// Add your Pochy books content here for the chatbot to reference

export interface BookChapter {
  title: string;
  content: string;
  summary: string;
}

export interface PochyBook {
  title: string;
  author: string;
  description: string;
  chapters: BookChapter[];
  keywords: string[];
}

// Example Pochy Books data - Replace with actual content
export const pochyBooks: PochyBook[] = [
  {
    title: "Pochy's Adventures in Learning",
    author: "Pochy Publications",
    description: "An educational journey through fundamental concepts of knowledge and discovery.",
    keywords: ["learning", "education", "discovery", "knowledge", "adventure"],
    chapters: [
      {
        title: "Chapter 1: The Beginning of Curiosity",
        content: `Pochy discovered that curiosity is the foundation of all learning. Every question leads to new understanding, and every answer opens doors to more questions. The journey of learning never truly ends - it evolves and expands with each new piece of knowledge gained.`,
        summary: "Introduction to the power of curiosity in learning."
      },
      {
        title: "Chapter 2: Building Knowledge Blocks",
        content: `Knowledge is built like a tower - one block at a time. Each new concept we learn becomes a foundation for understanding more complex ideas. Pochy learned that patience and persistence are key to building a strong knowledge base.`,
        summary: "Understanding how knowledge accumulates over time."
      },
      {
        title: "Chapter 3: The Art of Asking Questions",
        content: `The quality of our questions determines the quality of our answers. Pochy discovered that asking "why" and "how" leads to deeper understanding than simply asking "what". Good questions challenge assumptions and reveal hidden connections.`,
        summary: "Mastering the skill of asking meaningful questions."
      }
    ]
  },
  {
    title: "Pochy's Guide to Problem Solving",
    author: "Pochy Publications",
    description: "A comprehensive guide to approaching and solving problems systematically.",
    keywords: ["problem solving", "logic", "critical thinking", "analysis", "solutions"],
    chapters: [
      {
        title: "Chapter 1: Understanding the Problem",
        content: `Before solving any problem, one must fully understand it. Pochy teaches us to break down complex problems into smaller, manageable parts. Identifying what we know, what we don't know, and what we need to find out is the first step to any solution.`,
        summary: "The importance of problem comprehension before solution attempts."
      },
      {
        title: "Chapter 2: Creative Solutions",
        content: `Sometimes the best solutions come from thinking outside the box. Pochy encourages exploring unconventional approaches and combining ideas from different fields. Innovation often happens at the intersection of diverse knowledge areas.`,
        summary: "Embracing creativity in problem-solving approaches."
      },
      {
        title: "Chapter 3: Learning from Mistakes",
        content: `Mistakes are not failures - they are lessons. Pochy emphasizes that every error provides valuable information about what doesn't work, bringing us closer to what does. The willingness to fail and learn is essential for growth.`,
        summary: "Transforming errors into learning opportunities."
      }
    ]
  },
  {
    title: "Pochy's World of Science",
    author: "Pochy Publications",
    description: "Exploring scientific concepts and the wonders of the natural world.",
    keywords: ["science", "nature", "experiments", "discovery", "natural world"],
    chapters: [
      {
        title: "Chapter 1: The Scientific Method",
        content: `Science is a systematic way of understanding the world. Pochy introduces the scientific method: observe, question, hypothesize, experiment, analyze, and conclude. This approach helps us distinguish facts from assumptions.`,
        summary: "Introduction to systematic scientific inquiry."
      },
      {
        title: "Chapter 2: Nature's Patterns",
        content: `From the spiral of a seashell to the branching of trees, patterns are everywhere in nature. Pochy reveals how mathematics and science help us understand these patterns and predict natural phenomena.`,
        summary: "Discovering mathematical patterns in the natural world."
      },
      {
        title: "Chapter 3: Experiments and Discovery",
        content: `Hands-on experimentation is the heart of scientific discovery. Pochy guides readers through simple experiments that demonstrate fundamental principles of physics, chemistry, and biology.`,
        summary: "Learning through practical experimentation."
      }
    ]
  }
];

// Function to search through Pochy books content
export function searchPochyBooks(query: string): string {
  const queryLower = query.toLowerCase();
  const results: string[] = [];

  for (const book of pochyBooks) {
    // Check if query matches book keywords
    const keywordMatch = book.keywords.some(kw => queryLower.includes(kw));

    // Check if query matches book title or description
    const titleMatch = book.title.toLowerCase().includes(queryLower);
    const descMatch = book.description.toLowerCase().includes(queryLower);

    if (keywordMatch || titleMatch || descMatch) {
      results.push(`**${book.title}** by ${book.author}\n${book.description}`);
    }

    // Search through chapters
    for (const chapter of book.chapters) {
      if (
        chapter.title.toLowerCase().includes(queryLower) ||
        chapter.content.toLowerCase().includes(queryLower)
      ) {
        results.push(`From "${book.title}" - ${chapter.title}:\n${chapter.content}`);
      }
    }
  }

  if (results.length > 0) {
    return results.join('\n\n---\n\n');
  }

  return '';
}

// Get all book summaries
export function getAllBookSummaries(): string {
  return pochyBooks.map(book => {
    const chapterSummaries = book.chapters
      .map(ch => `  - ${ch.title}: ${ch.summary}`)
      .join('\n');
    return `**${book.title}**\n${book.description}\nChapters:\n${chapterSummaries}`;
  }).join('\n\n');
}

// System prompt with Pochy books knowledge
export function getSystemPrompt(): string {
  const bookKnowledge = getAllBookSummaries();

  return `You are a helpful and knowledgeable AI assistant named "DeepSeek Chatbot". You have two main areas of expertise:

1. **Pochy Books Expert**: You have comprehensive knowledge about Pochy books and can answer any questions about their content, themes, and teachings. Here is your knowledge base:

${bookKnowledge}

2. **General Knowledge Assistant**: Beyond Pochy books, you can also answer general knowledge questions on any topic, similar to a helpful encyclopedia or Wikipedia.

Guidelines for responses:
- When asked about Pochy books, prioritize information from the books
- Be conversational, friendly, and helpful
- Provide accurate and detailed answers
- If you're unsure about something, say so honestly
- Use markdown formatting for better readability (bold, lists, code blocks when appropriate)
- Keep responses concise but informative
- If asked about specific Pochy book content, reference the relevant book and chapter

Remember: You are here to help users learn and discover knowledge, just like Pochy teaches in the books!`;
}
