export const EmailLogStatuses = {
    SUCCESS: 'Success',
    FAILURE: 'Failure',
} as const;

export type EmailLogStatus = (typeof EmailLogStatuses)[keyof typeof EmailLogStatuses];
