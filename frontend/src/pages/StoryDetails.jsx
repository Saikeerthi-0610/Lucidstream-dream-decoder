import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

export default function StoryDetails() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/stories/${id}`).then((res) => {
      setStory(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div style={{padding:24}}>Loading…</div>;
  if (!story) return <div style={{padding:24}}>Story not found</div>;

  return (
    <div className="story-detail" style={{maxWidth:780, margin:'18px auto', padding:18}}>
      <button className="secondary" onClick={() => navigate(-1)} style={{marginBottom:12}}>Back</button>
      <div className="page-header" style={{marginBottom:6}}>
        <h1>{story.title}</h1>
      </div>
      <div style={{color:'#bfbfd6',marginBottom:18}}>by {story.author || 'Guest'} — {new Date(story.created_at).toLocaleString()}</div>
      <div style={{background:'rgba(255,255,255,0.03)',padding:18,borderRadius:12}}>
        <p style={{whiteSpace:'pre-wrap',lineHeight:1.6}}>{story.content}</p>
      </div>
    </div>
  );
}