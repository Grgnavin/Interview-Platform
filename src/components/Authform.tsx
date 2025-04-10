"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import Formfield from "./Formfield";
import { useRouter } from "next/navigation";

const AuthFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(8),
    })
}

type Props = {
    type: 'sign-in' | 'sign-up'
  };

const Authform = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = AuthFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        if (type === "sign-up") {
            console.log("Type:", type);
            toast.success("Account created successfully! Please Sign-in");
            console.log("Sign up values:", values);
            router.push("/sign-in");
        }else {
            console.log("Sign in values:", values);
            toast.success("Sign-in successful!");
            router.push("/");
        }
    } catch (error) {
        console.log(error);
        toast.error(`There was an error: ${error}`);
    }
  }

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

export default Authform;
