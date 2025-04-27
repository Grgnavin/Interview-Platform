"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Formfield from "./Formfield";
import { signupAction, signInAction } from "@/app/actions/auth";  // Import server actions for server-side logic
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/firebase/client";
// import { auth } from "@/firebase/client";

const AuthFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(8),
    });
};

type Props = {
    type: 'sign-in' | 'sign-up';
};

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const formSchema = AuthFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (type === "sign-up") {
                const { name, email, password } = values;
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                const res = await signupAction({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password
                });

                if (!res.success) {
                    toast.error(res.message);
                    return;
                }

                toast.success(res.message);
                router.push("/sign-in");
            } else {
                const { email, password } = values;
                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredentials.user.getIdToken();

                if (!idToken) {
                    toast.error("Failed to get ID token. Please try again.");
                    return;
                }

                const res = await signInAction({
                    email,
                    idToken,
                });

                if (res.success) {
                    router.push("/");
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            }
        } catch (error) {
            toast.error(`There was an error: ${error}`);
        }
    };

    const isSignIn = type === "sign-in";

    return (
      <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src={"/logo.svg"} alt="logo" height={32} width={38} />
          <h2 className="text-primary-100 ">PrepWise </h2>
        </div>
        <h3>Practise Mock Interviews with AI-Powered Platform</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form "
          >
            {!isSignIn && (
                <Formfield
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Your name"
                />
            )}
            <Formfield
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    type="email"
                />
            <Formfield
                    control={form.control}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center ">
          {isSignIn ? "No Account Yet?" : "Already have an account?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Create an Account"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
