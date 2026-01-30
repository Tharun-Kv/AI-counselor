"use client";

import React, { useState } from "react";
import styles from "./recommendations.module.css";

// Interface for what we get from Profile (Mocking for now as we didn't fully define the type export)
interface ProfileData {
    degree: string;
    gpa: string;
    field: string;
    countries: string[];
    budget: string;
}

interface University {
    id: number;
    name: string;
    location: string;
    category: "Dream" | "Target" | "Safe";
    matchScore: number;
    cost: string;
    risk: "High" | "Medium" | "Low";
    reasoning: string;
    strengths: string[];
}

interface Props {
    profile: ProfileData | null;
    shortlist: number[];
    onShortlistChange: (ids: number[]) => void;
    onLock: (id: number) => void;
}

const MOCK_RECOMMENDATIONS: University[] = [
    {
        id: 101,
        name: "Stanford University",
        location: "California, USA",
        category: "Dream",
        matchScore: 45,
        cost: "$65k/year",
        risk: "High",
        reasoning: "Your GPA is strong, but Stanford requires exceptional research experience which is not highlighted in your profile. However, it fits your career goals perfectly.",
        strengths: ["Top Tier Research", "Silicon Valley Access"]
    },
    {
        id: 102,
        name: "Georgia Tech",
        location: "Atlanta, USA",
        category: "Target",
        matchScore: 88,
        cost: "$45k/year",
        risk: "Medium",
        reasoning: "Excellent match for your Profile. Your GPA meets their average intake requirement. The program focus aligns with your interest in AI.",
        strengths: ["High ROI", "Strong Alumni Network"]
    },
    {
        id: 103,
        name: "Arizona State University",
        location: "Phoenix, USA",
        category: "Safe",
        matchScore: 95,
        cost: "$35k/year",
        risk: "Low",
        reasoning: "You are well above the average acceptance criteria. This is a secure option with good scholarship potential based on your scores.",
        strengths: ["Scholarship Potential", "Large International Community"]
    },
    {
        id: 104,
        name: "University of Toronto",
        location: "Toronto, Canada",
        category: "Target",
        matchScore: 82,
        cost: "$40k/year",
        risk: "Medium",
        reasoning: "Strong option in Canada. Your profile fits well, though admission to the CS department is competitive.",
        strengths: ["Work Permit Friendly", "Global Reputation"]
    }
];

