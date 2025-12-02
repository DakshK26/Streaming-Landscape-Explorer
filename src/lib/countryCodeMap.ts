// ISO 3166-1 alpha-3 country codes mapping for react-simple-maps
// Maps common country names from the Netflix dataset to their ISO codes

export const countryCodeMap: Record<string, string> = {
  'United States': 'USA',
  'United Kingdom': 'GBR',
  'India': 'IND',
  'Canada': 'CAN',
  'France': 'FRA',
  'Japan': 'JPN',
  'Spain': 'ESP',
  'South Korea': 'KOR',
  'Mexico': 'MEX',
  'Australia': 'AUS',
  'Germany': 'DEU',
  'China': 'CHN',
  'Brazil': 'BRA',
  'Italy': 'ITA',
  'Turkey': 'TUR',
  'Hong Kong': 'HKG',
  'Egypt': 'EGY',
  'Thailand': 'THA',
  'Taiwan': 'TWN',
  'Nigeria': 'NGA',
  'Argentina': 'ARG',
  'Indonesia': 'IDN',
  'Philippines': 'PHL',
  'Belgium': 'BEL',
  'Norway': 'NOR',
  'Poland': 'POL',
  'Denmark': 'DNK',
  'Sweden': 'SWE',
  'Netherlands': 'NLD',
  'Switzerland': 'CHE',
  'Ireland': 'IRL',
  'New Zealand': 'NZL',
  'South Africa': 'ZAF',
  'Russia': 'RUS',
  'Singapore': 'SGP',
  'Malaysia': 'MYS',
  'Israel': 'ISR',
  'Pakistan': 'PAK',
  'Colombia': 'COL',
  'Chile': 'CHL',
  'Peru': 'PER',
  'United Arab Emirates': 'ARE',
  'Saudi Arabia': 'SAU',
  'Portugal': 'PRT',
  'Greece': 'GRC',
  'Czech Republic': 'CZE',
  'Austria': 'AUT',
  'Romania': 'ROU',
  'Hungary': 'HUN',
  'Finland': 'FIN',
  'Vietnam': 'VNM',
  'Ukraine': 'UKR',
  'Kenya': 'KEN',
  'Ghana': 'GHA',
  'Morocco': 'MAR',
  'Lebanon': 'LBN',
  'Jordan': 'JOR',
  'Kuwait': 'KWT',
  'Qatar': 'QAT',
  'Bangladesh': 'BGD',
  'Sri Lanka': 'LKA',
  'Nepal': 'NPL',
  'Iceland': 'ISL',
  'Luxembourg': 'LUX',
  'Malta': 'MLT',
  'Cyprus': 'CYP',
  'Croatia': 'HRV',
  'Serbia': 'SRB',
  'Bulgaria': 'BGR',
  'Slovakia': 'SVK',
  'Slovenia': 'SVN',
  'Estonia': 'EST',
  'Latvia': 'LVA',
  'Lithuania': 'LTU',
  'Uruguay': 'URY',
  'Venezuela': 'VEN',
  'Ecuador': 'ECU',
  'Bolivia': 'BOL',
  'Paraguay': 'PRY',
  'Cuba': 'CUB',
  'Jamaica': 'JAM',
  'Puerto Rico': 'PRI',
  'Dominican Republic': 'DOM',
  'Guatemala': 'GTM',
  'Panama': 'PAN',
  'Costa Rica': 'CRI',
  'West Germany': 'DEU',
  'Soviet Union': 'RUS',
  'East Germany': 'DEU',
};

export function getCountryCode(countryName: string): string | null {
  // Clean up the country name
  const cleaned = countryName.trim();
  
  // Direct lookup
  if (countryCodeMap[cleaned]) {
    return countryCodeMap[cleaned];
  }
  
  // Try case-insensitive lookup
  const lowerName = cleaned.toLowerCase();
  for (const [name, code] of Object.entries(countryCodeMap)) {
    if (name.toLowerCase() === lowerName) {
      return code;
    }
  }
  
  return null;
}
