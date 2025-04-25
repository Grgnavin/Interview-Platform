"use client";
import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'

enum CallStatus {
    INACTIVEsTATE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const Agent = ({ userName }: AgentProps) => {
    const isSpeaking = true;
    const status = CallStatus.FINISHED; // This should be dynamic based on the call status
    const messages = [
        'What is your name?',
        'My name is john Doe, nice to meet you'
    ];
    const lastMessage = messages[messages.length - 1];
    return (
        <>
        <div className='call-view'>
            <div className='card-interviewer'>
                <div className='avatar'>
                    <Image 
                        src="/ai-avatar.png"
                        alt="vapi"
                        width={65}
                        height={54}
                        className='object-cover '
                        />
                    {
                        isSpeaking && <span className='animate-speak'/>
                    }
                </div>
                    <h3>AI Interviewer</h3>
            </div>
            <div className='card-border'>
                    <div className='card-content'>
                        <Image 
                            src="/user-avatar.png"
                            alt="user avatar"
                            width={540}
                            height={540}
                            className='object-cover rounded-full size-[120px]'
                            />
                        <h3 className='text-center'>{userName}</h3>
                    </div>
            </div>
        </div>

        {
            messages.length > 0 && (
                <div className='transcript-border'>
                    <div className="transcript">
                        <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {lastMessage}
                        </p>
                    </div>
                </div>
            )
        }

        <div className='w-full flex justify-center'>
            {
                status !== "ACTIVE" ? (
                    <button className='relative btn-call'>
                        <span
                            className={cn(
                                'absolute rounded-full animate-ping opacity-75',
                                status !== "CONNECTING" && 'hidden'
                            )}
                        />
                        <span>
                            {status === 'INACTIVE' || status === 'FINISHED' ? 'Start Interview' : '. . .'}
                        </span>
                    </button>
                ) : (
                    <button className='btn-disconnect'>End</button>
                )
            }
        </div>
        </>
    )
}

export default Agent