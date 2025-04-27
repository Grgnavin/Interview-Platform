import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function GET() {
    return Response.json({ message: 'Hello, VAPI!', success: true }, { status: 200 });
}

export async function POST(request: Request) {
    const { type, role, level, techstack, amount, userid } = await request.json();
    try {
        const { text: questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview.
                The job role is ${role}.
                The job experience level is ${level}.
                The tech stack is ${techstack}.
                The focus between behavioral and technical questions should be lean towards: ${type}.
                The amount of question shoud be: ${amount}.
                Please return only the questions, without any additional text.
                The questions are going to be read by a voice assistant so do not use "/" or "*" or any special characters which might break the voice assistant.
                Return the questions formatted like this.
                ["Question 1", "Question 2", "Question 3"]
                Thank you! <3
                `
        });
        const interview = {
            role, 
            type, 
            level,
            techstack: techstack.split(','),
            questions: JSON.parse(questions),
            userid,
            finalized: true,
            coveredImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };
        await db.collection('interviews').add(interview);

        return Response.json({ 
            message: 'VAPI generated successfully!', 
            success: true, 
        }, { status: 200 });
    } catch (error) {
        console.error('Error in POST /api/vapi/generate:', error);
        return Response.json({ message: 'Error generating VAPI', success: false, error }, { status: 500 });
    }
}
