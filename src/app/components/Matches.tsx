"use client"
import { useState, useEffect } from 'react';
import React from "react";
import {MatchType} from '@/app/constants/matchTypes'
import styled from 'styled-components';
import moment from 'moment';

const PAGE_SIZE = 9;

const Matches = () => {

  const [matches, setMatches] = useState<MatchType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
      fetch('https://raw.githubusercontent.com/spinbet/fe-interview-test/master/data/sports.json')
        .then((response) => response.json())
        .then((data) => setMatches(data))
        .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  const filteredMatches = matches.filter((match) => {
  
    if (selectedFilter === 'ALL') {
      return true;
    } else if (selectedFilter === 'Result') {
      return match.status.type === 'finished';
    } else if (selectedFilter === 'Live') {
      return match.status.type === 'inprogress';
    } else if (selectedFilter === 'Upcoming') {
      return match.status.type === 'notstarted';
    } else if (selectedFilter === 'Cancelled') {
      return match.status.type === 'canceled';
    }
  });

  const filteredMatchesBySearch = filteredMatches.filter((match) =>
    match.competition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMatches = filteredMatchesBySearch.length;
  const totalPages = Math.ceil(totalMatches / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = currentPage * PAGE_SIZE;

  const paginatedMatches = filteredMatchesBySearch.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const transformStatus = (code: number) => {
    switch (code) {
      case 100:
        return "ENDED"
      case 31:
      case 6:
      case 7:
        return "LIVE"
      case 0:
          return "Upcoming"
      case 70:
        return "CANCELLED"
      default:
        break;
    }
  }

  const handleClickFilter = (text: string) => {
    setSelectedFilter(text)
    setCurrentPage(1)
  }

  const filterButtons = [
    { text: 'Result', filter: 'Result', status: 'finished' },
    { text: 'Live', filter: 'Live', status: 'inprogress' },
    { text: 'Upcoming', filter: 'Upcoming', status: 'notstarted' },
    { text: 'Cancelled', filter: 'Cancelled', status: 'canceled' },
  ];

  const handleFilterChange = (text: string) => {
    setSelectedFilter(text);
    setCurrentPage(1);
  };

  const countMatches = (status: string) => matches.filter((match) => match.status.type === status).length;

    return (
      <MainContainer>
        <FilterButtons>
          <FilterButton active={'ALL' === selectedFilter} onClick={() => handleClickFilter('ALL')}>{`All: ${matches.length}`}</FilterButton>
          {filterButtons.map((button) => (
            <FilterButton key={button.text} onClick={() => handleFilterChange(button.filter)} active={button.text === selectedFilter}>
              {`${button.text}: ${countMatches(button.status)}`}
            </FilterButton>
          ))}
        </FilterButtons>
        <SearchBar
          type="text"
          placeholder="Search by competition"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
        <MatchContainer>
         {paginatedMatches.map((match) => (
            <MatchDetails key={match.id} data-testid="match-item">
            <Country>{match.country}</Country>
            <Competition>{match.competition}</Competition>
            <Status code={match.status.code}>{match.status.code === 0 ? moment(match.date, 'DD.MM.YYYY').format('MMMM Do') + ' ' + match.time : transformStatus(match.status.code) }</Status>
            <Score>{match.homeScore.current || 0} - {match.awayScore.current || 0}</Score>
            <StatusDetails>
              <TeamName>{match.homeTeam.name}</TeamName>
              <CircularProgressContainer>
                <CircularProgressSVG>
                  <CircularProgressCircle cx="30" cy="30" r="20" percentage={match.liveStatus} code={match.status.code}/>
                </CircularProgressSVG>
                <CircularProgressText>{(match.status.code === 100 || match.status.code === 7 || match.status.code === 31 || match.status.code === 6) && match.liveStatus}</CircularProgressText>
              </CircularProgressContainer>
        
              <TeamName style={{ textAlign: 'end' }}>{match.awayTeam.name}</TeamName>
            </StatusDetails>
          </MatchDetails>
          ))}
        </MatchContainer>
        <Pagination>
          {
            Array.from({length: totalPages}, (_, i) => (
              <PaginationButton
              data-testid="pagination-button"
              key={i}
              onClick={() => handlePageChange(i + 1)}
              active={i + 1 === currentPage}
              >
                {i + 1}
              </PaginationButton>
            ))
          }
        </Pagination>
      </MainContainer>
      
    )
};

export default Matches;

const StatusDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin-top: 1rem;
`
const MatchDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  padding: 1rem;
  background-color: #2b2b2b;
`
const MatchContainer = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-auto-columns: 1fr;
  color: #fafafa;
  flex-direction: row;

  @media (min-width: 100px) {
    grid-template-columns: 1fr;
  }

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const Country = styled.p`
  font-weight: 100;
  font-size: 12px;
`;

const Competition = styled.p`
  margin: 5px;
  font-size: 20px;
`;

const Status = styled.p<{ code: number }>`
  font-weight: 100;
  font-size: 12px;
  color: ${(props) => {
    switch (props.code) {
      case 100:
        return '#5CCB5E'; 
      case 31:
      case 6:
      case 7:
        return '#E3CC3D';
      case 0:
        return '#fff'; 
      case 70:
        return 'red'; 
      default:
        return '#fff';
    }
  }};
`;

const Score = styled.p`
  font-size: 50px;
  margin: 20px;
  font-weight: 700;
`;


const TeamName = styled.p`
  width: 30%;
  font-size: 20px;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
  display: grid;

  @media (min-width: 200px) {
    grid-template-columns: 1fr;
    margin: 1rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

`;

const FilterButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? '#333' : 'transparent')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  border-radius: .2rem;
  &:hover {
    background-color: #444;
    color: #fff;
  }

  @media (min-width: 300px) {
    width: 90vw
  }

  @media (min-width: 1024px) {
    width: 100%
  }

`;

const CircularProgressContainer = styled.div`
  position: relative;
  width: 3.5rem; 
  height: 3.5rem; 
`;

const CircularProgressSVG = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const CircularProgressCircle = styled.circle<{ code: number, percentage: any}>`
  fill: none;
  stroke:  ${(props) => {
    switch (props.code) {
      case 100:
        return '#5CCB5E'; 
      case 31:
      case 6:
      case 7:
        return '#5CCB5E';
      case 0:
        return '#4A505B'; 
      case 70:
        return '#4A505B'; 
      default:
        return '#4A505B';
    }
  }};
  stroke-width: 1; 
  stroke-linecap: round;
  stroke-dasharray: 124; 
  stroke-dashoffset: ${({percentage}) => percentage === "HT" ? 62 : 124 - (percentage / 100) * 124};
`;

const CircularProgressText = styled.p`
  position: absolute;
  top: 45%;
  left: 54%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #5CCB5E;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem;
  width: 100vw;
`;

const PaginationButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? '#333' : 'transparent')};
  color: ${(props) => (props.active ? '#fff' : '#333')};
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin: .3rem;
  cursor: pointer;
  width: 3rem;
  transition: background-color 0.3s, color 0.3s;
  border-radius: .2rem;
  &:hover {
    background-color: #444;
    color: #fff;
  }
`;

const SearchBar = styled.input`
  padding: .5rem .2rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  font-size: 12px;
  width: 90vw;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction:column;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;
`