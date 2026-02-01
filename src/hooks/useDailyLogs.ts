import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type DailyLog = {
	id: string;
	user_id: string;
	date: string;
	content: string;
	created_at?: string;
};

export function useDailyLogs(userId?: string) {
	const [logs, setLogs] = useState<DailyLog[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchLogs = useCallback(
		async (uid?: string) => {
			if (!uid) return;
			setLoading(true);
			setError(null);
			const { data, error } = await supabase
				.from<DailyLog>('daily_logs')
				.select('*')
				.eq('user_id', uid)
				.order('date', { ascending: false });
			if (error) setError(error.message);
			else setLogs(data ?? []);
			setLoading(false);
		},
		[]
	);

	useEffect(() => {
		if (userId) fetchLogs(userId);
	}, [userId, fetchLogs]);

	const insertLog = useCallback(
		async (log: Omit<DailyLog, 'id' | 'created_at'>) => {
			const { data, error } = await supabase.from('daily_logs').insert([log]).select().single();
			if (error) throw error;
			setLogs(prev => [data, ...prev] as DailyLog[]);
			return data;
		},
		[]
	);

	return { logs, loading, error, fetchLogs, insertLog, setLogs };
}
