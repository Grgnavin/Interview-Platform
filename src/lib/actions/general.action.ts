"use server";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { feedbackSchema } from "../../../public/constants";

export async function getInterviewById(id:string): Promise<Interview | null> {
    const interview = await db.collection('interviews').doc(id).get();
        
    return interview.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams)  {
    const { interviewId, userId, transcript } = await params;

    try {
        const formatttedTranscript = transcript.map((sentence: { role: string, content: string }) => (
            `- ${sentence.role}: ${sentence.content}\n`
        )).join('');
        const { object: { totalScore, categoryScores, areasForImprovement, strengths, finalAssessment } } = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false
            }),
            schema:feedbackSchema,
            prompt: `
                You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on the steuctured categories. Be thorough and deatiled in your analysis. Don't be too soft with the candidate.
                If there are some mistake or areas to improvement, point them out.
                Transcript: 
                ${formatttedTranscript}
                Please score the candidate from 0 to 100 in the folowing areas. Do not add categories other than the ones provided:
                -  **Communication skills**: Clarity, articulation, structured responses.
                -  **Technical knowledge**: Understanding the key concept of the role and the techonology.
                -  **Problem-solving skills**: Ability to analyze problem and propose solution with structure.
                -  **Cultural and Role fit**: Alignment with the company values and job role.
                -  **Confidence and clarity**: Confidence in responses, engagement, and clarity.
            `,
            system: 'You are a professional interviewer',
        });

        const feedback = await db.collection('feedback').add({
            interviewId,
            userId,
            totalScore,
            categoryScores,
            areasForImprovement,
            strengths,
            finalAssessment,
            createdAt: new Date().toISOString()
        });

        return {
            success: true,
            feedbackId: feedback.id,
        }
    } catch (error) {
        console.error("Error creating feedback:", error);
        return {
            success: false,
        };
    }

}

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
    const { interviewId, userId} = params;
    
    const feedback = await db
            .collection('feedback')
            .where('interviewId', '==', interviewId)
            .where('userId', '==', userId)
            .limit(1)
            .get();

    if (feedback.empty) return null;

    const feedbackDocs = feedback.docs[0];

    return {
        id: feedbackDocs.id,
        ...feedbackDocs.data(),
    } as Feedback;
}