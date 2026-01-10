import { useState, useEffect } from 'react';
import { importDatabaseDump, createDemoAccounts } from '../utils/db_importer';

export default function AdminImportPage(){
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImport = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try{
      const parsed = JSON.parse(text);
      const res = await importDatabaseDump(parsed);
      setResult(res);
    }catch(e){
      setError(String(e));
    }finally{
      setLoading(false);
    }
  };

  const handleCreateDemo = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try{
      const res = await createDemoAccounts();
      setResult(res);
    }catch(e){
      setError(String(e));
    }finally{
      setLoading(false);
    }
  };

  // Auto-create demo accounts on first visit if none exist
  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      try{
        // only auto-create if textarea empty (safe-guard)
        if (!text || text.trim() === '') {
          const res = await createDemoAccounts();
          if (mounted) setResult(res);
        }
      }catch(e){
        if (mounted) setError(String(e));
      }
    })();
    return ()=>{ mounted = false };
  },[]);

  return (
    <div style={{padding:20}}>
      <h2>Admin DB Import</h2>
      <p>Paste JSON export containing <strong>users</strong>, <strong>quizzes</strong>, and <strong>submissions</strong>. Use the SQL queries in <code>backend/database/export_queries.sql</code> to extract data from your MySQL server and convert to JSON.</p>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} style={{width:'100%',height:300}} placeholder='{"users":[],"quizzes":[],"submissions":[]}'>
      </textarea>
      <div style={{marginTop:12,display:'flex',gap:8}}>
        <button onClick={handleImport} disabled={loading}>{loading? 'Importing...':'Import'}</button>
        <button onClick={handleCreateDemo} disabled={loading}>{loading? 'Working...':'Create Demo Accounts'}</button>
      </div>
      {error && <pre style={{color:'red'}}>{error}</pre>}
      {result && <pre style={{marginTop:12}}>{JSON.stringify(result,null,2)}</pre>}
    </div>
  );
}
