/**
 * Composable for port/location search functionality
 * Uses curated dataset of ~3,119 major world ports
 */

import type { PortOption } from "~/src/types/ports.types";
import portsData from "~/src/constants/world-ports.json";

export const usePorts = () => {
  // Cast imported JSON to proper type
  const ports = portsData as PortOption[];

  /**
   * Search ports by query string
   * Searches in city and country names
   */
  const searchPorts = (query: string, limit: number = 50): PortOption[] => {
    if (!query || query.length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();

    return ports
      .filter((port) => {
        const cityMatch = port.city.toLowerCase().includes(searchTerm);
        const countryMatch = port.country.toLowerCase().includes(searchTerm);
        const labelMatch = port.label.toLowerCase().includes(searchTerm);

        return cityMatch || countryMatch || labelMatch;
      })
      .slice(0, limit);
  };

  /**
   * Get all ports (use with caution - large dataset)
   */
  const getAllPorts = (): PortOption[] => {
    return ports;
  };

  /**
   * Get ports by country
   */
  const getPortsByCountry = (country: string): PortOption[] => {
    return ports.filter(
      (port) => port.country.toLowerCase() === country.toLowerCase()
    );
  };

  /**
   * Find exact port match
   */
  const findPort = (city: string, country: string): PortOption | undefined => {
    return ports.find(
      (port) =>
        port.city.toLowerCase() === city.toLowerCase() &&
        port.country.toLowerCase() === country.toLowerCase()
    );
  };

  /**
   * Get port labels for autocomplete (optimized)
   */
  const getPortLabels = (limit?: number): string[] => {
    const labels = ports.map((port) => port.label);
    return limit ? labels.slice(0, limit) : labels;
  };

  /**
   * Parse port value string back to city and country
   * Value format: "City|Country"
   */
  const parsePortValue = (
    value: string
  ): { city: string; country: string } | null => {
    if (!value) return null;

    const [city, country] = value.split("|");
    if (!city || !country) return null;

    return { city, country };
  };

  return {
    // Data
    ports: readonly(ref(ports)),
    totalPorts: ports.length,

    // Methods
    searchPorts,
    getAllPorts,
    getPortsByCountry,
    findPort,
    getPortLabels,
    parsePortValue,
  };
};
