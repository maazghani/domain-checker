import { useState } from 'react';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<null | { domainExists: boolean; whoisData: string }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to check domain');
      } else {
        setResult({
          domainExists: data.domainExists,
          whoisData: data.whoisData,
        });
      }
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Domain Checker</h1>
      <input
        type="text"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="Enter domain (e.g., cyberch.ai)"
        style={{
          padding: '8px',
          fontSize: '16px',
          width: '300px',
          marginRight: '10px',
        }}
      />
      <button
        onClick={handleCheck}
        style={{
          padding: '8px 12px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
        disabled={loading || !domain.trim()}
      >
        {loading ? 'Checking...' : 'Check'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Results:</h2>
          <p>
            <strong>Domain Exists:</strong> {result.domainExists ? 'Yes' : 'No'}
          </p>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '5px',
              overflowX: 'auto',
            }}
          >
            {result.whoisData}
          </pre>
        </div>
      )}
    </div>
  );
}

