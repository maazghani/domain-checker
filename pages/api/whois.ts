import type { NextApiRequest, NextApiResponse } from 'next';
import whois from 'whois';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { domain } = req.query;

  // Ensure that a domain is provided
  if (!domain || typeof domain !== 'string') {
    return res.status(400).json({ error: 'No domain provided' });
  }

  // Perform the WHOIS lookup
  whois.lookup(domain, (err: Error | null, data: string) => {
    if (err) {
      return res.status(500).json({ error: 'WHOIS lookup failed', details: err.message });
    }

    // Check if the response contains common "not found" or "no match" messages
    let domainExists = true;
    
    // Adding more patterns to capture various domain non-existence messages
    if (
      /No match for/i.test(data) ||
      /NOT FOUND/i.test(data) ||
      /The queried object does not exist/i.test(data) ||
      /No Object Found/i.test(data)
    ) {
      domainExists = false;
    }

    // Return the result
    res.status(200).json({ domain, domainExists, whoisData: data });
  });
}
