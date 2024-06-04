import React from 'react';
import i from '../pages/statistics/InternalPage/InternalPage.module.scss';
import s from '../pages/statistics/Statistics.module.scss';

export default function PlacementCard({ ...info }) {
  // Check if info object and status are available
  const status = info && info.status ? info.status : '';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return { background: 'rgba(0, 128, 0, 0.561)' };
      case 'paused':
        return { background: 'rgba(185, 213, 71, 0.801)' };
      case 'archive':
        return { background: 'rgba(115, 116, 108, 0.801)' };
      default:
        return {};
    }
  };

  return (
    <div className={i.applec__item}>
      <p className={i.applec__item__title}>{status}</p>
      <p className={i.applec__item__subtitle} style={getStatusStyle(status)}>
        Статус: {status}
      </p>
      <p className={i.applec__item__subtitle}>{info && info.description}</p>
    </div>
  );
}
