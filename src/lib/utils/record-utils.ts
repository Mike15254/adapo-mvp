import type { RecordModel } from 'pocketbase';
import type { StartupUpdate, Investment } from '$lib/types/dashboard.types';

export function transformStartupUpdate(record: RecordModel): StartupUpdate {
    return {
        id: record.id,
        startup: record.startup,
        title: record.title || '',
        content: record.content || '',
        update_type: record.update_type || 'general',
        attachments: record.attachments || [],
        created: record.created
    };
}

export function transformInvestment(record: RecordModel): Investment {
    return {
        id: record.id,
        amount: record.amount || 0,
        status: record.status || 'pending',
        project: record.project,
        investor: record.investor,
        transaction_date: record.transaction_date,
        startup: record.startup
    };
}