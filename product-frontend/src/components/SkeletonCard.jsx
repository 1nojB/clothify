import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="card">
      <div className="card-image skel-img skeleton" />
      <div className="card-body">
        <div className="skel-line skeleton" style={{ width: '60%' }} />
        <div className="skel-line skeleton" style={{ width: '90%', height: 12 }} />
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skel-line skeleton" style={{ width: 80, height: 32 }} />
          <div className="skel-line skeleton" style={{ width: 80, height: 32 }} />
        </div>
      </div>
    </div>
  );
}
