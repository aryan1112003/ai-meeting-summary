import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Summary } from '../types';

const genAI = new GoogleGenerativeAI('Api here');

export async function generateSummary(transcript: string): Promise<Summary> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Please provide an extremely detailed analysis of this meeting transcript. Break down the information into the following comprehensive sections. Use "-" for all bullet points, never use asterisks:

1. Meeting Overview
   - Detailed meeting purpose and objectives
   - List of all participants and their roles
   - Meeting duration and key timestamps
   - Overall meeting atmosphere and engagement level

2. Detailed Discussion Points
   - Comprehensive breakdown of each topic discussed
   - Background context for each discussion point
   - Arguments and counterarguments presented
   - Data and statistics mentioned
   - Questions raised and answers provided
   - Concerns and challenges discussed in detail
   - Solutions proposed for each challenge
   - Technical details and specifications mentioned
   - References to previous meetings or related projects

3. Decision Analysis
   - All decisions made during the meeting
   - Rationale behind each decision
   - Stakeholders involved in decision-making
   - Potential impacts and consequences discussed
   - Alternative options considered
   - Implementation timeline for decisions
   - Dependencies and prerequisites identified

4. Action Items and Responsibilities
   - Detailed list of all tasks assigned
   - Specific responsibilities for each team member
   - Clear deadlines and milestones
   - Required resources and budget allocations
   - Dependencies between tasks
   - Success criteria for each action item
   - Follow-up mechanisms

5. Next Steps and Future Planning
   - Upcoming meetings and their objectives
   - Long-term strategy discussions
   - Resource planning and allocation
   - Risk assessment and mitigation strategies
   - Training or skill development needs
   - Integration with existing projects
   - Timeline for future milestones

Please format action items with a "-" prefix and include specific assignees and deadlines where mentioned.

Transcript to analyze:
${transcript}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().replace(/\*/g, '-'); // Replace any asterisks with hyphens
  
  // Parse the response to extract summary and action items
  const [summary, actionItemsSection] = text.split('4. Action Items and Responsibilities');
  const actionItems = actionItemsSection
    ?.split('\n')
    .filter(item => item.trim().startsWith('-'))
    .map(item => item.trim().substring(2)) || [];

  return {
    text: summary.trim() + (actionItemsSection ? '\n4. Action Items and Responsibilities' + actionItemsSection.split('5. Next Steps')[0] : ''),
    actionItems,
    date: new Date().toISOString(),
    transcript
  };
}