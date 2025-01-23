import { QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';

export class User {
    name: string;
    email: string;
    uid: string;

    constructor(name: string, email: string, uid: string) {
        this.name = name;
        this.email = email;
        this.uid = uid;
    }
    toString(): string {
        return this.name + ', ' + this.email + ', ' + this.uid;
    }
}

// Firestore data converter
export const userConverter = {
    toFirestore: (user: User) => {
        return {
            name: user.name,
            email: user.email,
            uid: user.uid
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new User(data.name, data.email, data.uid);
    }
};

export class Workspace {
    messages: any[];
    fileData: any;
    user: User;

    constructor(messages: any[], fileData: any, user: User) {
        this.messages = messages;
        this.fileData = fileData;
        this.user = user;
    }
    toString(): string {
        return this.messages + ', ' + this.fileData + ', ' + this.user;
    }
}

export const workspaceConverter = {
    toFirestore: (workspace: Workspace) => {
        return {
            messages: workspace.messages,
            fileData: workspace.fileData,
            user: workspace.user
        };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        return new Workspace(data.messages, data.fileData, data.user);
    }
}