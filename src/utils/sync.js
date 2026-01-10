import { getPendingSubmissions, deleteSubmission, updateSubmissionStatus } from './db';
import { fetchWithAuth } from './api';

export async function syncPendingSubmissions() {
  try {
    const pending = await getPendingSubmissions();
    if (!pending || pending.length === 0) return { synced: 0 };
    let synced = 0;
    for (const rec of pending) {
      try {
        const resp = await fetchWithAuth('/api/quiz/submit.php', {
          method: 'POST',
          body: JSON.stringify(rec)
        });
        if (resp.ok) {
          // mark as synced instead of deleting
          await updateSubmissionStatus(rec.localId, 'synced');
          synced++;
        } else {
          await updateSubmissionStatus(rec.localId, 'failed');
        }
      } catch (err) {
        await updateSubmissionStatus(rec.localId, 'failed');
      }
    }
    return { synced };
  } catch (error) {
    console.error('Error syncing submissions:', error);
    return { error };
  }
}

export function startSyncOnNetwork() {
  // attempt a sync on startup and when the browser goes online
  (async () => {
    try { await syncPendingSubmissions(); } catch (e) { /* ignore */ }
  })();
  window.addEventListener('online', () => { syncPendingSubmissions(); });
}
