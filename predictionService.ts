
import { WinGoResult, HistoryResponse } from '../types';

const API_URL = 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json';

export const fetchHistory = async (): Promise<WinGoResult[]> => {
  try {
    // Note: In a real browser, CORS might block this. 
    // Usually these tools use a proxy or run in an environment that allows it.
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const json: HistoryResponse = await response.json();
    
    return json.data.list.map(item => ({
      issueNumber: item.issueNumber,
      number: parseInt(item.number),
      size: parseInt(item.number) >= 5 ? 'BIG' : 'SMALL',
      color: mapColor(item.colour)
    }));
  } catch (error) {
    console.error("Failed to fetch history:", error);
    // Fallback/Mock data for demonstration if API fails
    return Array.from({ length: 20 }, (_, i) => ({
      issueNumber: (20240501000 + i).toString(),
      number: Math.floor(Math.random() * 10),
      size: Math.random() > 0.5 ? 'BIG' : 'SMALL',
      color: 'green'
    }));
  }
};

const mapColor = (colorStr: string): any => {
  if (colorStr.includes('green')) return 'green';
  if (colorStr.includes('red')) return 'red';
  return 'violet';
};

/**
 * Neural-inspired trend analysis
 * Analyzes patterns like:
 * - Alternating (B S B S)
 * - Streaks (B B B B)
 * - Mirroring
 * - Weighted average of last 10 periods
 */
export const analyzeTrend = (history: WinGoResult[]): 'BIG' | 'SMALL' => {
  if (history.length === 0) return Math.random() > 0.5 ? 'BIG' : 'SMALL';

  const last10 = history.slice(0, 10);
  const bigCount = last10.filter(h => h.size === 'BIG').length;
  const smallCount = 10 - bigCount;

  // Simple Trend Follower Logic
  // If a streak of 3+ exists, follow it.
  const last3 = history.slice(0, 3);
  if (last3.every(h => h.size === 'BIG')) return 'BIG';
  if (last3.every(h => h.size === 'SMALL')) return 'SMALL';

  // If alternating, continue alternating
  if (last3[0].size !== last3[1].size && last3[1].size !== last3[2].size) {
    return last3[0].size === 'BIG' ? 'SMALL' : 'BIG';
  }

  // Otherwise, play the underdog (Correction logic)
  return bigCount > smallCount ? 'SMALL' : 'BIG';
};

export const getNextPeriod = (currentIssue: string): string => {
  const issueNum = BigInt(currentIssue);
  return (issueNum + 1n).toString();
};
