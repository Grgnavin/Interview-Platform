import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "../actions/auth";
import { getInterviewByUserId, getLatestInterviews } from "@/lib/actions/auth.action";

export default async function Home() {
  const user = await getCurrentUser();
  
  const [ userInterviews, latestInterviews ] = await Promise.all([
    await  getInterviewByUserId(user?.id as string),
    await getLatestInterviews({ userId: user?.id as string })
  ]);
  
  // const latestInterviews = await getLatestInterviews({ userId: user?.id as string });
  // const userInterviews = await getInterviewByUserId(user?.id as string);
  const hasPastInterviews = userInterviews && userInterviews.length > 0; 
  const hasUpcomingInterviews = latestInterviews && latestInterviews.length > 0;
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview ready with AI Powered Practise and feedback</h2>
          <p className="text-lg">Practise on real interview questions & get instant feedback</p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">
              Start an interview
            </Link>
          </Button>
        </div>  
        <Image 
          src="/robot.png"
          alt="robot"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>  
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your interviews</h2>
        <div className="interviews-section">
          {
            hasPastInterviews ? (
              userInterviews.map((interview) => (
                <InterviewCard
                  {...interview}
                  key={interview.id}
                />
              ))) : (
                <p>You haven&apos;t taken any interviews yet</p>
              )
          }
        </div>
      </section> 
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an interview</h2>

        <div className="interviews-section">
        {
            hasUpcomingInterviews ? (
              latestInterviews.map((interview) => (
                <InterviewCard
                  {...interview}
                  key={interview.id}
                />
              ))) : (
                <p>There are no new interviews available.</p>
              )
          }
        </div>
      </section>
    </>
  );
}
