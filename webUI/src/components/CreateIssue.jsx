import React, { useState , useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateIssue.css';

const CreateIssue = ({ onClose }) => {
  const initialState = {
    title: '',
    description: '',
    status: 'Backlog',
    priority: 'LOW',
    estimate: 0 
  };

  const [issue, setIssue] = useState(initialState);
  const [estimate, setEstimate] = useState(0); 
  const [members, setMembers] = useState([]); 

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3009/api/members');
        setMembers(response.data); 
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIssue({ ...issue, [name]: value });
  };

  const handleEstimateChange = (e) => {
    const value = parseInt(e.target.value);
    setEstimate(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = Math.floor(Math.random() * 10000000);
      const time = new Date().toISOString();
      const ticketNumber = Math.floor(Math.random() * 1000);
      const ticketName = `T-${ticketNumber}`;
      const issueWithId = { ...issue, id, estimate, time, ticketName };
  
      console.log('Submitting issue:', issueWithId);
  
      const response = await axios.post('http://localhost:3009/api/issues', issueWithId);
      
      alert(response.data.message);
      setIssue(initialState);
      setEstimate(0); 
      onClose();
    } catch (error) {
      console.error('There was an error creating the issue:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="issue-form">
        <button type="button" className="close-button" onClick={onClose}>×</button>
        <h2>Create new issue</h2>
        <div className="form-row">
          <div className="form-column">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={issue.title}
              onChange={handleInputChange}
              placeholder="Write the title"
              required
            />
             <label htmlFor="estimate">Estimate</label>
            <input
              id="estimate"
              name="estimate"
              type="number"
              value={estimate}
              onChange={handleEstimateChange}
              placeholder="Enter estimate"
              required
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={issue.description}
              onChange={handleInputChange}
              placeholder="Add a description"
              required
            />
          </div>
          <div className="form-column">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={issue.status} onChange={handleInputChange}>
              <option value="To Do">To Do</option>
              <option value="Backlog">Backlog</option>
             
            </select>
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={issue.priority} onChange={handleInputChange}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
            <label htmlFor="assignee">Assignee</label>
        <select id="assignee" name="assignee" value={issue.assignee} onChange={handleInputChange}>
          {members.map(member => (
            <option key={member.id} value={member.name}>{member.name}</option>
          ))}
        </select>
        <label htmlFor="reporter">Reporter</label>
        <select id="reporter" name="reporter" value={issue.reporter} onChange={handleInputChange}>
          {members.map(member => (
            <option key={member.id} value={member.name}>{member.name}</option>
          ))}
        </select>
          </div>
        </div>
        <button type="submit" className="accept-button">Accept</button>
      </form>
    </div>
  );
};

export default CreateIssue;


