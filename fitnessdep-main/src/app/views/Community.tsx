'use client';

import React, { useState } from 'react';
import { useFitnessStore } from '@/store/useFitnessStore';
import { MessageSquare, Heart, Send, Users, Sparkles } from 'lucide-react';

export default function Community() {
  const { communityFeed, addPost, likePost, commentPost } = useFitnessStore();
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addPost(newPostContent);
    setNewPostContent('');
  };

  const handleSendComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    commentPost(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header HUD */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>COMMUNITY_UPLINK</span>
            <span className="text-[10px] bg-neon-purple/20 border border-neon-purple/40 text-neon-purple px-2 py-0.5 rounded font-mono">
              SOCIAL_TELMETRY
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Share transformation updates, training PRs, and connect with other users.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Composer & Feed */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Post composer */}
          <form onSubmit={handleCreatePost} className="glass-panel glass-panel-glow-purple rounded-3xl p-5 space-y-4">
            <span className="font-mono text-[9px] text-neon-purple/60 tracking-wider block">CREATE_TRANSMISSION</span>
            
            <textarea
              required
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Broadcast a new transformation update or fitness post..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple/50 transition-all font-sans"
            />
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-neon-purple to-neon-blue text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-[0_0_15px_rgba(189,0,255,0.15)] flex items-center gap-1.5 hover:opacity-90 active:scale-95"
              >
                <Send size={12} />
                <span>BROADCAST</span>
              </button>
            </div>
          </form>

          {/* Social feed list */}
          <div className="space-y-4">
            {communityFeed.map((post) => (
              <div key={post.id} className="glass-panel border-white/5 rounded-3xl p-5 space-y-4">
                {/* User Info header */}
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt={post.username}
                    className="w-9 h-9 rounded-full border border-neon-purple/40"
                  />
                  <div className="text-left font-sans">
                    <div className="text-xs font-bold text-white leading-tight">{post.username}</div>
                    <div className="text-[9px] text-gray-500 font-mono mt-0.5">{post.time}</div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-xs text-gray-300 leading-relaxed text-left">{post.content}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-gray-400 font-mono text-[9px]">
                  <button
                    type="button"
                    onClick={() => likePost(post.id)}
                    className={`flex items-center gap-1.5 transition-all hover:text-neon-pink ${
                      post.hasLiked ? 'text-neon-pink' : ''
                    }`}
                  >
                    <Heart size={14} className={post.hasLiked ? 'fill-current' : ''} />
                    <span>{post.likes} LIKES</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare size={14} />
                    <span>{post.comments.length} COMMENTS</span>
                  </div>
                </div>

                {/* Comments block */}
                {post.comments.length > 0 && (
                  <div className="space-y-2.5 bg-white/5 p-3 rounded-2xl border border-white/5">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="text-left text-[11px] leading-snug">
                        <span className="font-bold text-white mr-1.5 font-mono">{comment.username}:</span>
                        <span className="text-gray-400">{comment.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Post comment input */}
                <div className="flex gap-2 relative">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-neon-purple/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendComment(post.id)}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/40 text-neon-purple rounded-lg flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Send size={10} />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Online Challenges & Leaders */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Challanges */}
          <div className="glass-panel glass-panel-glow-purple rounded-3xl p-6 space-y-4">
            <span className="font-mono text-[9px] text-neon-purple/60 tracking-wider flex items-center gap-1">
              <Users size={12} />
              <span>ACTIVE_SECTOR_CHALLENGES</span>
            </span>
            <h3 className="text-base font-bold text-white">Daily Co-op Goals</h3>

            <div className="space-y-3">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-left space-y-1">
                <div className="text-xs font-bold text-white leading-snug">Cardio Sync-Up</div>
                <p className="text-[10px] text-gray-400">Log 60 minutes of cardio as a team today.</p>
                <div className="flex justify-between items-center text-[9px] font-mono text-neon-purple pt-2">
                  <span>PROGRESS: 45/60m</span>
                  <span>XP: +300</span>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-left space-y-1">
                <div className="text-xs font-bold text-white leading-snug">Hydration Alliance</div>
                <p className="text-[10px] text-gray-400">Total water logged needs to reach 10,000ml.</p>
                <div className="flex justify-between items-center text-[9px] font-mono text-neon-emerald pt-2">
                  <span>PROGRESS: 8,250/10,000ml</span>
                  <span>XP: +250</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-2 text-xs text-neon-purple font-bold font-mono">
            <Sparkles size={14} className="animate-pulse" />
            <span>DAILY SOCIAL BONUSES READY</span>
          </div>

        </div>

      </div>
    </div>
  );
}
