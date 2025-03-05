import { useQuery } from '@tanstack/react-query';

// Function to fetch tag suggestions from the API
export const fetchTagSuggestions = async (query: string) => {
  const response = await fetch(`https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?search=${query}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch suggestions');
  }
  
  return response.json();
};

// React Query hook for tag suggestions
export const useTagSuggestions = (query: string) => {
  return useQuery({
    queryKey: ['tagSuggestions', query],
    queryFn: () => fetchTagSuggestions(query),
    enabled: query.length > 0,
    staleTime: 60000, // 1 minute
  });
}; 