"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import Onboarding from "./Onboarding";
import AiRecommendations from "./AiRecommendations";
import ApplicationDashboard from "./ApplicationDashboard";

const stages = [
    { id: 1, name: "Profile Onboarding", icon: "📝" },
    { id: 2, name: "University Shortlisting", icon: "🏫" },
    { id: 3, name: "University Locking", icon: "🔒" },
    { id: 4, name: "Application Guidance", icon: "🚀" },
];

export default function Dashboard() {
    const [currentStage, setCurrentStage] = useState(1);
    const [completedStages, setCompletedStages] = useState<number[]>([]);

    // Lifted State
    const [profileData, setProfileData] = useState<any>(null); // Ideally typed
    const [shortlistedIds, setShortlistedIds] = useState<number[]>([]);
    const [lockedUniId, setLockedUniId] = useState<number | null>(null);

    const handleCompleteStage = (stageId: number) => {
        if (!completedStages.includes(stageId)) {
            setCompletedStages(prev => [...prev, stageId]);
        }
        if (stageId < stages.length) {
            setCurrentStage(stageId + 1);
        }
    };

    const handleOnboardingComplete = () => {
        // In a real app, data would bubble up from Onboarding component or be stored in Context/Redux.
        // For now, we simulate profile data being ready.
        setProfileData({ degree: "B.Tech", gpa: "3.8", field: "CS", countries: ["USA"], budget: "$40k" });
        handleCompleteStage(1);
    };

    const handleLockUniversity = (id: number) => {
        setLockedUniId(id);
        handleCompleteStage(2);
        handleCompleteStage(3); // Auto complete locking stage too as the action was done
        setCurrentStage(4);
    };

    const handleUnlockUniversity = () => {
        setLockedUniId(null);
        // Remove 3 and 4 from completed stages
        setCompletedStages(prev => prev.filter(s => s < 2));
        setCurrentStage(2); // Go back to shortlisting
    };

    return (
        <div className={styles.page}>
            {/* Navbar */}
            <nav className={styles.nav}>
                <div className={styles.navInner}>
                    <Link href="/">
                        <span className={styles.navLogo}>AI Counsellor</span>
                    </Link>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}></div>
                        <span style={{ fontSize: "0.875rem" }}>John Doe</span>
                    </div>
                </div>
            </nav>

            <main className={styles.main}>
                {/* Progress Indicator */}
                <div className={styles.progressContainer}>
                    <div className={styles.progressBarBackground}></div>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${((currentStage - 1) / (stages.length - 1)) * 100}%` }}
                    ></div>

                    <div className={styles.stagesWrapper}>
                        {stages.map((stage) => {
                            const isActive = stage.id === currentStage;
                            const isCompleted = stage.id < currentStage;
                            const isLocked = stage.id > currentStage;

                            let stateClass = styles.lockedStage;
                            if (isActive) stateClass = styles.activeStage;
                            if (isCompleted) stateClass = styles.completedStage;

                            return (
                                <div key={stage.id} className={`${styles.stageItem} ${stateClass}`}>
                                    <div className={styles.stageCircle}>
                                        {isCompleted ? "✓" : isLocked ? "🔒" : stage.icon}
                                    </div>
                                    <span className={styles.stageName}>
                                        {stage.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className={`${styles.contentCard} animate-fade-in`}>
                    {/* Header for content */}
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>
                            {stages[currentStage - 1].name}
                        </h2>
                        <p className={styles.cardDesc}>
                            {currentStage === 1 && "Complete your onboarding first. This is mandatory to unlock recommendations."}
                            {currentStage === 2 && "Here are your AI-recommended universities based on your profile."}
                            {currentStage === 3 && "You have finalized your choice. Proceed to applications."}
                            {currentStage === 4 && "Track your applications and get guidance on essays and documents."}
                        </p>
                    </div>

                    {/* Dynamic Content based on stage */}
                    <div style={{ padding: '1rem 0' }}>
                        {currentStage === 1 && (
                            <Onboarding onComplete={handleOnboardingComplete} />
                        )}

                        {currentStage === 2 && (
                            <AiRecommendations
                                profile={profileData}
                                shortlist={shortlistedIds}
                                onShortlistChange={setShortlistedIds}
                                onLock={handleLockUniversity}
                            />
                        )}

                        {currentStage === 3 && (
                            <div className={styles.lockScreen}>
                                <div className={styles.lockIcon}>🔒</div>
                                {lockedUniId ? (
                                    <div>
                                        <p className="text-xl mb-2 text-white">You have locked your choice!</p>
                                        <p>University ID: {lockedUniId}</p>
                                        <button className="btn btn-primary mt-4" onClick={() => handleCompleteStage(3)}>Proceed to Application</button>
                                    </div>
                                ) : (
                                    <p>Please go back to Step 2 and Lock a university.</p>
                                )}
                            </div>
                        )}

                        {currentStage === 4 && lockedUniId && (
                            <ApplicationDashboard
                                uniId={lockedUniId}
                                onUnlock={handleUnlockUniversity}
                            />
                        )}
                    </div>

                    {/* Action Footer (Only for some stages) */}
                    {currentStage > 2 && currentStage !== 3 && currentStage !== 4 && (
                        <div className={styles.actionFooter}>
                            <button className="btn btn-primary" style={{ backgroundColor: 'var(--success)' }}>
                                Dashboard Overview
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
