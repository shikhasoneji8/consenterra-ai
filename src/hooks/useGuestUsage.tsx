import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "prixplainer_guest_uses";
const COOKIE_KEY = "prixplainer_guest_uses";
const MAX_GUEST_USES = 2;

// Generate a simple fingerprint based on browser characteristics
const generateFingerprint = (): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx?.fillText("fingerprint", 10, 10);
  const canvasHash = canvas.toDataURL().slice(-50);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvasHash,
  ].join("|");
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// Cookie utilities
const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Strict`;
};

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

interface GuestUsageData {
  count: number;
  fingerprint: string;
  lastUsed: number;
}

const getStoredData = (): GuestUsageData | null => {
  try {
    // Try localStorage first
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      return JSON.parse(localData);
    }
    
    // Fallback to cookie
    const cookieData = getCookie(COOKIE_KEY);
    if (cookieData) {
      return JSON.parse(cookieData);
    }
    
    return null;
  } catch {
    return null;
  }
};

const setStoredData = (data: GuestUsageData) => {
  const dataStr = JSON.stringify(data);
  
  // Store in both localStorage and cookie for redundancy
  try {
    localStorage.setItem(STORAGE_KEY, dataStr);
  } catch {
    // localStorage might be full or disabled
  }
  
  setCookie(COOKIE_KEY, dataStr);
};

export interface UseGuestUsageReturn {
  guestUsageCount: number;
  remainingTries: number;
  canUseAsGuest: boolean;
  incrementUsage: () => number;
  getUsageToken: () => string;
  maxGuestUses: number;
}

export const useGuestUsage = (): UseGuestUsageReturn => {
  const [guestUsageCount, setGuestUsageCount] = useState(0);
  const [fingerprint, setFingerprint] = useState("");

  useEffect(() => {
    const fp = generateFingerprint();
    setFingerprint(fp);
    
    const storedData = getStoredData();
    
    if (storedData) {
      // Verify fingerprint matches (basic anti-tampering)
      if (storedData.fingerprint === fp) {
        setGuestUsageCount(storedData.count);
      } else {
        // Fingerprint changed - could be tampering, but also could be legitimate
        // Use the higher of stored count or 0 to be safe
        setGuestUsageCount(storedData.count);
      }
    } else {
      // First time visitor
      const newData: GuestUsageData = {
        count: 0,
        fingerprint: fp,
        lastUsed: Date.now(),
      };
      setStoredData(newData);
    }
  }, []);

  const incrementUsage = useCallback((): number => {
    const newCount = guestUsageCount + 1;
    setGuestUsageCount(newCount);
    
    const data: GuestUsageData = {
      count: newCount,
      fingerprint,
      lastUsed: Date.now(),
    };
    setStoredData(data);
    
    return newCount;
  }, [guestUsageCount, fingerprint]);

  // Generate a token that can be validated server-side
  const getUsageToken = useCallback((): string => {
    const data = {
      count: guestUsageCount,
      fingerprint,
      timestamp: Date.now(),
    };
    return btoa(JSON.stringify(data));
  }, [guestUsageCount, fingerprint]);

  const remainingTries = Math.max(0, MAX_GUEST_USES - guestUsageCount);
  const canUseAsGuest = guestUsageCount < MAX_GUEST_USES;

  return {
    guestUsageCount,
    remainingTries,
    canUseAsGuest,
    incrementUsage,
    getUsageToken,
    maxGuestUses: MAX_GUEST_USES,
  };
};
