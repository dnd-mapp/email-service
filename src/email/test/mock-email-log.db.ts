import { nanoid } from 'nanoid';

interface EmailLogRecord {
    id: string;
    to: string;
    status: string;
    sentAt: Date;
    errorMessage: string | null;
}

export class MockEmailLogDB {
    private records: EmailLogRecord[] = [];

    public getAll() {
        return [...this.records];
    }

    public add(to: string, status: string, errorMessage?: string) {
        const record: EmailLogRecord = {
            id: nanoid(),
            to,
            status,
            sentAt: new Date(),
            errorMessage: errorMessage ?? null,
        };

        this.records.push(record);
        return record;
    }
}
