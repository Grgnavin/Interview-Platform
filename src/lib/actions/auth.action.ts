'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function signup(params: SignUpParams) {
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists.',
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email,
            createdAt: new Date().toISOString(),
        });
        return {
            success: true,
            message: 'User created successfully.Please sign in.',
        };
    } catch (error: any) {
        console.error('Error creating user:', error);
        if (error.code === 'auth/email-already-exists') {
            return {
                success: false,
                message: 'Email already exists. Please use a different email.',
            }
        }
        return {
            success: false,
            message: 'Failed to create an account.',
        }
    }

}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 7 * 1000, // 5 days
    });

    cookieStore.set("session", sessionCookie, {
        maxAge: 60 * 60 * 24 * 7 , // 5 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    })

}

export async function signIn(params:SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: 'User not found.',
            }
        }
        await setSessionCookie(idToken);
        return {
            success: true,
            message: 'Sign-in successful.',
        };
    } catch (error) {
        console.error('Error signing in:', error);
        return {
            success: false,
            message: 'Failed to sign in.',
        }
    }
}