export default function AiRecommendations({ profile, shortlist, onShortlistChange, onLock }: Props) {
    const [warningModalOpen, setWarningModalOpen] = useState<{ open: boolean, uniId: number | null }>({ open: false, uniId: null });

    const toggleShortlist = (id: number) => {
        if (shortlist.includes(id)) {
            onShortlistChange(shortlist.filter(item => item !== id));
        } else {
            onShortlistChange([...shortlist, id]);
        }
    };

    const initiateLock = (id: number) => {
        setWarningModalOpen({ open: true, uniId: id });
    };

    const confirmLock = () => {
        if (warningModalOpen.uniId) {
            onLock(warningModalOpen.uniId);
            setWarningModalOpen({ open: false, uniId: null });
        }
    };

    // Group by category
    const grouped = {
        Dream: MOCK_RECOMMENDATIONS.filter(u => u.category === "Dream"),
        Target: MOCK_RECOMMENDATIONS.filter(u => u.category === "Target"),
        Safe: MOCK_RECOMMENDATIONS.filter(u => u.category === "Safe"),
    };

    return (
        <div className={styles.container}>
            {/* Analysis Panel */}
            <div className={`${styles.analysisPanel} animate-fade-in`}>
                <div className={styles.analysisTitle}>
                    <span>🤖</span> AI Analysis Report
                </div>
                <p className={styles.analysisText}>
                    Based on your profile <strong>({profile?.degree || "Student"})</strong>,
                    we noticed you have a strong academic record suitable for
                    <span className={`${styles.tag} ${styles.tagStrength} ml-2`}>Top 50 Universities</span>.
                    However, the budget constraint of <strong>{profile?.budget || "Standard"}</strong>
                    suggests focusing on public universities or high-scholarship options.
                </p>
            </div>

            {["Dream", "Target", "Safe"].map((cat) => {
                const category = cat as "Dream" | "Target" | "Safe";
                const unis = grouped[category];
                if (unis.length === 0) return null;

                let badgeClass = styles.badgeDream;
                if (category === "Target") badgeClass = styles.badgeTarget;
                if (category === "Safe") badgeClass = styles.badgeSafe;

                return (
                    <div key={category} className="animate-fade-in">
                        <div className={styles.sectionHeader}>
                            <span className={styles.categoryTitle}>{category} Options</span>
                            <span className={`${styles.categoryBadge} ${badgeClass}`}>{unis.length} Found</span>
                        </div>

                        <div className={styles.cardGrid}>
                            {unis.map(uni => {
                                const isShortlisted = shortlist.includes(uni.id);
                                return (
                                    <div key={uni.id} className={styles.recCard}>
                                        <div className={styles.cardHeader}>
                                            <div>
                                                <h3 className={styles.uniName}>{uni.name}</h3>
                                                <p className={styles.uniLocation}>{uni.location}</p>
                                            </div>
                                            <div className="text-2xl font-bold" style={{ color: uni.matchScore > 80 ? 'var(--success)' : '#fbbf24' }}>
                                                {uni.matchScore}%
                                            </div>
                                        </div>

                                        <div className={styles.cardBody}>
                                            <div className={styles.reasoningBlock}>
                                                <span className={styles.reasoningLabel}>Why it fits</span>
                                                <p className={styles.reasoningText}>{uni.reasoning}</p>
                                            </div>

                                            <div className={styles.metricsGrid}>
                                                <div className={styles.metric}>
                                                    <span className={styles.metricLabel}>Est. Cost</span>
                                                    <span className={styles.metricValue}>{uni.cost}</span>
                                                </div>
                                                <div className={styles.metric}>
                                                    <span className={styles.metricLabel}>Risk</span>
                                                    <span className={`${styles.metricValue} ${uni.risk === 'High' ? styles.riskHigh : uni.risk === 'Medium' ? styles.riskMed : styles.riskLow}`}>
                                                        {uni.risk}
                                                    </span>
                                                </div>
                                                <div className={styles.metric}>
                                                    <span className={styles.metricLabel}>ROI Score</span>
                                                    <span className={styles.metricValue}>A+</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.cardActions}>
                                            {isShortlisted ? (
                                                <>
                                                    <span className={styles.addedBadge}>✓ In Shortlist</span>
                                                    <button className={`${styles.actionBtn} ${styles.btnRemove}`} onClick={() => toggleShortlist(uni.id)}>
                                                        Remove
                                                    </button>
                                                    <button className={`${styles.actionBtn} ${styles.btnLock}`} onClick={() => initiateLock(uni.id)}>
                                                        Lock This
                                                    </button>
                                                </>
                                            ) : (
                                                <button className={`${styles.actionBtn} ${styles.btnAdd}`} onClick={() => toggleShortlist(uni.id)}>
                                                    + Add to Shortlist
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {/* Warning Modal */}
            {warningModalOpen.open && (
                <div className={styles.warningOverlay}>
                    <div className={styles.warningModal}>
                        <div className={styles.warningIcon}>⚠️</div>
                        <h3 className={styles.warningTitle}>Are you sure?</h3>
                        <p className={styles.warningText}>
                            Locking a university is a major step. It means you are committing to apply here.
                            You cannot change this later without contacting support.
                        </p>
                        <div className={styles.modalActions}>
                            <button className="btn btn-secondary" onClick={() => setWarningModalOpen({ open: false, uniId: null })}>Cancel</button>
                            <button className="btn btn-primary" onClick={confirmLock}>Yes, Lock it</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
