interface Team {
    id: number;
    name: string;
    slug: string;
    gender: string;
    subTeams: any[]; 
  }
  
  interface Score {
    current: number;
    period1: number;
    normaltime: number;
  }
  
  interface Match {
    id: string;
    name: string;
    competitionId: string;
    competition: string;
    countryId: string;
    country: string;
    timestamp: number;
    date: string;
    time: string;
    status: {
      code: number;
      type: string;
    };
    round: {
      round: number;
    };
    homeTeam: Team;
    awayTeam: Team;
    homeScore: Score;
    awayScore: Score;
    liveStatus: string;
  }
  
  export type MatchType = Match;