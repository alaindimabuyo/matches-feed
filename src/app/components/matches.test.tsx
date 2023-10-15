import React from 'react';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';
import Matches from './Matches';
import mockData from '@/app/constants/mockData'


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([mockData]),
  })
);

afterEach(() => {
  global.fetch.mockClear();
});

test('Initial rendering without any filter', () => {
  render(<Matches />);
  const matchItems = screen.getAllByTestId('match-item');
  expect(matchItems.length).toBeGreaterThan(0); 
  expect(screen.getByText('All:')).toBeInTheDocument(); 
 
});

test('Filter by "Result"', () => {
  render(<Matches />);
  const resultFilterButton = screen.getByText('Result:');
  fireEvent.click(resultFilterButton);
  const matchItems = screen.getAllByTestId('match-item');

  matchItems.forEach((matchItem) => {
    expect(screen.getByTestId(matchItem)).toHaveTextContent('Result');
  });

});

test('Filter by "Live"', () => {
  render(<Matches />);
  const liveFilterButton = screen.getByText('Live:');
  fireEvent.click(liveFilterButton);
  const matchItems = screen.getAllByTestId('match-item');

  matchItems.forEach((matchItem) => {
    expect(screen.getByTestId(matchItem)).toHaveTextContent('Live');
  });

});

test('Filter by "Upcoming"', () => {
  render(<Matches />);
  const upcomingFilterButton = screen.getByText('Upcoming:');
  fireEvent.click(upcomingFilterButton);
  const matchItems = screen.getAllByTestId('match-item');

  matchItems.forEach((matchItem) => {
    expect(screen.getByTestId(matchItem)).toHaveTextContent('Upcoming');
  });

});

test('Filter by "Cancelled"', () => {
  render(<Matches />);
  const cancelledFilterButton = screen.getByText('Cancelled:');
  fireEvent.click(cancelledFilterButton);
  const matchItems = screen.getAllByTestId('match-item');

  matchItems.forEach((matchItem) => {
    expect(screen.getByTestId(matchItem)).toHaveTextContent('Cancelled');
  });
 
});


test('Search for a specific competition', () => {
  render(<Matches />);
  const searchInput = screen.getByPlaceholderText('Search by competition');
  fireEvent.change(searchInput, { target: { value: 'Veikkausliiga' } });
  const matchItems = screen.getAllByTestId('match-item');

  matchItems.forEach((matchItem) => {
    expect(screen.getByTestId(matchItem)).toHaveTextContent('Veikkausliiga');
  });

});

test('Pagination', () => {
  render(<Matches />);
  const paginationButtons = screen.getAllByTestId('pagination-button');

  expect(paginationButtons.length).toBeGreaterThan(0);
  fireEvent.click(paginationButtons[1]); 

});