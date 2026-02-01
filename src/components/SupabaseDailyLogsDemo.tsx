import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useDailyLogs } from '../hooks/useDailyLogs';

export default function SupabaseDailyLogsDemo() {
	const [userId, setUserId] = useState<string | null>(null);
	const { logs, loading, error, insertLog } = useDailyLogs(userId ?? undefined);
	const [content, setContent] = useState('');

	useEffect(() => {
		(async () => {
			const { data } = await supabase.auth.getUser();
			if (data?.user) setUserId(data.user.id);
		})();
	}, []);

	const handleAdd = async () => {
		if (!userId) {
			alert('Not signed in');
			return;
		}
		await insertLog({ user_id: userId, date: new Date().toISOString().slice(0, 10), content });
		setContent('');
	};

	return (
		<div>
			<h3>Supabase Daily Logs Demo</h3>
			{userId ? <div>Signed in as {userId}</div> : <div>Not signed in</div>}
			<div>
				<input value={content} onChange={e => setContent(e.target.value)} placeholder="Log content" />
				<button onClick={handleAdd}>Add</button>
			</div>
			{loading && <div>Loading...</div>}
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<ul>{logs.map(l => <li key={l.id}><strong>{l.date}</strong>: {l.content}</li>)}</ul>
		</div>
	);
}
