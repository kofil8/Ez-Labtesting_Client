"use client";

import type { SupportTicket } from "@/components/support/types";
import { API_ENDPOINTS } from "@/lib/api-contracts/endpoints";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSupportOptions {
  autoLoad?: boolean;
}

export function useSupport({ autoLoad = true }: UseSupportOptions = {}) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.SUPPORT.TICKETS, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tickets (${response.status})`);
      }

      const result = await response.json();
      if (mountedRef.current) {
        setTickets(result.data || []);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : "Failed to load tickets");
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const loadTicketById = useCallback(
    async (ticketId: string): Promise<SupportTicket | null> => {
      try {
        const response = await fetch(
          API_ENDPOINTS.SUPPORT.GET_TICKET(ticketId),
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch ticket (${response.status})`);
        }

        const result = await response.json();
        return result.data as SupportTicket;
      } catch (err) {
        console.error("Failed to load ticket:", err);
        return null;
      }
    },
    [],
  );

  const selectTicket = useCallback(
    async (ticket: SupportTicket) => {
      const full = await loadTicketById(ticket.id);
      if (mountedRef.current) {
        setSelectedTicket(full ?? ticket);
      }
    },
    [loadTicketById],
  );

  const updateSelectedTicketStatus = useCallback(
    (status: string) => {
      setSelectedTicket((prev) =>
        prev
          ? { ...prev, status: status.toUpperCase() as SupportTicket["status"] }
          : prev,
      );
      loadTickets();
    },
    [loadTickets],
  );

  const prependTicket = useCallback((ticket: SupportTicket) => {
    setTickets((prev) => [ticket, ...prev]);
  }, []);

  useEffect(() => {
    if (!autoLoad) return;

    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(API_ENDPOINTS.SUPPORT.TICKETS, {
          credentials: "include",
        });
        if (!response.ok)
          throw new Error(`Failed to fetch tickets (${response.status})`);
        const result = await response.json();
        if (!cancelled) setTickets(result.data || []);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load tickets",
          );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [autoLoad]);

  return {
    tickets,
    selectedTicket,
    setSelectedTicket,
    isLoading,
    error,
    loadTickets,
    selectTicket,
    updateSelectedTicketStatus,
    prependTicket,
  };
}
