// src/lib/userService.ts

export interface User {
    id: string;
    email: string;
    name: string;
    userType: 'investor' | 'entrepreneur';
    password: string; // Add this line
    verified: boolean;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    fundingGoal: number;
    currentFunding: number;
    status: 'pending' | 'active' | 'funded';
}

const mockProjects: Project[] = [
    {
        id: '1',
        name: 'EcoFriendly Water Bottle',
        description: 'Biodegradable water bottle that reduces plastic waste',
        fundingGoal: 50000,
        currentFunding: 30000,
        status: 'active'
    },
    {
        id: '2',
        name: 'Smart Home Energy Saver',
        description: 'AI-powered device to optimize home energy usage',
        fundingGoal: 100000,
        currentFunding: 75000,
        status: 'active'
    },
    {
        id: '3',
        name: 'Online Learning Platform',
        description: 'Interactive platform for personalized learning experiences',
        fundingGoal: 200000,
        currentFunding: 150000,
        status: 'active'
    }
];

export function registerUser(user: User): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

export function loginUser(email: string, password: string): User | null {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
    return null;
}

export function getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

export function logoutUser(): void {
    localStorage.removeItem('currentUser');
}

export function getProjects(): Project[] {
    return mockProjects;
}

export function getUserProject(userId: string): Project | null {
    // In a real app, we'd fetch the user's project. For now, return a mock project.
    return {
        id: '4',
        name: 'Your Amazing Project',
        description: 'This is your project description',
        fundingGoal: 75000,
        currentFunding: 45000,
        status: 'active'
    };
}

export function verifyUser(email: string): void {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => u.email === email ? {...u, verified: true} : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
}

