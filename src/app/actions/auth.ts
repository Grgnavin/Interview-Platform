"use server";
// In your app directory (e.g., app/actions/auth.ts or app/auth/server.ts)
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function signupAction(params: SignUpParams) {
    const { uid, name, email } = params;
    try {
        // Check if the user already exists
        const userRecord = await db.collection('users').doc(uid).get();
        if (userRecord.exists) {
            return {
                success: false,
                message: 'User already exists.',
            }
        }

        // Create the user in Firestore
        await db.collection('users').doc(uid).set({
            name,
            email,
            createdAt: new Date().toISOString(),
        });

        // Optionally, create the user in Firebase Auth as well if needed (depending on your needs)
        // await auth.createUser({ email, password });

        return {
            success: true,
            message: 'User created successfully. Please sign in.',
        };
    } catch (error: any) {
        console.error('Error creating user:', error);
        return {
            success: false,
            message: 'Failed to create an account.',
        };
    }
}

export async function signInAction(params: SignInParams) {
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
            message: 'Failed to sign in...',
        };
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 7 * 1000, // 5 days
    });

    cookieStore.set("session", sessionCookie, {
        maxAge: 60 * 60 * 24 * 7, // 5 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        
        if (!userRecord.exists) {
            return null;
        }
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (error) {
        console.log("Error getting current user:", error);
        return null;
    }

}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}