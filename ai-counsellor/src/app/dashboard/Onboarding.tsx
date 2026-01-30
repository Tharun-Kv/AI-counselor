"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./onboarding.module.css";

interface OnboardingData {
    degree: string;
    gpa: string;
    field: string;
    countries: string[];
    budget: string;
    exams: string[];
    careerGoals: string;
}

interface Props {
    onComplete: () => void;
}

const INITIAL_DATA: OnboardingData = {
    degree: "",
    gpa: "",
    field: "",
    countries: [],
    budget: "",
    exams: [],
    careerGoals: ""
};

const COUNTRIES = ["United States", "United Kingdom", "Canada", "Australia", "Germany"];
const EXAMS = ["IELTS", "TOEFL", "GRE", "GMAT", "SAT"];

export default function Onboarding({ onComplete }: Props) {
    const [mode, setMode] = useState<"manual" | "ai" | null>(null);
    const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
    const [step, setStep] = useState(1); // 1-3 for manual, 4 for review

    // AI Chat State
    const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([
        { role: 'bot', text: "Hello! I'm your AI Counsellor. I'll guide you through setting up your profile. First, what is your most recent degree?" }
    ]);
    const [chatInput, setChatInput] = useState("");
    const chatBottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll chat
    useEffect(() => {
        if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            setStep(4); // Review
        }
    };

    const updateData = (field: keyof OnboardingData, value: string | string[]) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleCountryToggle = (country: string) => {
        const current = data.countries;
        if (current.includes(country)) {
            updateData("countries", current.filter(c => c !== country));
        } else {
            updateData("countries", [...current, country]);
        }
    };

    const handleExamToggle = (exam: string) => {
        const current = data.exams;
        if (current.includes(exam)) {
            updateData("exams", current.filter(e => e !== exam));
        } else {
            updateData("exams", [...current, exam]);
        }
    };

    // AI Chat Logic (Mock)
    const processUserMessage = (text: string) => {
        const newMessages = [...messages, { role: 'user', text } as const];
        setMessages(newMessages);
        setChatInput("");

        // Simple state machine simulation for AI
        // In a real app, this would call an API
        setTimeout(() => {
            let botReply = "";
            const lowerText = text.toLowerCase();

            // Very basic logic to simulate progressive data collection
            if (!data.degree) {
                updateData("degree", text);
                botReply = "Got it. What is your GPA or percentage?";
            } else if (!data.gpa) {
                updateData("gpa", text);
                botReply = "Thanks. What is your field of study?";
            } else if (!data.field) {
                updateData("field", text);
                botReply = "Great choice. which countries are you interested in? (e.g., USA, UK)";
            } else if (data.countries.length === 0) {
                // Naive extraction
                const foundCountries = COUNTRIES.filter(c => lowerText.includes(c.toLowerCase()) || lowerText.includes(c.split(" ")[1]?.toLowerCase() || ""));
                updateData("countries", foundCountries.length > 0 ? foundCountries : [text]);
                botReply = "Noted. What is your budget range for tuition and living?";
            } else if (!data.budget) {
                updateData("budget", text);
                botReply = "Have you taken any exams like IELTS, TOEFL, or GRE? Please list them.";
            } else if (data.exams.length === 0) {
                const foundExams = EXAMS.filter(e => lowerText.includes(e.toLowerCase()));
                updateData("exams", foundExams.length > 0 ? foundExams : ["None"]);
                botReply = "Almost done. Lastly, what are your career goals after study?";
            } else if (!data.careerGoals) {
                updateData("careerGoals", text);
                botReply = "Perfect! I've gathered all the info. Let's review it.";
                setTimeout(() => setStep(4), 1500); // Trigger review
            } else {
                botReply = "We are all set!";
                setStep(4);
            }

            setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
        }, 1000);
    };

    if (!mode) {
        return (
            <div className={styles.container}>
                <h2 className="text-2xl font-bold text-center mb-8">Choose Your Onboarding Mode</h2>
                <div className={styles.modeSelection}>
                    <div className={styles.modeCard} onClick={() => setMode("manual")}>
                        <div className={styles.modeIcon}>📝</div>
                        <h3 className={styles.modeTitle}>Manual Form</h3>
                        <p className={styles.modeDesc}>Step-by-step structured form to details your profile at your own pace.</p>
                    </div>
                    <div className={styles.modeCard} onClick={() => setMode("ai")}>
                        <div className={styles.modeIcon}>🤖</div>
                        <h3 className={styles.modeTitle}>AI Conversation</h3>
                        <p className={styles.modeDesc}>Chat with our AI Counsellor to build your profile interactively.</p>
                    </div>
                </div>
            </div>
        );
    }

    // REVIEW SCREEN (Step 4) - Shared by both modes
    if (step === 4) {
        return (
            <div className={styles.container}>
                <div className={styles.summaryContainer}>
                    <h2 className="text-2xl font-bold text-center mb-6">Profile Summary</h2>
                    <p className="text-center text-gray-400 mb-8">Here's what we understood about you. Please review.</p>

                    <div className={styles.summarySection}>
                        <div className={styles.summaryHeader}>
                            <span className={styles.summaryTitle}>Academic Background</span>
                            <button className={styles.editBtn} onClick={() => { setStep(1); setMode("manual"); }}>Edit</button>
                        </div>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Degree</span>
                                <span className={styles.summaryValue}>{data.degree || "Not specified"}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>GPA/Percentage</span>
                                <span className={styles.summaryValue}>{data.gpa || "Not specified"}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Field</span>
                                <span className={styles.summaryValue}>{data.field || "Not specified"}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.summarySection}>
                        <div className={styles.summaryHeader}>
                            <span className={styles.summaryTitle}>Study Plans</span>
                            <button className={styles.editBtn} onClick={() => { setStep(2); setMode("manual"); }}>Edit</button>
                        </div>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Preferred Countries</span>
                                <span className={styles.summaryValue}>{data.countries.join(", ") || "None"}</span>
                            </div>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Budget</span>
                                <span className={styles.summaryValue}>{data.budget || "Not specified"}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.summarySection}>
                        <div className={styles.summaryHeader}>
                            <span className={styles.summaryTitle}>Readiness & Goals</span>
                            <button className={styles.editBtn} onClick={() => { setStep(3); setMode("manual"); }}>Edit</button>
                        </div>
                        <div className={styles.summaryGrid}>
                            <div className={styles.summaryItem}>
                                <span className={styles.summaryLabel}>Exams Taken</span>
                                <span className={styles.summaryValue}>{data.exams.join(", ") || "None"}</span>
                            </div>
                            <div className={styles.summaryItem} style={{ gridColumn: "span 2" }}>
                                <span className={styles.summaryLabel}>Career Goals</span>
                                <span className={styles.summaryValue}>{data.careerGoals || "Not specified"}</span>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-primary w-full py-3 text-lg" onClick={onComplete}>
                        Confirm & Unlock Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // AI MODE
    if (mode === "ai") {
        return (
            <div className={styles.container}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">AI Counsellor</h2>
                    <button onClick={() => setMode(null)} className="text-sm text-gray-400">Switch Mode</button>
                </div>
                <div className={styles.chatContainer}>
                    <div className={styles.chatMessages}>
                        {messages.map((m, i) => (
                            <div key={i} className={`${styles.message} ${m.role === 'bot' ? styles.botMessage : styles.userMessage}`}>
                                {m.text}
                            </div>
                        ))}
                        <div ref={chatBottomRef}></div>
                    </div>
                    <div className={styles.chatInputArea}>
                        <input
                            type="text"
                            className={styles.chatInput}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && processUserMessage(chatInput)}
                            placeholder="Type your answer..."
                        />
                        <button className={styles.chatSendBtn} onClick={() => processUserMessage(chatInput)}>➤</button>
                    </div>
                </div>
            </div>
        );
    }

    // MANUAL MODE
    return (
        <div className={styles.container}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Build Your Profile</h2>
                <button onClick={() => setMode(null)} className="text-sm text-gray-400">Switch Mode</button>
            </div>

            <div className={styles.stepIndicator}>
                {[1, 2, 3].map(s => (
                    <div key={s} className={`${styles.stepDot} ${step >= s ? styles.stepDotActive : ''}`}></div>
                ))}
            </div>

            <form onSubmit={handleManualSubmit} className={styles.formContainer}>
                {step === 1 && (
                    <div className={`${styles.formSection} animate-fade-in`}>
                        <h3 className="text-lg font-bold mb-4">Step 1: Academic Background</h3>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Most Recent Degree</label>
                            <input type="text" className={styles.input} required value={data.degree} onChange={e => updateData("degree", e.target.value)} placeholder="e.g. Bachelor of Technology" />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>GPA / Percentage</label>
                            <input type="text" className={styles.input} required value={data.gpa} onChange={e => updateData("gpa", e.target.value)} placeholder="e.g. 3.8 or 85%" />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Field of Study</label>
                            <input type="text" className={styles.input} required value={data.field} onChange={e => updateData("field", e.target.value)} placeholder="e.g. Computer Science" />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className={`${styles.formSection} animate-fade-in`}>
                        <h3 className="text-lg font-bold mb-4">Step 2: Preferences</h3>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Preferred Countries</label>
                            <div className={styles.checkboxGroup}>
                                {COUNTRIES.map(c => (
                                    <label key={c} className={styles.checkboxLabel}>
                                        <input type="checkbox" checked={data.countries.includes(c)} onChange={() => handleCountryToggle(c)} />
                                        <span>{c}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Total Budget (Tuition + Living)</label>
                            <select className={styles.select} value={data.budget} onChange={e => updateData("budget", e.target.value)}>
                                <option value="">Select Range</option>
                                <option value="< $20k">Under $20k</option>
                                <option value="$20k - $40k">$20k - $40k</option>
                                <option value="$40k - $60k">$40k - $60k</option>
                                <option value="$60k+">$60k+</option>
                            </select>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className={`${styles.formSection} animate-fade-in`}>
                        <h3 className="text-lg font-bold mb-4">Step 3: Readiness & Goals</h3>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Exams Taken / Planned</label>
                            <div className={styles.checkboxGroup}>
                                {EXAMS.map(e => (
                                    <label key={e} className={styles.checkboxLabel}>
                                        <input type="checkbox" checked={data.exams.includes(e)} onChange={() => handleExamToggle(e)} />
                                        <span>{e}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Career Goals</label>
                            <textarea
                                className={styles.textarea}
                                rows={4}
                                required
                                value={data.careerGoals}
                                onChange={e => updateData("careerGoals", e.target.value)}
                                placeholder="What do you want to achieve after your studies?"
                            />
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-between">
                    {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="btn btn-secondary">Back</button>}
                    <button type="submit" className="btn btn-primary ml-auto">{step === 3 ? "Review" : "Next"}</button>
                </div>
            </form>
        </div>
    );
}
