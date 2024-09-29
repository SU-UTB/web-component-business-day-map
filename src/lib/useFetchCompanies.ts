import { useEffect, useState } from 'react';
import { CompanyType } from './appTypes';

export const useFetchCompanies = () => {
  const [data, setData] = useState<CompanyType[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();

    const getData = async () => {
      try {
        const response = await fetch('https://businessday.utb.cz/api/api.php', {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}, ${response.statusText}`);
        }

        const data = await response.json();
        setData(data);
        setErr(null);
      } catch (err) {
        if (abortController.signal.aborted) {
          console.error('Fetch aborted');
        } else if (err instanceof Error) {
          setErr(err.message);
        } else {
          setErr('Unexpected error');
        }
      } finally {
        setIsLoading(false);
      }
    };

    getData();
    return () => abortController.abort();
  }, []);

  return { data, isLoading, err };
};
