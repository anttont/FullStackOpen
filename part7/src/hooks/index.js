import { useState } from 'react';

export const useAnecdoteManager = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ]);

  const [notification, setNotification] = useState(null);

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
    setNotification(`Added ${anecdote.content}`);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const vote = (id) => {
    const anecdote = anecdotes.find(a => a.id === id);
    const voted = { ...anecdote, votes: anecdote.votes + 1 };
    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a));
  };

  const anecdoteById = (id) => anecdotes.find(a => a.id === id);

  return {
    anecdotes,
    notification,
    addNew,
    vote,
    anecdoteById
  };
};
