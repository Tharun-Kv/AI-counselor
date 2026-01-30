"use client";

import React, { useState, useEffect } from "react";
import styles from "./application.module.css";

interface Props {
    uniId: number;
    onUnlock: () => void;
}

interface Task {
    id: number;
    text: string;
    category: "Doc" | "Exam" | "Action";
    completed: boolean;
}

const INITIAL_TASKS: Task[] = [
    { id: 1, text: "Draft Statement of Purpose (SOP)", category: "Doc", completed: false },
    { id: 2, text: "Request Letters of Recommendation (3)", category: "Doc", completed: false },
    { id: 3, text: "Order Official Transcripts", category: "Doc", completed: true },
    { id: 4, text: "Book GRE Slot", category: "Exam", completed: false },
    { id: 5, text: "Create Application Account Portal", category: "Action", completed: false },
];

const DEADLINES = [
    { date: "Oct 15", event: "Early Action Deadline", passed: true },
    { date: "Dec 01", event: "Regular Decision Deadline", passed: false },
    { date: "Jan 15", event: "Final Doc Submission", passed: false },
];

export default function ApplicationDashboard({ uniId, onUnlock }: Props) {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [showUnlockWarning, setShowUnlockWarning] = useState(false);

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <span className={styles.lockedLabel}>Target Locked 🔒</span>
                    <h2 className={styles.uniTitle}>University Application ID: #{uniId}</h2>
                    <span className="text-gray-400 text-sm">Application Portal: CommonApp</span>
                </div>
                <button className={styles.unlockBtn} onClick={() => setShowUnlockWarning(true)}>
                    Unlock / Change University
                </button>
            </div>

            {/* Progress */}
            <div className={styles.progressSection}>
                <div className={styles.progressLabel}>
                    <span>Application Readiness</span>
                    <span>{progress}%</span>
                </div>
                <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Main To-Do List */}
                <div className={styles.card}>
                    <div className={styles.cardTitle}>
                        <span>AI-Generated Action Items</span>
                        <span className="text-sm font-normal text-gray-400">{tasks.filter(t => !t.completed).length} Remaining</span>
                    </div>
                    <div className={styles.taskList}>
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className={`${styles.taskItem} ${task.completed ? styles.checked : ''}`}
                                onClick={() => toggleTask(task.id)}
                            >
                                <div className={styles.checkbox}>
                                    {task.completed && "✓"}
                                </div>
                                <span className={styles.taskText}>{task.text}</span>
                                <span className={styles.tag}>{task.category}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar info */}
                <div className="flex flex-col gap-6">
                    {/* Deadlines */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Key Dates</h3>
                        <div>
                            {DEADLINES.map((d, i) => (
                                <div key={i} className={`${styles.timelineItem} ${!d.passed ? styles.timelineActive : ''}`}>
                                    <div className={styles.timelineDot}></div>
                                    <div className={styles.date}>{d.date}</div>
                                    <div className={`${styles.event} ${d.passed ? 'text-gray-500 line-through' : ''}`}>{d.event}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Documents Summary */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Req. Documents</h3>
                        <ul className="list-disc pl-5 text-gray-400 text-sm space-y-2">
                            <li>CV / Resume</li>
                            <li>SOP (2 Pages)</li>
                            <li>3 Letters of Rec</li>
                            <li>Official GRE Score Report</li>
                            <li>Passport Copy</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Unlock Warning Modal */}
            {showUnlockWarning && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-red-500/30 p-8 rounded-xl max-w-sm text-center">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold mb-2">Unlock University?</h3>
                        <p className="text-gray-400 mb-6 text-sm">
                            This will delete your progress on this application checklist and return you to the Shortlisting stage.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="btn btn-secondary" onClick={() => setShowUnlockWarning(false)}>Cancel</button>
                            <button className="btn btn-primary" style={{ background: '#ef4444' }} onClick={onUnlock}>Confirm Unlock</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
